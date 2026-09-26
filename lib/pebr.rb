# frozen_string_literal: true

require_relative "pebr/version"
require_relative "pebr/identity"
require_relative "pebr/normalize"
require_relative "pebr/discover"

module Pebr
  SCHEMA_DIR = File.expand_path("../schemas", __dir__)
  FIXTURE_DIR = File.expand_path("../fixtures/national", __dir__)

  FIXTURE_SCHEMA_MAP = {
    "EXAMPLE_poll.json" => "poll.schema.json",
    "EXAMPLE_witness.json" => "witness.schema.json",
    "EXAMPLE_institute.json" => "institute.schema.json"
  }.freeze
end
