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

  def test_scores_tse_registration_as_provenance_signal
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://example.org/pesquisa-presidente",
      "Pesquisa presidencial — Registro TSE BR-01739/2026"
    )
    refute c[:rejected]
    assert_includes c[:reasons], "tse-registration-signal"
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


  def test_rejects_governo_de_state_race
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/quaest-ms.ghtml",
      "2ª pesquisa Quaest: intenção de voto para governo de MS"
    )
    assert c[:rejected]
    assert_includes c[:reasons], "wrong-office"
  end

  def test_rejects_michelle_hold
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://example.org/pesquisa-presidente",
      "2º turno Lula x Michelle Bolsonaro"
    )
    assert c[:rejected]
    assert_includes c[:reasons], "hold-michelle-out"
  end

  def test_demotes_ipec_hard_stop
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://example.org/pesquisa-ipec-presidente",
      "Ipsos-Ipec intenção de voto presidente 1º turno"
    )
    refute c[:rejected]
    assert_includes c[:reasons], "hold-ipec-hard-stop"
    assert c[:score] < 35
  end

  def test_rejects_nav_noise
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://github.com/login",
      "Sign in"
    )
    assert c[:rejected]
    assert_includes c[:reasons], "nav-noise"
  end

  def test_wrong_office_wins_over_hub_slug
    c = Pebr::WatchPolicy.classify_poll_link(
      "https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/pesquisa-governador-pr/",
      "Pesquisa governador Paraná"
    )
    assert c[:rejected]
    assert_includes c[:reasons], "wrong-office"
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
    assert result[:doc]["items"].any? { |i| i["target_id"] == "g1-pesquisas-rss" }, "G1 pesquisas RSS"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "poder360-feed" }, "Poder360 feed"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "example-sitemap" }, "sitemap fixture"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "gnews-presidencial" }, "gnews fixture"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "gnews-datafolha" }, "gnews datafolha"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "wikipedia-polling-2026" }, "wikipedia"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "wikipedia-polling-2026-pt" }, "wikipedia PT"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "tse-pesqele-recent" }, "TSE PesqEle provenance"
    assert result[:doc]["items"].any? { |i| i["target_id"] == "trademap-poll-aggregator" }, "TradeMap provenance"
    assert result[:doc]["items"].any? { |i| i["target_ids"]&.include?("gnews-tse-registration") }, "TSE-registration GNews"
  end

  def test_sitemap_lastmod_attached
    result = run_watch
    futura = result[:doc]["items"].find { |i| i["url"].to_s.include?("futura-pesquisa-presidencial") }
    assert futura, "expected sitemap futura URL"
    assert_equal "2026-09-21T18:00:00Z", futura["lastmod"]
  end

  def test_rss_published_at_when_present
    result = run_watch
    hit = result[:doc]["items"].find do |i|
      i["url"].to_s.include?("datafolha-presidente-1o-turno-setembro") && i["published_at"]
    end
    assert hit, "expected datafolha item with RSS pubDate"
    assert_match(/2026/, hit["published_at"])
  end

  def test_wayback_available_json_parse
    payload = {
      "url" => "https://example.com/x",
      "archived_snapshots" => {
        "closest" => {
          "available" => true,
          "url" => "http://web.archive.org/web/20260924120000/https://example.com/x",
          "timestamp" => "20260924120000",
          "status" => "200"
        }
      }
    }
    snap = Pebr::Watch.parse_wayback_available(JSON.pretty_generate(payload))
    assert_match(%r{\Ahttps://web\.archive\.org/web/}, snap)
    assert_includes snap, "example.com/x"
    assert_nil Pebr::Watch.parse_wayback_available("{}")
    assert_nil Pebr::Watch.parse_wayback_available("not-json")
  end

  def test_http_get_rejects_non_http
    body, err = Pebr::Watch.http_get("ftp://example.com/x", ua: "test", timeout: 2)
    assert_nil body
    assert_match(/unsupported/, err)
  end

  def test_dry_run_does_not_write
    out = @root.join("data/national/discovery/queue.json")
    refute out.exist?
    run_watch(dry_run: true)
    refute out.exist?
  end


  def test_lead_list_old_site_harvest_has_no_shares
    result = run_watch
    leads = result[:doc]["items"].select { |i| i["listing_via"] == "old_site_harvest" || i["target_id"] == "old-site-national-leads" }
    assert leads.any?, "expected old-site lead_list items"
    leads.each do |item|
      refute item.key?("shares")
      refute item.key?("results")
      refute item.key?("candidates")
      refute item.key?("poll_id")
      assert_includes item["score_reasons"], "old-site-lead"
    end
    summary = result[:doc]["meta"]["operator_summary"]
    assert summary.is_a?(Hash)
    assert summary["work_top_down"]
    assert result[:doc]["meta"]["holds"].any? { |h| h.include?("Michelle") }
  end

  def test_human_drop_already_witnessed_when_url_known
    source = @root.join("saved-report.pdf")
    source.write("already ingested bytes")
    Pebr::Intake.drop(
      source,
      root: @root,
      source_url: "https://example.org/already.pdf",
      title: "Already in",
      source_id: "manual-source"
    )
    wit = {
      "witness_id" => "w_already",
      "poll_id" => "test_poll",
      "source_type" => "pdf",
      "source_url" => "https://example.org/already.pdf",
      "retrieved_at" => "2026-09-27T00:00:00Z",
      "content_hash" => "sha256:abc",
      "parser_id" => "test",
      "extractions" => {},
      "confidence" => 1.0
    }
    @root.join("data/national/witnesses/w_already.json").write(JSON.pretty_generate(wit))

    item = run_watch[:doc]["items"].find { |candidate| candidate["url"] == "https://example.org/already.pdf" }
    assert item, "expected drop URL in queue"
    assert_equal "already_witnessed", item["status"]
    assert_equal "human_drop_done", item["review_bucket"]
  end

  def test_human_drop_is_indexed_by_hash_without_parsing
    source = @root.join("saved-report.pdf")
    source.write("PDF bytes; poll cells must not be parsed")
    result = Pebr::Intake.drop(
      source,
      root: @root,
      source_url: "https://example.org/report.pdf",
      title: "Human report",
      source_id: "manual-source"
    )
    assert_match(/^sha256:/, result[:content_hash])

    queue = run_watch[:doc]
    item = queue["items"].find { |candidate| candidate["kind"] == "human_drop" }
    assert item, "expected human drop in queue"
    assert_equal "needs_human_review", item["status"]
    assert_equal result[:content_hash], item["content_hash"]
    assert_equal "pdf", item["source_type"]
    refute item.key?("shares")
    refute item.key?("poll_id")
    assert_equal "human_drop", item["listing_via"]
  end

  def test_metadata_diff_is_explicit
    diff = Pebr::Watch.metadata_diff(
      { "published_at" => "2026-09-01T00:00:00Z" },
      { "published_at" => "2026-09-02T00:00:00Z" }
    )
    assert_equal "2026-09-01T00:00:00Z", diff.dig("published_at", "previous")
    assert_equal "2026-09-02T00:00:00Z", diff.dig("published_at", "current")
    assert_empty Pebr::Watch.metadata_diff(
      { "published_at" => "2026-09-01T00:00:00Z" },
      {}
    )
  end

  def test_queue_never_contains_numeric_share_fields
    result = run_watch
    blob = JSON.pretty_generate(result[:doc])
    refute_match(/"shares"\s*:/, blob)
    refute_match(/"pct"\s*:/, blob)
    refute_match(/"percent"\s*:/, blob)
  end
end
