# frozen_string_literal: true

require "json"
require "pathname"

module Pebr
  # Rebuild scenario-separated Stats ingest snapshots from data/national/polls/*.json.
  #
  # Separation (Lead must not mix series):
  #   - site/data/canonical-points.json            ← scenario == stimulated_1st_round ONLY
  #   - site/data/canonical-points-2nd-round.json  ← scenario starts with stimulated_2nd_round
  #
  # Deterministic: stable field order, poll results/residuals key order preserved,
  # sorted by (fieldwork_end, poll_id). Never invents numbers or fields.
  module Assemble
    CANONICAL_FIELDS = %w[
      poll_id
      institute_id
      fieldwork_start
      fieldwork_end
      fieldwork_mid
      geography
      election_cycle
      scenario
      sample_size
      moe
      results
      residuals
      tse_registration_id
      dataset_version
      source_path
    ].freeze

    SCENARIO_1ST = "stimulated_1st_round"
    SCENARIO_2ND_PREFIX = "stimulated_2nd_round"

    module_function

    def run(opts = {})
      poll_dir = Pathname.new(opts.fetch(:poll_dir, Pebr::NATIONAL_POLL_DIR))
      out_1st = Pathname.new(opts.fetch(:out_path, Pebr::CANONICAL_POINTS_PATH))
      out_2nd = Pathname.new(opts.fetch(:out_path_2nd, Pebr::CANONICAL_POINTS_2ND_PATH))
      dry_run = opts.fetch(:dry_run, false)

      poll_files = Dir.glob(poll_dir.join("*.json").to_s).sort
      points = poll_files.map { |path| point_from_poll_file(path) }

      first = points.select { |p| p.fetch("scenario") == SCENARIO_1ST }
      second = points.select { |p| p.fetch("scenario").start_with?(SCENARIO_2ND_PREFIX) }
      other = points.reject do |p|
        p.fetch("scenario") == SCENARIO_1ST || p.fetch("scenario").start_with?(SCENARIO_2ND_PREFIX)
      end

      unless other.empty?
        ids = other.map { |p| "#{p.fetch('poll_id')} (#{p.fetch('scenario')})" }
        raise "assemble: unhandled scenario(s) — refuse silent drop: #{ids.join(', ')}"
      end

      first.sort_by! { |p| [p.fetch("fieldwork_end"), p.fetch("poll_id")] }
      second.sort_by! { |p| [p.fetch("fieldwork_end"), p.fetch("poll_id")] }

      text_1st = "#{pretty_json(first)}\n"
      text_2nd = "#{pretty_json(second)}\n"

      if dry_run
        {
          count_1st: first.size,
          count_2nd: second.size,
          out_path: out_1st.to_s,
          out_path_2nd: out_2nd.to_s,
          changed_1st: (out_1st.file? ? out_1st.read : nil) != text_1st,
          changed_2nd: (out_2nd.file? ? out_2nd.read : nil) != text_2nd,
          text_1st: text_1st,
          text_2nd: text_2nd
        }
      else
        out_1st.dirname.mkpath
        out_1st.write(text_1st)
        out_2nd.write(text_2nd)
        {
          count_1st: first.size,
          count_2nd: second.size,
          out_path: out_1st.to_s,
          out_path_2nd: out_2nd.to_s,
          changed_1st: true,
          changed_2nd: true,
          text_1st: text_1st,
          text_2nd: text_2nd
        }
      end
    end

    def point_from_poll_file(path)
      pn = Pathname.new(path)
      poll = JSON.parse(pn.read)
      poll_id = poll.fetch("poll_id")
      stem = pn.basename(".json").to_s
      raise "filename stem #{stem.inspect} != poll_id #{poll_id.inspect}" if stem != poll_id

      point = {}
      CANONICAL_FIELDS.each do |key|
        case key
        when "source_path"
          point[key] = "data/national/polls/#{poll_id}.json"
        when "fieldwork_mid", "moe", "tse_registration_id"
          point[key] = poll.key?(key) ? poll[key] : nil
        when "results", "residuals"
          # Preserve key insertion order from the poll file (no resort invention).
          point[key] = poll.fetch(key)
        else
          point[key] = poll.fetch(key)
        end
      end
      point
    end

    # Pretty JSON matching prior cohort style: 2-space indent, empty {} / [] compact.
    def pretty_json(value, indent = 0)
      pad = "  " * indent
      case value
      when Hash
        return "{}" if value.empty?

        lines = ["{"]
        entries = value.to_a
        entries.each_with_index do |(k, v), i|
          comma = i < entries.size - 1 ? "," : ""
          rendered = pretty_json(v, indent + 1)
          lines << "#{pad}  #{k.to_json}: #{rendered}#{comma}"
        end
        lines << "#{pad}}"
        lines.join("\n")
      when Array
        return "[]" if value.empty?

        lines = ["["]
        value.each_with_index do |item, i|
          comma = i < value.size - 1 ? "," : ""
          lines << "#{pad}  #{pretty_json(item, indent + 1)}#{comma}"
        end
        lines << "#{pad}]"
        lines.join("\n")
      else
        JSON.generate(value)
      end
    end
  end
end
