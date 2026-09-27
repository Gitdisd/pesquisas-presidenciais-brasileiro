# frozen_string_literal: true

require "digest"
require "fileutils"
require "json"
require "pathname"
require "time"

module Pebr
  # Copies human-saved HTML/PDF evidence into the discovery drop folder.
  # This intentionally hashes bytes and writes metadata only; it never parses shares.
  module Intake
    module_function

    ALLOWED_EXTENSIONS = %w[.html .htm .pdf].freeze

    def drop(path, root:, source_url: nil, title: nil, source_id: nil)
      source = Pathname.new(path.to_s).expand_path
      raise "evidence file missing: #{source}" unless source.file?
      ext = source.extname.downcase
      raise "unsupported evidence type #{ext.inspect}; use HTML or PDF" unless ALLOWED_EXTENSIONS.include?(ext)

      digest = Digest::SHA256.file(source).hexdigest
      now = Time.now.utc
      inbox = Pathname.new(root).join("data/national/discovery/inbox")
      inbox.mkpath
      stem = "#{now.strftime('%Y%m%dT%H%M%SZ')}-#{digest[0, 16]}"
      destination = inbox.join("#{stem}#{ext}")
      FileUtils.cp(source, destination)

      metadata = {
        "source_url" => source_url.to_s.strip.empty? ? nil : source_url.to_s.strip,
        "title" => title.to_s.strip.empty? ? source.basename.to_s : title.to_s.strip,
        "source_id" => source_id.to_s.strip.empty? ? "human-drop" : source_id.to_s.strip,
        "retrieved_at" => now.iso8601,
        "content_hash" => "sha256:#{digest}",
        "source_type" => ext.delete_prefix(".")
      }.compact
      sidecar = Pathname.new("#{destination}.json")
      sidecar.write(JSON.pretty_generate(metadata) + "\n")

      {
        path: destination,
        sidecar: sidecar,
        content_hash: metadata["content_hash"],
        metadata: metadata
      }
    end
  end
end
