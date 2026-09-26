# frozen_string_literal: true

module Pebr
  # Normalize raw/extracted witness payloads into canonical poll/witness JSON.
  module Normalize
    # TODO: map institute display names via config/institutes.yml + aliases.
    # TODO: coerce shares to fractions [0,1]; compute fieldwork_mid when missing.
    # TODO: residual keys via config/residual_categories.yml.
    # TODO: candidate ids via config/candidate_aliases.yml.
    def self.run(_input_path)
      raise NotImplementedError, "Pebr::Normalize.run — stub (intake not wired yet)"
    end
  end
end
