# frozen_string_literal: true

module Pebr
  # Identity / witness-merge rules (Pipeline).
  # Matches schemas/README.md — do not invent poll_ids from TSE alone.
  #
  # Canonical key (after merge): stable poll_id.
  # Prefer deriving from:
  #   (institute_id, fieldwork_start, fieldwork_end, geography, election_cycle, scenario)
  # plus deterministic witness merge.
  #
  # Witness merge sketch:
  # - Same institute + overlapping/identical fieldwork window + same scenario
  #   + consistent geography → candidates for one poll_id.
  # - Prefer institute primary release over secondary press when results conflict;
  #   record conflicts in notes/supplements — do not silently average.
  # - Content hash on witnesses detects duplicate retrievals.
  # - TSE (tse_registration_id): provenance only, not sole identity or truth for results.
  # - Geography: v1 is national only. State polls never enter national aggregates.
  # - Trend date: fieldwork_end. Stats Option B may date at fieldwork_mid when present.
  # - Scenario: never mix scenarios in one aggregate.
  # - parsers: parser_id is config/mapping driven — no self-modifying parsers.
  module Identity
    # TODO: implement candidate grouping from witnesses → poll_id assignment.
    def self.merge_candidates(_witnesses)
      raise NotImplementedError, "Pebr::Identity.merge_candidates — stub (see schemas/README.md)"
    end

    # TODO: deterministic poll_id from identity tuple after merge.
    def self.poll_id_for(_attrs)
      raise NotImplementedError, "Pebr::Identity.poll_id_for — stub"
    end
  end
end
