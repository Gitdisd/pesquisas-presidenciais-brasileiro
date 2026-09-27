# frozen_string_literal: true

require "json"
require "pathname"

module Pebr
  # Rebuild scenario-separated Stats ingest snapshots.
  #
  # National (NEVER include regional/state rows):
  #   - site/data/canonical-points.json            ← scenario == stimulated_1st_round ONLY
  #   - site/data/canonical-points-2nd-round.json  ← scenario starts with stimulated_2nd_round
  #
  # Regional (parallel; never merged into national files):
  #   - site/data/canonical-points-regional.json  ← all scenarios from data/regional/polls
  #
  # Provenance retained: poll_id, institute_id, sample_size (N), geography, uf (regional),
  # scenario, source_path, optional tse_registration_id.
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

    REGIONAL_FIELDS = (
      CANONICAL_FIELDS[0..5] + %w[uf] + CANONICAL_FIELDS[6..]
    ).freeze

    SCENARIO_1ST = "stimulated_1st_round"
    SCENARIO_2ND_PREFIX = "stimulated_2nd_round"

    module_function

    def run(opts = {})
      national = run_national(opts)
      regional = run_regional(opts)
      national.merge(
        count_regional: regional[:count],
        out_path_regional: regional[:out_path],
        changed_regional: regional[:changed],
        text_regional: regional[:text]
      )
    end

    def run_national(opts = {})
      poll_dir = Pathname.new(opts.fetch(:poll_dir, Pebr::NATIONAL_POLL_DIR))
      out_1st = Pathname.new(opts.fetch(:out_path, Pebr::CANONICAL_POINTS_PATH))
      out_2nd = Pathname.new(opts.fetch(:out_path_2nd, Pebr::CANONICAL_POINTS_2ND_PATH))
      dry_run = opts.fetch(:dry_run, false)

      poll_files = Dir.glob(poll_dir.join("*.json").to_s).sort
      points = poll_files.map { |path| point_from_poll_file(path, tree: :national) }
      assert_unique_fingerprints!(points, label: "national")

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

    def run_regional(opts = {})
      poll_dir = Pathname.new(opts.fetch(:regional_poll_dir, Pebr::REGIONAL_POLL_DIR))
      out = Pathname.new(opts.fetch(:out_path_regional, Pebr::CANONICAL_POINTS_REGIONAL_PATH))
      dry_run = opts.fetch(:dry_run, false)

      poll_files = Dir.glob(poll_dir.join("*.json").to_s).sort
      points = poll_files.map { |path| point_from_poll_file(path, tree: :regional) }
      assert_unique_fingerprints!(points, label: "regional")

      # Refuse any national geography leak into regional assemble.
      leaks = points.reject { |p| p.fetch("geography") == "state" }
      unless leaks.empty?
        ids = leaks.map { |p| p.fetch("poll_id") }
        raise "assemble regional: non-state geography refused: #{ids.join(', ')}"
      end

      other = points.reject do |p|
        p.fetch("scenario") == SCENARIO_1ST || p.fetch("scenario").start_with?(SCENARIO_2ND_PREFIX)
      end
      unless other.empty?
        ids = other.map { |p| "#{p.fetch('poll_id')} (#{p.fetch('scenario')})" }
        raise "assemble regional: unhandled scenario(s) — refuse silent drop: #{ids.join(', ')}"
      end

      points.sort_by! { |p| [p.fetch("uf"), p.fetch("fieldwork_end"), p.fetch("poll_id")] }
      text = "#{pretty_json(points)}\n"

      if dry_run
        {
          count: points.size,
          out_path: out.to_s,
          changed: (out.file? ? out.read : nil) != text,
          text: text
        }
      else
        out.dirname.mkpath
        out.write(text)
        {
          count: points.size,
          out_path: out.to_s,
          changed: true,
          text: text
        }
      end
    end

    def assert_unique_fingerprints!(points, label:)
      by_fp = Hash.new { |h, k| h[k] = [] }
      points.each do |p|
        fp = Identity.fingerprint(p)
        by_fp[fp] << p.fetch("poll_id")
      end
      by_fp.each do |fp, ids|
        uniq = ids.uniq
        next if uniq.size <= 1

        raise "assemble #{label}: fingerprint collision #{fp.inspect} → #{uniq.inspect}"
      end
    end
    private_class_method :assert_unique_fingerprints!

    def point_from_poll_file(path, tree:)
      pn = Pathname.new(path)
      poll = JSON.parse(pn.read)
      poll_id = poll.fetch("poll_id")
      stem = pn.basename(".json").to_s
      raise "filename stem #{stem.inspect} != poll_id #{poll_id.inspect}" if stem != poll_id

      case tree
      when :national
        if poll.fetch("geography") != "national"
          raise "assemble national: refused non-national geography for #{poll_id.inspect}"
        end
        if poll.key?("uf") && !poll["uf"].nil?
          raise "assemble national: refused uf field on #{poll_id.inspect} (regional leak)"
        end
        fields = CANONICAL_FIELDS
        source_path = "data/national/polls/#{poll_id}.json"
      when :regional
        if poll.fetch("geography") != "state"
          raise "assemble regional: refused non-state geography for #{poll_id.inspect}"
        end
        raise "assemble regional: missing uf for #{poll_id.inspect}" if poll["uf"].to_s.strip.empty?

        fields = REGIONAL_FIELDS
        source_path = "data/regional/polls/#{poll_id}.json"
      else
        raise "unknown assemble tree #{tree.inspect}"
      end

      point = {}
      fields.each do |key|
        case key
        when "source_path"
          point[key] = source_path
        when "fieldwork_mid", "moe", "tse_registration_id"
          point[key] = poll.key?(key) ? poll[key] : nil
        when "results", "residuals"
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
