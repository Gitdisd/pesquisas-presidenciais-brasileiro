# frozen_string_literal: true

require "minitest/autorun"
require "json"
require "pathname"
require "tmpdir"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
$LOAD_PATH.unshift(File.join(ROOT, "lib"))
require "pebr"

class NormalizeAssembleTest < Minitest::Test
  def test_identity_fingerprint_includes_uf_for_state
    national = {
      "institute_id" => "x",
      "fieldwork_start" => "2026-01-01",
      "fieldwork_end" => "2026-01-02",
      "geography" => "national",
      "election_cycle" => 2026,
      "scenario" => "stimulated_1st_round"
    }
    state = national.merge("geography" => "state", "uf" => "SP")
    refute_equal Pebr::Identity.fingerprint(national), Pebr::Identity.fingerprint(state)
    assert_includes Pebr::Identity.fingerprint(state), "|SP|"
  end

  def test_normalize_errors_on_soft_twin_near_duplicate
    Dir.mktmpdir do |dir|
      poll_dir = Pathname.new(dir).join("polls")
      wit_dir = Pathname.new(dir).join("witnesses")
      poll_dir.mkpath
      wit_dir.mkpath

      base = {
        "institute_id" => "ideia",
        "fieldwork_start" => "2026-03-06",
        "fieldwork_end" => "2026-03-10",
        "geography" => "national",
        "election_cycle" => 2026,
        "scenario" => "stimulated_1st_round",
        "sample_size" => 1500,
        "moe" => 0.025,
        "results" => { "lula" => 0.4 },
        "residuals" => { "ns_nr" => 0.1 },
        "witness_ids" => [],
        "dataset_version" => "test"
      }
      a = base.merge("poll_id" => "ideia_a", "fieldwork_start" => "2026-03-06")
      b = base.merge("poll_id" => "ideia_b", "fieldwork_start" => "2026-03-07")
      poll_dir.join("ideia_a.json").write(JSON.pretty_generate(a))
      poll_dir.join("ideia_b.json").write(JSON.pretty_generate(b))

      result = Pebr::Normalize.run(
        trees: [{
          label: "national",
          poll_dir: poll_dir.to_s,
          wit_dir: wit_dir.to_s,
          expect_geography: "national"
        }]
      )
      assert result[:errors].any? { |e| e.include?("near-duplicate soft twin") }, result[:errors].inspect
    end
  end

  def test_assemble_regional_empty_stub_and_never_reads_national
    Dir.mktmpdir do |dir|
      regional_dir = Pathname.new(dir).join("regional_polls")
      regional_dir.mkpath
      out = Pathname.new(dir).join("canonical-points-regional.json")
      # national-looking file must not be read from regional_dir (empty → [])
      result = Pebr::Assemble.run_regional(
        regional_poll_dir: regional_dir.to_s,
        out_path_regional: out.to_s,
        dry_run: false
      )
      assert_equal 0, result[:count]
      assert_equal "[]\n", out.read
    end
  end

  def test_assemble_national_refuses_uf_leak
    Dir.mktmpdir do |dir|
      poll_dir = Pathname.new(dir).join("polls")
      poll_dir.mkpath
      leak = {
        "poll_id" => "leak_poll",
        "institute_id" => "x",
        "fieldwork_start" => "2026-01-01",
        "fieldwork_end" => "2026-01-02",
        "fieldwork_mid" => "2026-01-01",
        "geography" => "national",
        "uf" => "SP",
        "election_cycle" => 2026,
        "scenario" => "stimulated_1st_round",
        "sample_size" => 1000,
        "moe" => nil,
        "results" => { "lula" => 0.4 },
        "residuals" => {},
        "tse_registration_id" => nil,
        "dataset_version" => "test",
        "witness_ids" => []
      }
      poll_dir.join("leak_poll.json").write(JSON.pretty_generate(leak))
      err = assert_raises(RuntimeError) do
        Pebr::Assemble.run_national(
          poll_dir: poll_dir.to_s,
          out_path: Pathname.new(dir).join("1st.json").to_s,
          out_path_2nd: Pathname.new(dir).join("2nd.json").to_s
        )
      end
      assert_match(/refused uf field/, err.message)
    end
  end
end
