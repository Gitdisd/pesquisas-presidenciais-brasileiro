# frozen_string_literal: true

require "json"
require "pathname"

module Pebr
  # Identity fingerprint / duplicate report over ingested national polls + witnesses.
  # Does NOT fetch live pages or invent cells. Does NOT rewrite poll JSON.
  module Normalize
    module_function

    def run(opts = {})
      poll_dir = Pathname.new(opts.fetch(:poll_dir, Pebr::NATIONAL_POLL_DIR))
      wit_dir = Pathname.new(opts.fetch(:witness_dir, Pebr::NATIONAL_WITNESS_DIR))

      polls = Dir.glob(poll_dir.join("*.json").to_s).sort.map { |p| load_json(p) }
      witnesses = Dir.glob(wit_dir.join("*.json").to_s).sort.map { |p| load_json(p) }

      errors = []
      warnings = []

      by_poll_id = Hash.new { |h, k| h[k] = [] }
      by_fingerprint = Hash.new { |h, k| h[k] = [] }
      polls.each do |poll|
        pid = poll["poll_id"]
        by_poll_id[pid] << poll
        begin
          fp = Identity.fingerprint(poll)
          by_fingerprint[fp] << poll
        rescue KeyError => e
          errors << "poll #{pid.inspect}: missing fingerprint field (#{e.message})"
        end
      end

      by_poll_id.each do |pid, rows|
        next if rows.size == 1

        errors << "duplicate poll_id #{pid.inspect} (#{rows.size} files)"
      end

      by_fingerprint.each do |fp, rows|
        next if rows.size <= 1

        ids = rows.map { |r| r["poll_id"] }.uniq
        next if ids.size <= 1

        errors << "duplicate identity fingerprint #{fp.inspect} → poll_ids #{ids.inspect}"
      end

      by_hash = Hash.new { |h, k| h[k] = [] }
      witnesses.each do |wit|
        hash = wit["content_hash"]
        next if hash.nil? || hash.to_s.strip.empty?

        by_hash[hash] << wit["witness_id"]
      end
      by_hash.each do |hash, wids|
        next if wids.uniq.size <= 1

        warnings << "shared content_hash #{hash[0, 12]}… across witnesses #{wids.uniq.inspect}"
      end

      {
        poll_count: polls.size,
        witness_count: witnesses.size,
        fingerprint_count: by_fingerprint.size,
        errors: errors,
        warnings: warnings
      }
    end

    def load_json(path)
      JSON.parse(Pathname.new(path).read)
    end
    private_class_method :load_json
  end
end
