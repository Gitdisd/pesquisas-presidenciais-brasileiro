# frozen_string_literal: true

require "json"
require "yaml"
require "pathname"

module Pebr
  # Read-only inventory of configured institute / source-map entries.
  # Does NOT fetch live pages or invent poll cells.
  module Discover
    module_function

    def run(opts = {})
      sources_path = Pathname.new(opts.fetch(:sources_path, Pebr::SOURCES_JSON_PATH))
      institutes_path = Pathname.new(opts.fetch(:institutes_path, Pebr::INSTITUTES_YML_PATH))

      sources_doc = JSON.parse(sources_path.read)
      sources = Array(sources_doc["sources"])
      by_type = sources.group_by { |s| s["type"] || "unknown" }

      institutes_doc = YAML.safe_load(
        institutes_path.read,
        permitted_classes: [],
        aliases: true
      )
      institutes = Array(institutes_doc && institutes_doc["institutes"])
      active = institutes.select { |i| i["active"] }
      inactive = institutes.reject { |i| i["active"] }

      lines = []
      lines << "pebr discover: read-only inventory (no network fetch; no invented cells)"
      lines << ""
      lines << "Sources: #{sources_path}"
      lines << "  total: #{sources.size}"
      by_type.keys.sort.each do |type|
        lines << "  #{type}: #{by_type[type].size}"
      end
      lines << ""
      lines << "Institutes: #{institutes_path}"
      lines << "  total: #{institutes.size}  active: #{active.size}  inactive/stub: #{inactive.size}"
      lines << "  active ids:"
      active.sort_by { |i| i["institute_id"].to_s }.each do |inst|
        lines << "    - #{inst['institute_id']}  (#{inst['display_name']})"
      end
      lines << ""
      lines << "Note: new polls still need human primary check (witness fetch + content_hash)"
      lines << "before entering data/national/polls. discover does not scrape."

      {
        lines: lines,
        source_count: sources.size,
        institute_active: active.size,
        institute_total: institutes.size
      }
    end
  end
end
