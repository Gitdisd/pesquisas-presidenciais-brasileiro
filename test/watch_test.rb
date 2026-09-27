# frozen_string_literal: true

require "minitest/autorun"
require "json"
require "pathname"
require "tmpdir"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
$LOAD_PATH.unshift(File.join(ROOT, "lib"))
require "bundler/setup"
require "pebr"

class WatchPolicyTest < Minitest::Test
  def test_canonicalize_strips_utm
    raw = "https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia.ghtml?utm_source=twitter&fbclid=abc#frag"
    out = Pebr::WatchPolicy.canonicalize_url(raw)
    refute_match(/utm_source/, out)
    refute_match(/fbclid/, out)
    refute_match(/#/, out)
  end

  def test_rejects_wrong_office
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://g1.globo.com/sp/sao-paulo/eleicoes/2026/noticia/pesquisa-governador.ghtml",
      "Pesquisa governador SP"
    )
    assert c[:rejected]
    assert_includes c[:reasons], "wrong-office"
  end

  def test_scores_presidential_institute
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/datafolha-1o-turno.ghtml",
      "Datafolha intenção de voto presidente 1º turno"
    )
    refute c[:rejected]
    assert c[:score] >= 35
    assert_includes c[:reasons], "presidential-signal"
    assert_includes c[:reasons], "institute"
  end
end

class WatchTest < Minitest::Test
  def setup
    @tmpdir = Dir.mktmpdir("pebr-watch-")
    @root = Pathname.new(@tmpdir)
    FileUtils.cp(File.join(ROOT, "config/watch_targets.yml"), @root.join("config").tap(&:mkpath).join("watch_targets.yml"))
    FileUtils.cp_r(File.join(ROOT, "fixtures/discovery"), @root.join("fixtures").tap(&:mkpath).join("discovery"))
    @root.join("data/national/witnesses").mkpath
    @root.join("data/national/discovery").mkpath
    # Minimal poll for watermark
    poll = {
      "poll_id" => "example_2026-09-01_stimulated_1st_round",
      "fieldwork_end" => "2026-09-01"
    }
    @root.join("data/national/polls").mkpath
    @root.join("data/national/polls/example.json").write(JSON.pretty_generate(poll))
  end

  def teardown
    FileUtils.remove_entry(@tmpdir) if @tmpdir && File.directory?(@tmpdir)
  end

  def run_watch(**opts)
    Pebr::Watch.run(
      {
        root: @root,
        config_path: @root.join("config/watch_targets.yml"),
        mode: :offline,
        now: Time.utc(2026, 9, 27, 12, 0, 0)
      }.merge(opts)
    )
  end

  def test_offline_emits_review_queue_without_shares
    result = run_watch
    doc = result[:doc]
    assert doc["items"].any?, "expected candidates from fixtures"
    assert_equal "offline", doc["meta"]["mode"]
    assert_match(/human review/i, doc["meta"]["disclaimer"])
    assert_equal "2026-09-01", doc["meta"]["watermark_fieldwork_end"]
    assert File.file?(result[:last_run_path]), "last-run.json should be written"

    allowed = %w[needs_human_review already_witnessed inbox_low_score]
    doc["items"].each do |item|
      assert item["url"], "url required"
      assert item["source_id"], "source_id required"
      assert item["detected_at"], "detected_at required"
      assert_includes allowed, item["status"]
      refute item.key?("shares")
      refute item.key?("results")
      refute item.key?("candidates")
      refute item.key?("poll_id")
    end
  end

  def test_excludes_state_noise_and_hints_scenarios
    result = run_watch
    urls = result[:doc]["items"].map { |i| i["url"] }
    refute urls.any? { |u| u.include?("governador") }, "state governor link should be excluded"
    refute urls.any? { |u| u.include?("prefeito") }, "municipal link should be excluded"

    second = result[:doc]["items"].find do |i|
      i["url"].include?("quaest-2o-turno") || i["title"].to_s.include?("2º turno") ||
        i["scenario_hints"]&.include?("stimulated_2nd_round")
    end
    assert second, "expected a 2º turno candidate"
    assert_includes second["scenario_hints"], "stimulated_2nd_round"

    first = result[:doc]["items"].find { |i| i["scenario_hints"]&.include?("stimulated_1st_round") }
    assert first, "expected a 1º turno scenario hint"
  end

  def test_marks_already_witnessed_urls
    wit = {
      "witness_id" => "w_test",
      "poll_id" => "test_poll",
      "source_type" => "html",
      "source_url" => "https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/25/datafolha-presidente-1o-turno-setembro.ghtml",
      "retrieved_at" => "2026-09-27T00:00:00Z",
      "content_hash" => "sha256:deadbeef",
      "parser_id" => "test",
      "extractions" => {},
      "confidence" => 1.0
    }
    @root.join("data/national/witnesses/w_test.json").write(JSON.pretty_generate(wit))

    result = run_watch
    hit = result[:doc]["items"].find { |i| i["url"] == wit["source_url"] }
    assert hit, "expected witnessed URL in queue"
    assert_equal "already_witnessed", hit["status"]
  end

  def test_rss_sitemap_and_gnews
    result = run_watch
    assert result[:doc]["items"].any? { |i| i["target_id"] == "g1-rss-sample" }, "RSS fixture"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "example-sitemap" }, "sitemap fixture"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "gnews-presidencial" }, "gnews fixture"
  end

  def test_dry_run_does_not_write
    out = @root.join("data/national/discovery/queue.json")
    refute out.exist?
    run_watch(dry_run: true)
    refute out.exist?
  end

  def test_queue_never_contains_numeric_share_fields
    result = run_watch
    blob = JSON.pretty_generate(result[:doc])
    refute_match(/"shares"\s*:/, blob)
    refute_match(/"pct"\s*:/, blob)
    refute_match(/"percent"\s*:/, blob)
  end
end
