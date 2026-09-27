# frozen_string_literal: true

require "json"
require "pathname"

module Pebr
  # Rebuild site/data/canonical-points.json from data/national/polls/*.json.
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

    module_function

    def run(opts = {})
      poll_dir = Pathname.new(opts.fetch(:poll_dir, Pebr::NATIONAL_POLL_DIR))
      out_path = Pathname.new(opts.fetch(:out_path, Pebr::CANONICAL_POINTS_PATH))
      dry_run = opts.fetch(:dry_run, false)

      poll_files = Dir.glob(poll_dir.join("*.json").to_s).sort
      points = poll_files.map { |path| point_from_poll_file(path) }
      points.sort_by! { |p| [p.fetch("fieldwork_end"), p.fetch("poll_id")] }

      text = "#{pretty_json(points)}\n"

      if dry_run
        existing = out_path.file? ? out_path.read : nil
        {
          count: points.size,
          out_path: out_path.to_s,
          changed: existing != text,
          text: text
        }
      else
        out_path.dirname.mkpath
        out_path.write(text)
        {
          count: points.size,
          out_path: out_path.to_s,
          changed: true,
          text: text
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
          # Preserve key insertion order from the poll file (no resorted invention).
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
