# frozen_string_literal: true

require_relative "pebr/version"
require_relative "pebr/identity"
require_relative "pebr/normalize"
require_relative "pebr/discover"
require_relative "pebr/assemble"

module Pebr
  SCHEMA_DIR = File.expand_path("../schemas", __dir__)
  FIXTURE_DIR = File.expand_path("../fixtures/national", __dir__)
  NATIONAL_POLL_DIR = File.expand_path("../data/national/polls", __dir__)
  NATIONAL_WITNESS_DIR = File.expand_path("../data/national/witnesses", __dir__)
  CANONICAL_POINTS_PATH = File.expand_path("../site/data/canonical-points.json", __dir__)
  SOURCES_JSON_PATH = File.expand_path("../docs/source-map/sources.json", __dir__)
  INSTITUTES_YML_PATH = File.expand_path("../config/institutes.yml", __dir__)

  FIXTURE_SCHEMA_MAP = {
    "EXAMPLE_poll.json" => "poll.schema.json",
    "EXAMPLE_witness.json" => "witness.schema.json",
    "EXAMPLE_institute.json" => "institute.schema.json"
  }.freeze
end
