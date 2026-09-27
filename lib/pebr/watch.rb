# frozen_string_literal: true

require "json"
require "yaml"
require "pathname"
require "digest"
require "uri"
require "net/http"
require "time"
require "set"
require_relative "watch_policy"

module Pebr
  # Human-gated discovery watcher.
  # Patterns ported from pesquisas-eleitorais-br (discover-polls / discover-policy):
  #   config-driven listings + RSS, URL canonicalize, link score/reject,
  #   last-run report, soft fetch failures, staging under data/*/discovery/.
  # PEBR difference: NEVER extracts or invents poll shares — queue = review candidates only.
  module Watch
    module_function

    QUEUE_SCHEMA_NOTE =
      "Candidates for human review only. No poll shares. Do not ingest automatically."

    def run(opts = {})
      root = Pathname.new(opts.fetch(:root, File.expand_path("../..", __dir__)))
      config_path = Pathname.new(opts.fetch(:config_path, root.join("config/watch_targets.yml")))
      mode = (opts[:mode] || :offline).to_sym # :offline | :fetch
      now = opts[:now] || Time.now.utc
      detected_at = now.iso8601
      min_score = Integer(opts[:min_score] || 35)

      config = load_config(config_path)
      queue_rel = config.fetch("queue_path", "data/national/discovery/queue.json")
      inbox_rel = config.fetch("inbox_path", "data/national/discovery/inbox")
      out_path = Pathname.new(opts.fetch(:out_path, root.join(queue_rel)))
      last_run_path = Pathname.new(
        opts.fetch(:last_run_path, out_path.dirname.join("last-run.json"))
      )

      witnessed = load_witnessed_urls(root)
      existing = load_existing_queue(out_path)
      watermark = load_watermark(root)

      targets = Array(config["targets"]).select { |t| t["enabled"] != false }
      hint_rules = Array(config["scenario_hint_rules"]).map do |rule|
        { re: Regexp.new(rule.fetch("pattern"), Regexp::IGNORECASE), hint: rule.fetch("hint") }
      end
      keywords = Array(config["keywords"]).map { |k| k.to_s.downcase }

      ua = config.fetch("user_agent", "PEBR-discovery")
      timeout = Integer(opts[:timeout] || config["request_timeout_sec"] || 20)
      max_links = Integer(config["max_links_per_target"] || 40)

      items = []
      errors = []
      fetched = 0
      skipped = 0
      rejected_count = 0
      source_health = []

      targets.each do |target|
        body, source_kind, err = load_body(target, mode: mode, root: root, ua: ua, timeout: timeout)
        health = {
          "target_id" => target["id"],
          "source_id" => target["source_id"],
          "url" => target["url"],
          "mode" => source_kind.to_s,
          "ok" => err.nil?
        }
        if err
          errors << "#{target['id']}: #{err}"
          skipped += 1
          health["error"] = err
          source_health << health
          next
        end
        fetched += 1 if source_kind == :network || source_kind == :archive
        listing_hash = "sha256:#{Digest::SHA256.hexdigest(body)}"
        health["listing_content_hash"] = listing_hash
        health["bytes"] = body.bytesize
        health["via"] = source_kind.to_s
        source_health << health

        candidates = extract_candidates(target, body)
        kept = 0
        candidates.each do |cand|
          policy = WatchPolicy.classify_poll_link(cand[:url], "#{cand[:title]} #{cand[:snippet]}")
          if policy[:rejected]
            rejected_count += 1
            next
          end
          unless keep_with_keywords?(policy, cand, keywords, min_score)
            rejected_count += 1
            next
          end

          url = policy[:url]
          title = cand[:title].to_s.strip
          snippet = cand[:snippet].to_s.strip
          hints = scenario_hints("#{title} #{url} #{snippet}", hint_rules)

          prev = existing[normalize_url(url)]
          metadata = metadata_diff(
            { "lastmod" => prev && prev["lastmod"], "published_at" => prev && prev["published_at"] }.compact,
            { "lastmod" => cand[:lastmod], "published_at" => cand[:published_at] }.compact
          )
          score = policy[:score]
          score_reasons = policy[:reasons].dup
          if (target["kind"] || "").to_s == "lead_list"
            score_reasons << "old-site-lead"
            score = [score, 40].max
          end
          if prev.nil?
            score += 4
            score_reasons << "new-signal"
          elsif !metadata.empty?
            score += 8
            score_reasons << "metadata-updated"
          end
          status =
            if witnessed.include?(normalize_url(url))
              "already_witnessed"
            elsif score < min_score
              "inbox_low_score" # signal only — human still required; not auto-ingested
            else
              "needs_human_review"
            end
          item = {
            "url" => url,
            "source_id" => target["source_id"] || target["id"],
            "target_id" => target["id"],
            "detected_at" => (prev && prev["detected_at"]) || detected_at,
            "last_seen_at" => detected_at,
            "title" => title.empty? ? nil : title,
            "snippet" => snippet.empty? ? nil : truncate(snippet, 280),
            "scenario_hints" => hints,
            "score" => score,
            "score_reasons" => score_reasons.uniq,
            "listing_url" => target["url"],
            "listing_content_hash" => listing_hash,
            "listing_via" => ((target["kind"] || "").to_s == "lead_list" ? "old_site_harvest" : source_kind.to_s),
            "national_hint" => target["national_hint"] == true,
            "status" => status,
            "kind" => target["kind"],
            "lastmod" => cand[:lastmod],
            "published_at" => cand[:published_at],
            "metadata_changed" => (!metadata.empty? && !prev.nil?),
            "metadata_diff" => metadata.empty? ? nil : metadata
          }
          item.compact!
          item["status"] = status
          item["scenario_hints"] = hints
          item["score"] = score
          item["score_reasons"] = score_reasons.uniq
          items << item
          kept += 1
          break if kept >= max_links
        end
      end

      # Human-saved HTML/PDF files are an evidence handoff, not a parser input.
      # Index their path/hash and optional sidecar URL so an operator can review
      # and create a witness without the watcher ever reading poll cells.
      drop_items, drop_errors = load_inbox_items(
        root,
        inbox_rel,
        detected_at: detected_at,
        existing: existing,
        witnessed: witnessed,
        now: now
      )
      items.concat(drop_items)
      errors.concat(drop_errors)

      merged = merge_items(existing.values, items)
      merged = scrub_queue_items(merged)
      merged.each { |it| it["review_bucket"] = review_bucket_for(it) }
      merged.sort_by! do |it|
        status_rank =
          case it["status"]
          when "needs_human_review" then 0
          when "inbox_low_score" then 1
          else 2
          end
        bucket_rank =
          case it["review_bucket"]
          when "human_drop_new" then 0
          when "primary_document" then 1
          when "national_press" then 2
          when "old_site_lead" then 3
          when "provenance" then 4
          when "regional_breakout" then 5
          when "aggregator" then 6
          else 7
          end
        [
          status_rank,
          bucket_rank,
          -(it["score"] || 0).to_i,
          -(Time.parse(it["last_seen_at"] || it["detected_at"] || detected_at).to_i),
          it["url"].to_s
        ]
      end

      counts = {
        "targets_enabled" => targets.size,
        "targets_fetched_live" => fetched,
        "targets_skipped" => skipped,
        "items" => merged.size,
        "needs_human_review" => merged.count { |i| i["status"] == "needs_human_review" },
        "already_witnessed" => merged.count { |i| i["status"] == "already_witnessed" },
        "inbox_low_score" => merged.count { |i| i["status"] == "inbox_low_score" },
        "human_drop_files" => merged.count { |i| i["kind"] == "human_drop" || i["listing_via"] == "human_drop" },
        "rejected_links" => rejected_count,
        "by_review_bucket" => merged.each_with_object({}) { |i, h| k = i["review_bucket"]; h[k] = h.fetch(k, 0) + 1 }
      }

      operator_summary = build_operator_summary(merged)

      doc = {
        "meta" => {
          "generated_at" => detected_at,
          "generator" => "pebr watch",
          "pebr_version" => Pebr::VERSION,
          "mode" => mode.to_s,
          "config" => relative_to(config_path, root),
          "disclaimer" => QUEUE_SCHEMA_NOTE,
          "heritage" => "Patterns adapted from Gitdisd/pesquisas-eleitorais-br discover-polls (listings/RSS/policy) + archive.org fallback. PEBR does not auto-extract shares.",
          "watermark_fieldwork_end" => watermark,
          "counts" => counts,
          "operator_summary" => operator_summary,
          "holds" => [
            "Michelle out",
            "Ipec 2026 national stimulated 1º hard-stop",
            "Quaest Jun 08 dirty residuals",
            "no image-PDF inventing"
          ]
        },
        "items" => merged
      }

      report = {
        "ran_at" => detected_at,
        "mode" => mode.to_s,
        "watermark_fieldwork_end" => watermark,
        "targets" => targets.size,
        "live_fetched" => fetched,
        "skipped" => skipped,
        "rejected_links" => rejected_count,
        "queue_items" => merged.size,
        "needs_human_review" => counts["needs_human_review"],
        "already_witnessed" => counts["already_witnessed"],
        "inbox_low_score" => counts["inbox_low_score"],
        "human_drop_files" => counts["human_drop_files"],
        "inbox_path" => inbox_rel,
        "fetch_errors" => errors,
        "source_health" => source_health,
        "out_path" => relative_to(out_path, root),
        "disclaimer" => QUEUE_SCHEMA_NOTE
      }

      unless opts[:dry_run]
        out_path.dirname.mkpath
        out_path.write(JSON.pretty_generate(doc) + "\n")
        last_run_path.write(JSON.pretty_generate(report) + "\n")
      end

      {
        doc: doc,
        report: report,
        out_path: out_path.to_s,
        last_run_path: last_run_path.to_s,
        errors: errors,
        lines: summary_lines(doc, errors, mode, out_path)
      }
    end

    def load_config(path)
      raise "watch config missing: #{path}" unless path.file?

      YAML.safe_load(path.read, permitted_classes: [], aliases: true) || {}
    end

    def load_witnessed_urls(root)
      wit_dir = root.join("data/national/witnesses")
      urls = Set.new
      return urls unless wit_dir.directory?

      Dir.glob(wit_dir.join("*.json").to_s).each do |path|
        data = JSON.parse(File.read(path))
        u = data["source_url"]
        next if u.nil? || u.empty?

        urls << normalize_url(WatchPolicy.canonicalize_url(u))
      rescue JSON::ParserError
        next
      end
      urls
    end

    def load_existing_queue(path)
      return {} unless path.file?

      doc = JSON.parse(path.read)
      Array(doc["items"]).each_with_object({}) do |item, acc|
        u = item["url"]
        next if u.nil? || u.empty?

        acc[normalize_url(u)] = item
      end
    rescue JSON::ParserError
      {}
    end

    # Index human-saved evidence without parsing HTML/PDF bodies. A sidecar named
    # <document>.<ext>.json may provide source_url, title, and source_id.
    def load_inbox_items(root, inbox_rel, detected_at:, existing:, witnessed: Set.new, now:)
      inbox = root.join(inbox_rel)
      return [[], []] unless inbox.directory?

      items = []
      errors = []
      allowed = %w[.html .htm .pdf]
      Dir.glob(inbox.join("*").to_s).sort.each do |path_str|
        path = Pathname.new(path_str)
        next unless path.file? && allowed.include?(path.extname.downcase)

        sidecar = Pathname.new("#{path}.json")
        meta = {}
        if sidecar.file?
          begin
            raw = JSON.parse(sidecar.read)
            meta = raw.select { |k, _| %w[source_url title source_id retrieved_at].include?(k) } if raw.is_a?(Hash)
          rescue JSON::ParserError => e
            errors << "human drop #{path.basename}: invalid sidecar JSON (#{e.message})"
          end
        end

        relative = path.relative_path_from(root).to_s
        local_url = "file://#{path.expand_path}"
        source_url = meta["source_url"].to_s.strip
        queue_url = source_url.empty? ? local_url : WatchPolicy.canonicalize_url(source_url)
        title = meta["title"].to_s.strip
        title = path.basename.to_s if title.empty?
        source_id = meta["source_id"].to_s.strip
        source_id = "human-drop" if source_id.empty?
        digest = "sha256:#{Digest::SHA256.file(path).hexdigest}"
        prev = existing[normalize_url(queue_url)]
        policy = WatchPolicy.classify_poll_link(queue_url, title)
        current_meta = { "lastmod" => nil, "published_at" => meta["retrieved_at"] }.compact
        previous_meta = {
          "lastmod" => prev && prev["lastmod"],
          "published_at" => prev && prev["published_at"]
        }.compact
        item = {
          "url" => queue_url,
          "source_id" => source_id,
          "target_id" => "human-drop",
          "detected_at" => (prev && prev["detected_at"]) || detected_at,
          "last_seen_at" => detected_at,
          "title" => title,
          "snippet" => "Human-saved #{path.extname.downcase} evidence; inspect manually. No share extraction.",
          "scenario_hints" => [],
          "score" => [policy[:score], 50].max,
          "score_reasons" => (policy[:reasons] + ["human-drop", "content-hash"]).uniq,
          "listing_url" => source_url.empty? ? nil : source_url,
          "listing_content_hash" => digest,
          "listing_via" => "human_drop",
          "national_hint" => true,
          "status" => (witnessed.include?(normalize_url(queue_url)) ? "already_witnessed" : "needs_human_review"),
          "kind" => "human_drop",
          "local_path" => relative,
          "content_hash" => digest,
          "source_type" => path.extname.delete_prefix(".").downcase,
          "retrieved_at" => meta["retrieved_at"],
          "metadata_changed" => prev && previous_meta != current_meta,
          "metadata_diff" => metadata_diff(previous_meta, current_meta)
        }
        item.compact!
        items << item
      rescue Errno::EACCES, Errno::ENOENT => e
        errors << "human drop #{path_str}: #{e.class}: #{e.message}"
      end
      [items, errors]
    end


    # JSON lead lists (e.g. old-site harvest). URLs/titles/metadata only — never shares.
    def extract_lead_list(body)
      data = JSON.parse(body)
      rows =
        if data.is_a?(Hash)
          Array(data["items"] || data["leads"] || data["urls"])
        elsif data.is_a?(Array)
          data
        else
          []
        end
      results = []
      rows.each do |row|
        next unless row.is_a?(Hash)
        url = row["url"].to_s.strip
        next if url.empty?
        results << {
          url: url,
          title: row["title"].to_s,
          snippet: row["snippet"].to_s,
          published_at: row["published_at"] || row["published_date"],
          lastmod: row["lastmod"]
        }.compact
      end
      results.uniq { |r| normalize_url(WatchPolicy.canonicalize_url(r[:url])) }
    rescue JSON::ParserError
      []
    end


    # Drop or demote persisted queue rows that current policy rejects (stale governo/Michelle/nav).
    def scrub_queue_items(items)
      kept = []
      items.each do |it|
        policy = WatchPolicy.classify_poll_link(it["url"], "#{it['title']} #{it['snippet']}")
        if policy[:rejected]
          next if %w[wrong-office hold-michelle-out nav-noise social generic-route].intersect?(policy[:reasons].map(&:to_s))

          it = it.dup
          it["score"] = [policy[:score], 0].min
          it["score_reasons"] = (Array(it["score_reasons"]) + policy[:reasons] + ["policy-rescored"]).uniq
          it["status"] = "inbox_low_score" unless it["status"] == "already_witnessed"
        elsif policy[:reasons].map(&:to_s).include?("hold-ipec-hard-stop") || policy[:reasons].map(&:to_s).include?("regional-breakout")
          it = it.dup
          it["score"] = policy[:score]
          it["score_reasons"] = (Array(it["score_reasons"]) + policy[:reasons] + ["policy-rescored"]).uniq
          if it["status"] == "needs_human_review" && policy[:score] < 35
            it["status"] = "inbox_low_score"
          end
        end
        kept << it
      end
      kept
    end

    def review_bucket_for(item)
      reasons = Array(item["score_reasons"]).map(&:to_s)
      via = item["listing_via"].to_s
      kind = item["kind"].to_s
      url = item["url"].to_s
      title = item["title"].to_s
      if kind == "human_drop" && item["status"] != "already_witnessed"
        "human_drop_new"
      elsif kind == "human_drop"
        "human_drop_done"
      elsif via == "old_site_harvest" || item["target_id"].to_s.include?("old-site") || reasons.include?("old-site-lead")
        "old_site_lead"
      elsif reasons.include?("regional-breakout") || reasons.include?("regional-cut")
        "regional_breakout"
      elsif /news\.google|wikipedia\.org/i.match?(url) || reasons.include?("aggregator-signal")
        "aggregator"
      elsif /tse|pesqele|trademap|wayback|dadosabertos/i.match?(url) || reasons.include?("tse-registration-signal")
        "provenance"
      elsif /\.pdf(?:\?|$)/i.match?(url) || reasons.include?("document")
        "primary_document"
      elsif item["national_hint"] == true && item["status"] == "needs_human_review"
        "national_press"
      else
        "other"
      end
    end

    def build_operator_summary(items)
      needs = items.select { |i| i["status"] == "needs_human_review" }
      {
        "work_top_down" => true,
        "next_actions" => [
          "Open human_drop_new / primary_document first",
          "Confirm national presidential + extractable primary before dual-enter",
          "Skip already_witnessed, regional_breakout, aggregator-only, and hold-tagged items",
          "Never copy old-site shares into canonical — leads only"
        ],
        "needs_human_review_top" => needs.first(12).map { |i|
          {
            "review_bucket" => i["review_bucket"],
            "score" => i["score"],
            "title" => i["title"] || i["url"],
            "url" => i["url"],
            "source_id" => i["source_id"]
          }
        },
        "bucket_counts_needs_review" => needs.each_with_object({}) { |i, h| k = i["review_bucket"]; h[k] = h.fetch(k, 0) + 1 }
      }
    end

    def metadata_diff(previous, current)
      # A source that lacks a date must not erase a date learned from another
      # target for the same URL; compare only metadata present in this reading.
      keys = current.keys
      keys.each_with_object({}) do |key, diff|
        old = previous[key]
        new_value = current[key]
        diff[key] = { "previous" => old, "current" => new_value } if old != new_value
      end
    end

    # Watermark = max fieldwork_end among national polls (informational; not a hard filter yet).
    def load_watermark(root)
      poll_dir = root.join("data/national/polls")
      return nil unless poll_dir.directory?

      max = nil
      Dir.glob(poll_dir.join("*.json").to_s).each do |path|
        data = JSON.parse(File.read(path))
        fe = data["fieldwork_end"]
        next unless fe.is_a?(String) && fe.match?(/\A\d{4}-\d{2}-\d{2}\z/)

        max = fe if max.nil? || fe > max
      rescue JSON::ParserError
        next
      end
      max
    end

    def load_body(target, mode:, root:, ua:, timeout:)
      fixture_rel = target["fixture"]
      allow_fetch = target.key?("fetch") ? target["fetch"] != false : true
      max_redirects = Integer(target["max_redirects"] || 5)

      if mode == :offline
        return [nil, :none, "no fixture configured for offline mode"] if fixture_rel.nil? || fixture_rel.empty?

        path = root.join(fixture_rel)
        return [nil, :none, "fixture missing: #{fixture_rel}"] unless path.file?

        return [path.read, :fixture, nil]
      end

      if !allow_fetch && fixture_rel
        path = root.join(fixture_rel)
        return [nil, :none, "fetch disabled and fixture missing"] unless path.file?

        return [path.read, :fixture, nil]
      end

      return [nil, :none, "fetch disabled for target"] unless allow_fetch

      body, err = http_get(target["url"], ua: ua, timeout: timeout, max_redirects: max_redirects)
      return [body, :network, nil] if err.nil?

      # Optional archive.org fallback for listing_html (public snapshots only — no paywall bypass).
      if target["archive_fallback"] == true && (target["kind"] || "listing_html").to_s == "listing_html"
        snap = wayback_snapshot_url(target["url"], ua: ua, timeout: timeout)
        if snap
          body2, err2 = http_get(snap, ua: ua, timeout: timeout, max_redirects: max_redirects)
          return [body2, :archive, nil] if err2.nil?
          return [nil, :none, "primary: #{err}; archive: #{err2}"]
        end
        return [nil, :none, "primary: #{err}; archive: no snapshot"]
      end

      [nil, :none, err]
    end

    # Follow redirects (Net::HTTP does not by default). Soft-fail on loops / non-HTTP.
    def http_get(url, ua:, timeout:, max_redirects: 5)
      current = url.to_s
      redirects = 0
      loop do
        uri = URI.parse(current)
        unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
          return [nil, "unsupported URL scheme"]
        end

        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = uri.scheme == "https"
        http.open_timeout = timeout
        http.read_timeout = timeout
        path = uri.request_uri
        path = "/" if path.nil? || path.empty?
        req = Net::HTTP::Get.new(path)
        req["User-Agent"] = ua
        req["Accept"] = "text/html,application/xhtml+xml,application/xml,application/rss+xml,*/*;q=0.8"
        req["Accept-Language"] = "pt-BR,pt;q=0.9,en;q=0.8"
        res = http.request(req)

        if res.is_a?(Net::HTTPRedirection)
          loc = res["location"].to_s
          return [nil, "redirect without Location (HTTP #{res.code})"] if loc.empty?
          current = begin
            URI.join(current, loc).to_s
          rescue URI::InvalidURIError, ArgumentError
            loc
          end
          redirects += 1
          return [nil, "too many redirects (>#{max_redirects})"] if redirects > max_redirects
          next
        end

        return [nil, "HTTP #{res.code}"] unless res.is_a?(Net::HTTPSuccess)

        body = res.body.to_s.force_encoding("UTF-8").encode("UTF-8", invalid: :replace, undef: :replace)
        return [body, nil]
      end
    rescue StandardError => e
      [nil, "#{e.class}: #{e.message}"]
    end

    # Public Wayback Machine availability API (ToS-safe read of archived public pages).
    # Returns snapshot URL or nil. Never invents content.
    def wayback_snapshot_url(original_url, ua:, timeout:)
      api = "https://archive.org/wayback/available?url=#{URI.encode_www_form_component(original_url)}"
      body, err = http_get(api, ua: ua, timeout: timeout)
      return nil if err || body.nil? || body.empty?

      parse_wayback_available(body)
    rescue StandardError
      nil
    end

    # Pure JSON parse of archive.org /wayback/available response (testable offline).
    def parse_wayback_available(body)
      data = JSON.parse(body)
      closest = data.dig("archived_snapshots", "closest")
      return nil unless closest.is_a?(Hash) && (closest["available"] == true || closest["available"] == "true")

      snap = closest["url"].to_s
      return nil if snap.empty?

      snap.sub(%r{\Ahttp://}, "https://")
    rescue JSON::ParserError
      nil
    end

    def extract_candidates(target, body)
      kind = (target["kind"] || "listing_html").to_s
      base = target["url"].to_s
      case kind
      when "listing_html" then extract_html_links(body, base)
      when "rss" then extract_rss_items(body)
      when "sitemap" then extract_sitemap_locs(body)
      when "lead_list" then extract_lead_list(body)
      else
        []
      end
    end

    def extract_html_links(html, base_url)
      results = []
      html.scan(/<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/im) do |href, inner|
        url = absolutize(href, base_url)
        next unless url

        title = strip_tags(inner).gsub(/\s+/, " ").strip
        results << { url: url, title: title, snippet: title }
      end
      results.uniq { |r| normalize_url(WatchPolicy.canonicalize_url(r[:url])) }
    end

    def extract_rss_items(xml)
      results = []
      xml.scan(/<item\b.*?<\/item>/im) do |block|
        title = block[/<title[^>]*>(.*?)<\/title>/im, 1]
        link = block[/<link[^>]*>(.*?)<\/link>/im, 1]
        link = block[/<link[^>]*href\s*=\s*["']([^"']+)["']/im, 1] if link.nil? || link.strip.empty?
        desc = block[/<description[^>]*>(.*?)<\/description>/im, 1]
        next if link.nil? || link.strip.empty?

        pub = block[/<pubDate[^>]*>(.*?)<\/pubDate>/im, 1]
        results << {
          url: strip_tags(link).strip,
          title: strip_cdata(strip_tags(title.to_s)).strip,
          snippet: strip_cdata(strip_tags(desc.to_s)).strip,
          published_at: strip_tags(pub.to_s).strip.empty? ? nil : strip_tags(pub.to_s).strip
        }
      end
      xml.scan(/<entry\b.*?<\/entry>/im) do |block|
        title = block[/<title[^>]*>(.*?)<\/title>/im, 1]
        link = block[/<link[^>]*href\s*=\s*["']([^"']+)["']/im, 1]
        link ||= block[/<link[^>]*>(.*?)<\/link>/im, 1]
        summary = block[/<summary[^>]*>(.*?)<\/summary>/im, 1] ||
                  block[/<content[^>]*>(.*?)<\/content>/im, 1]
        updated = block[/<updated[^>]*>(.*?)<\/updated>/im, 1] ||
                  block[/<published[^>]*>(.*?)<\/published>/im, 1]
        next if link.nil? || link.strip.empty?

        results << {
          url: strip_tags(link).strip,
          title: strip_cdata(strip_tags(title.to_s)).strip,
          snippet: strip_cdata(strip_tags(summary.to_s)).strip,
          published_at: strip_tags(updated.to_s).strip.empty? ? nil : strip_tags(updated.to_s).strip
        }
      end
      results.uniq { |r| normalize_url(WatchPolicy.canonicalize_url(r[:url])) }
    end

    def extract_sitemap_locs(xml)
      results = []
      # Prefer <url> blocks so lastmod (if present) attaches to the loc.
      xml.scan(/<url\b[\s\S]*?<\/url>/im) do |block|
        loc = block[/<loc>\s*([^<]+?)\s*<\/loc>/im, 1]
        next if loc.nil?

        url = loc.strip
        next if url.empty?

        lastmod = block[/<lastmod>\s*([^<]+?)\s*<\/lastmod>/im, 1]
        lastmod = lastmod.strip if lastmod
        results << {
          url: url,
          title: url.split("/").last.to_s,
          snippet: nil,
          lastmod: lastmod
        }
      end
      if results.empty?
        xml.scan(/<loc>\s*([^<]+?)\s*<\/loc>/im) do |loc,|
          url = loc.strip
          next if url.empty?

          results << { url: url, title: url.split("/").last.to_s, snippet: nil, lastmod: nil }
        end
      end
      results.uniq { |r| normalize_url(WatchPolicy.canonicalize_url(r[:url])) }
    end

    def keep_with_keywords?(policy, cand, keywords, min_score)
      return true if WatchPolicy.keep_link?(policy[:url], cand[:title].to_s, min_score: min_score)

      hay = "#{policy[:url]} #{cand[:title]} #{cand[:snippet]}".downcase
      keywords.any? { |k| hay.include?(k) }
    end

    def scenario_hints(blob, rules)
      hints = []
      rules.each do |rule|
        hints << rule[:hint] if rule[:re].match?(blob)
      end
      hints.uniq
    end

    def merge_items(old_items, new_items)
      by_url = {}
      old_items.each { |it| by_url[normalize_url(it["url"])] = it.dup }
      new_items.each do |it|
        key = normalize_url(it["url"])
        if by_url.key?(key)
          prev = by_url[key]
          # Base on previous detection, then layer the newest sighting.
          merged = prev.merge(it)
          merged["last_seen_at"] = it["last_seen_at"] || prev["last_seen_at"]
          merged["detected_at"] = prev["detected_at"] if prev["detected_at"]
          # Keep the earliest target_id as the primary detection source.
          merged["target_id"] = prev["target_id"] || it["target_id"]
          tids = []
          tids.concat(Array(prev["target_ids"]))
          tids << prev["target_id"] if prev["target_id"]
          tids.concat(Array(it["target_ids"]))
          tids << it["target_id"] if it["target_id"]
          merged["target_ids"] = tids.compact.uniq
          merged["published_at"] = it["published_at"] || prev["published_at"]
          merged["lastmod"] = it["lastmod"] || prev["lastmod"]
          merged["metadata_changed"] = it["metadata_changed"] if it.key?("metadata_changed")
          merged["metadata_diff"] = it["metadata_diff"] if it.key?("metadata_diff")
          merged["score"] = [prev["score"].to_i, it["score"].to_i].max
          merged["score_reasons"] = (Array(prev["score_reasons"]) + Array(it["score_reasons"])).uniq
          merged["scenario_hints"] = (Array(prev["scenario_hints"]) + Array(it["scenario_hints"])).uniq
          # Human-drop evidence fields must survive merges with listing hits.
          if it["kind"] == "human_drop" || prev["kind"] == "human_drop"
            drop = it["kind"] == "human_drop" ? it : prev
            merged["kind"] = "human_drop"
            merged["listing_via"] = "human_drop"
            merged["local_path"] = drop["local_path"] || merged["local_path"]
            merged["content_hash"] = drop["content_hash"] || merged["content_hash"]
            merged["source_type"] = drop["source_type"] || merged["source_type"]
          end
          statuses = [prev["status"], it["status"]]
          merged["status"] =
            if statuses.include?("already_witnessed")
              "already_witnessed"
            elsif statuses.include?("needs_human_review")
              "needs_human_review"
            else
              it["status"]
            end
          by_url[key] = merged
        else
          copy = it.dup
          copy["target_ids"] = [it["target_id"]].compact
          by_url[key] = copy
        end
      end
      by_url.values
    end

    def absolutize(href, base_url)
      href = href.to_s.strip
      return nil if href.empty? || href.start_with?("#", "javascript:", "mailto:")

      WatchPolicy.canonicalize_url(URI.join(base_url, href).to_s)
    rescue URI::InvalidURIError, ArgumentError
      nil
    end

    def normalize_url(url)
      u = url.to_s.strip
      u = u.split("#", 2).first
      u
    end

    def strip_tags(text)
      text.to_s.gsub(/<[^>]+>/, " ").gsub(/\s+/, " ")
    end

    def strip_cdata(text)
      text.to_s.gsub(/<!\[CDATA\[(.*?)\]\]>/m, '\1')
    end

    def truncate(s, n)
      s.length > n ? "#{s[0, n - 1]}…" : s
    end

    def relative_to(path, root)
      Pathname.new(path).relative_path_from(root).to_s
    rescue ArgumentError
      path.to_s
    end

    def summary_lines(doc, errors, mode, out_path)
      meta = doc["meta"]
      counts = meta["counts"]
      lines = []
      lines << "pebr watch: discovery queue (#{mode}) — #{QUEUE_SCHEMA_NOTE}"
      lines << "  heritage: listings/RSS/policy + archive.org fallback from pesquisas-eleitorais-br patterns (no share extraction)"
      lines << "  watermark fieldwork_end: #{meta['watermark_fieldwork_end'] || '(none)'}"
      lines << "  targets: #{counts['targets_enabled']}  live_fetched: #{counts['targets_fetched_live']}  skipped: #{counts['targets_skipped']}"
      lines << "  items: #{counts['items']}  needs_human_review: #{counts['needs_human_review']}  already_witnessed: #{counts['already_witnessed']}  inbox_low_score: #{counts['inbox_low_score']}  human_drop_files: #{counts['human_drop_files']}"
      lines << "  wrote: #{out_path}"
      errors.first(10).each { |e| lines << "  warn: #{e}" }
      lines << "  warn: … #{errors.size - 10} more" if errors.size > 10
      lines
    end
  end
end
