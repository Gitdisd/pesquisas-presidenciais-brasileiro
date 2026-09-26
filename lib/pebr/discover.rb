# frozen_string_literal: true

module Pebr
  # Discover new poll coverages from docs/source-map sources.
  module Discover
    # TODO: walk active sources from docs/source-map/sources.json + config.
    # TODO: emit witness stubs only — never invent poll numbers.
    # TODO: respect TOS / rate limits; TSE is provenance, not result truth.
    def self.run(_opts = {})
      raise NotImplementedError, "Pebr::Discover.run — stub (discover comes later)"
    end
  end
end
