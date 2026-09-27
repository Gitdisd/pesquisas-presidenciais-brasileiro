# frozen_string_literal: true

require "json"
require "pathname"

module Pebr
  # Identity fingerprint + anti-replicate report over national AND regional polls/witnesses.
  # Does NOT fetch live pages or invent cells. Does NOT rewrite poll JSON.
  # See docs/cross-reference.md.
  module Normalize
    module_function

    def run(opts = {})
      trees = opts.fetch(:trees) do
        [
          {
            label: "national",
            poll_dir: Pebr::NATIONAL_POLL_DIR,
            wit_dir: Pebr::NATIONAL_WITNESS_DIR,
            expect_geography: "national"
          },
          {
            label: "regional",
            poll_dir: Pebr::REGIONAL_POLL_DIR,
            wit_dir: Pebr::REGIONAL_WITNESS_DIR,
            expect_geography: "state"
          }
        ]
      end

      errors = []
      warnings = []
      poll_count = 0
      witness_count = 0
      fingerprint_count = 0

      trees.each do |tree|
        result = run_tree(tree)
        poll_count += result[:poll_count]
        witness_count += result[:witness_count]
        fingerprint_count += result[:fingerprint_count]
        errors.concat(result[:errors])
        warnings.concat(result[:warnings])
      end

      {
        poll_count: poll_count,
        witness_count: witness_count,
        fingerprint_count: fingerprint_count,
        errors: errors,
        warnings: warnings
      }
    end

    def run_tree(tree)
      label = tree.fetch(:label)
      poll_dir = Pathname.new(tree.fetch(:poll_dir))
      wit_dir = Pathname.new(tree.fetch(:wit_dir))
      expect_geo = tree.fetch(:expect_geography)

      polls = Dir.glob(poll_dir.join("*.json").to_s).sort.map { |p| load_json(p) }
      witnesses = Dir.glob(wit_dir.join("*.json").to_s).sort.map { |p| load_json(p) }

      errors = []
      warnings = []

      by_poll_id = Hash.new { |h, k| h[k] = [] }
      by_fingerprint = Hash.new { |h, k| h[k] = [] }
      by_soft_twin = Hash.new { |h, k| h[k] = [] }
      by_tse_scenario = Hash.new { |h, k| h[k] = [] }

      polls.each do |poll|
        pid = poll["poll_id"]
        by_poll_id[pid] << poll

        geo = poll["geography"].to_s
        if geo != expect_geo
          errors << "#{label} poll #{pid.inspect}: geography #{geo.inspect} != expected #{expect_geo.inspect}"
        end
        if expect_geo == "state" && poll["uf"].to_s.strip.empty?
          errors << "#{label} poll #{pid.inspect}: missing required uf"
        end
        if expect_geo == "national" && poll.key?("uf") && !poll["uf"].nil?
          errors << "#{label} poll #{pid.inspect}: unexpected uf field on national poll (#{poll['uf'].inspect})"
        end

        begin
          fp = Identity.fingerprint(poll)
          by_fingerprint[fp] << poll
          soft = Identity.soft_twin_key(poll)
          by_soft_twin[soft] << poll
        rescue KeyError => e
          errors << "#{label} poll #{pid.inspect}: missing fingerprint field (#{e.message})"
        end

        tse = poll["tse_registration_id"]
        if tse && !tse.to_s.strip.empty?
          tse_key = [tse.to_s, poll["scenario"].to_s, geo, poll["uf"].to_s].join("|")
          by_tse_scenario[tse_key] << poll
        end
      end

      by_poll_id.each do |pid, rows|
        next if rows.size == 1

        errors << "#{label}: duplicate poll_id #{pid.inspect} (#{rows.size} files)"
      end

      by_fingerprint.each do |fp, rows|
        next if rows.size <= 1

        ids = rows.map { |r| r["poll_id"] }.uniq
        next if ids.size <= 1

        errors << "#{label}: duplicate identity fingerprint #{fp.inspect} → poll_ids #{ids.inspect}"
      end

      by_soft_twin.each do |soft, rows|
        next if rows.size <= 1

        ids = rows.map { |r| r["poll_id"] }.uniq
        next if ids.size <= 1

        # If fingerprints already identical, fingerprint error covers it; still error soft twins
        # with different fieldwork_start that would plot as near-duplicates.
        fps = rows.map { |r| Identity.fingerprint(r) rescue r["poll_id"] }.uniq
        errors << "#{label}: near-duplicate soft twin #{soft.inspect} → poll_ids #{ids.inspect} (fingerprints #{fps.inspect})"
      end

      by_tse_scenario.each do |tse_key, rows|
        next if rows.size <= 1

        ids = rows.map { |r| r["poll_id"] }.uniq
        next if ids.size <= 1

        warnings << "#{label}: shared TSE+scenario+geo across poll_ids #{ids.inspect} (key #{tse_key.inspect}) — human review; do not auto-merge"
      end

      by_hash = Hash.new { |h, k| h[k] = [] }
      by_url = Hash.new { |h, k| h[k] = [] }
      witnesses.each do |wit|
        hash = wit["content_hash"]
        if hash && !hash.to_s.strip.empty?
          by_hash[hash] << wit["witness_id"]
        end
        url = Identity.normalize_url(wit["source_url"])
        next if url.empty?

        by_url[url] << { witness_id: wit["witness_id"], poll_id: wit["poll_id"] }
      end
      by_hash.each do |hash, wids|
        next if wids.uniq.size <= 1

        warnings << "#{label}: shared content_hash #{hash[0, 12]}… across witnesses #{wids.uniq.inspect}"
      end
      poll_by_id = {}
      polls.each { |p| poll_by_id[p["poll_id"]] = p }
      by_url.each do |url, rows|
        pids = rows.map { |r| r[:poll_id] }.compact.uniq.reject { |p| p.nil? || p.to_s.empty? }
        next if pids.size <= 1

        # One URL → many poll_ids is normal for 1º+2º siblings. Warn only when the same
        # scenario appears twice (true replicate risk).
        by_scenario = Hash.new { |h, k| h[k] = [] }
        pids.each do |pid|
          poll = poll_by_id[pid]
          next unless poll

          by_scenario[poll["scenario"].to_s] << pid
        end
        by_scenario.each do |scenario, ids|
          next if ids.uniq.size <= 1

          warnings << "#{label}: source_url #{url.inspect} linked to same scenario #{scenario.inspect} via poll_ids #{ids.uniq.inspect} — replicate risk"
        end
      end

      {
        poll_count: polls.size,
        witness_count: witnesses.size,
        fingerprint_count: by_fingerprint.size,
        errors: errors,
        warnings: warnings
      }
    end
    private_class_method :run_tree

    def load_json(path)
      JSON.parse(Pathname.new(path).read)
    end
    private_class_method :load_json
  end
end
