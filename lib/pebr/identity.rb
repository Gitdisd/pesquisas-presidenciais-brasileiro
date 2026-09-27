# frozen_string_literal: true

module Pebr
  # Identity / witness-merge rules (Pipeline).
  # Matches schemas/README.md + docs/cross-reference.md — do not invent poll_ids from TSE alone.
  #
  # Canonical key (after merge): stable poll_id.
  # Prefer deriving from:
  #   (institute_id, fieldwork_start, fieldwork_end, geography, [uf], election_cycle, scenario)
  # plus deterministic witness merge.
  #
  # National: geography locked to "national" (poll.schema.json).
  # Regional: geography "state" + required uf (poll-regional.schema.json) — parallel tree only.
  # State polls never enter national aggregates.
  module Identity
    BASE_FINGERPRINT_KEYS = %w[
      institute_id
      fieldwork_start
      fieldwork_end
      geography
      election_cycle
      scenario
    ].freeze

    module_function

    # Stable identity fingerprint string (not a poll_id; for duplicate detection).
    # Includes uf when geography is state (or uf is present).
    def fingerprint(attrs)
      parts = BASE_FINGERPRINT_KEYS.map { |k| attrs.fetch(k).to_s }
      geo = attrs.fetch("geography").to_s
      if geo == "state" || attrs.key?("uf")
        uf = attrs.fetch("uf").to_s
        raise KeyError, "key not found: \"uf\"" if uf.empty?

        parts.insert(4, uf) # after geography
      end
      parts.join("|")
    end

    # Soft twin key: catches near-duplicates that share institute/end/scenario/geo/N
    # but differ on fieldwork_start (common re-entry mistake).
    def soft_twin_key(attrs)
      geo = attrs.fetch("geography").to_s
      uf_part = (geo == "state" || attrs.key?("uf")) ? attrs.fetch("uf").to_s : ""
      [
        attrs.fetch("institute_id").to_s,
        attrs.fetch("fieldwork_end").to_s,
        geo,
        uf_part,
        attrs.fetch("scenario").to_s,
        attrs.fetch("sample_size").to_s
      ].join("|")
    end

    # Normalize URL for cross-witness mirror detection (strip query/fragment/trailing slash).
    def normalize_url(url)
      s = url.to_s.strip.downcase
      return "" if s.empty?

      s = s.split("#", 2).first
      s = s.split("?", 2).first
      s.sub(%r{/\z}, "")
    end

    # Full witness→poll merge still deferred (human primary intake).
    def merge_candidates(_witnesses)
      raise NotImplementedError,
            "Pebr::Identity.merge_candidates — deferred; use normalize for fingerprint duplicate report"
    end

    def poll_id_for(_attrs)
      raise NotImplementedError,
            "Pebr::Identity.poll_id_for — deferred; poll_id assigned during verified human intake"
    end
  end
end
