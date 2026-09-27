# Pesquisas presidenciais brasileiro (PEBR 2026)

Arquivo e agregador de pesquisas presidenciais nacionais — GitHub Pages.

## GitHub Pages

- **Deploy:** GitHub Actions workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) uploads `site/` (branch path `/site` is not allowed by GitHub; only `/` or `/docs`).
- Settings → Pages → **Source: GitHub Actions**.
- Public URL (after first successful run): https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/
- UI entry: [`site/index.html`](site/index.html) · stylesheet [`site/css/app.css`](site/css/app.css) · chart [`site/js/chart.js`](site/js/chart.js) (D3@7 via CDN).
- Chart data path (relative to the site root): `data/chart.json` → [`site/data/chart.json`](site/data/chart.json).

Local preview (from repo root):

```bash
python3 -m http.server 8080 --directory site
# open http://localhost:8080/
```

## Contrato de dados (Pipeline)

Schemas canônicos: [`schemas/`](schemas/). Fixtures sintéticos: [`fixtures/national/`](fixtures/national/).

- Shares e resíduos: frações 0–1
- Identidade: `poll_id` + witnesses; TSE só proveniência
- v1: apenas **nacional**

Stats (Python) gera `site/data/chart.json` (`series_kind`: `poll` | `aggregate` | `uncertainty`; Option B). A UI multiplica frações ×100 para exibição em pontos percentuais. **Lead owns** `site/index.html`, `site/css/`, `site/js/`.

Mapa de fontes (pesquisa): [`docs/source-map/`](docs/source-map/).  
Arquitetura: [`docs/architecture.md`](docs/architecture.md).

## Operator refresh recipe

After verified intake lands under `data/national/polls/` + `witnesses/` (human primary check — see below):

```bash
# deps (once)
sudo apt-get install -y ruby ruby-dev bundler build-essential   # or equivalent
bundle install

# 1) schema + cross-link check
bin/pebr validate

# 2) identity fingerprint / duplicate report (no fetch)
bin/pebr normalize

# 3) rebuild Stats ingest snapshots from polls (deterministic; no invented fields)
bin/pebr assemble
# → site/data/canonical-points.json            (stimulated_1st_round only)
# → site/data/canonical-points-2nd-round.json  (stimulated_2nd_round_* family)

# 4) optional read-only source inventory
bin/pebr discover
```

Commit polls/witnesses **and** the refreshed `canonical-points.json` + `canonical-points-2nd-round.json` together so CI’s `git diff --exit-code` stays green.

Scenario keys and 1º/2º separation: [`docs/scenario-convention.md`](docs/scenario-convention.md).

### Lead: re-export Option B after data changes

Actions **does not** regenerate `site/data/chart.json`. When `canonical-points.json` (or `data/national/polls`) changes, Lead re-runs Stats locally:

```bash
.venv/bin/pip install -e 'models/[dev]'
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points.json \
  --out site/data/chart.json \
  --no-example \
  --note "verified national stimulated_1st_round"
```

(Alternatively `--polls data/national/polls`.) Review the chart, then commit `site/data/chart.json` separately. Do not invent series in CI.

For **2º turno**, consume `site/data/canonical-points-2nd-round.json` and **filter by `scenario`** (pairwise keys). Do not feed that file into the 1º chart path unfiltered.

### Human primary check (new polls)

`discover` / `watch` / CI never write poll shares. `bin/pebr watch` only queues URLs for review ([`docs/discovery.md`](docs/discovery.md)). Before adding a poll:

1. Fetch a primary/press witness; record `source_url` + `content_hash` (sha256 of retrieved bytes) on a witness JSON.
2. Dual-enter shares as fractions 0–1 from that witness — **no invented numbers**.
3. Assign stable `poll_id` / `institute_id` / scenario; link `witness_ids`.
4. Run `validate` → `normalize` → `assemble`; commit; Lead re-exports Option B when ready.

## Pipeline Ruby CLI

```bash
bin/pebr validate                 # fixtures + data/national/polls|witnesses vs schemas/
bin/pebr assemble                 # rebuild both canonical-points*.json (1º + 2º)
bin/pebr normalize                # fingerprint duplicate report (no rewrite)
bin/pebr discover                 # read-only inventory of sources.json + institutes.yml
bin/pebr watch --offline          # discovery queue from fixtures (no network)
bin/pebr watch --fetch            # live listings/RSS → review queue (no share inventing)
bin/pebr version
```

Discovery queue: [`data/national/discovery/`](data/national/discovery/) · runbook: [`docs/discovery.md`](docs/discovery.md)  
(Patterns adapted from [pesquisas-eleitorais-br](https://github.com/Gitdisd/pesquisas-eleitorais-br) discover-polls — PEBR never auto-extracts or commits shares.)

CI: [`.github/workflows/refresh.yml`](.github/workflows/refresh.yml) — `validate` → `normalize` → `assemble` → loud drift check on **both** canonical JSON files + offline watch smoke/tests. Opt-in `run_discovery_fetch` uploads a queue artifact only. **No auto-push of polls; no chart regenerate; CI never invents shares.**

## Electoral Stats (Option B)

Python package [`models/`](models/) implements the v1 aggregate (√N trailing ~14d, anti-flood, midpoint dating, no house effects). Methodology: [`docs/methodology-aggregate-option-b.md`](docs/methodology-aggregate-option-b.md).

```bash
.venv/bin/pip install -e 'models/[dev]'
.venv/bin/pytest models/tests -q
.venv/bin/python -m pebr_models.cli \
  --polls fixtures/national/example_polls_synthetic.json \
  --out site/data/chart.json
```

Synthetic fixtures (`example_*` / `EXAMPLE_*`) are **not** real polls.

## Status

Verified national `stimulated_1st_round` intake is under `data/national/` (see cohort notes). `site/data/canonical-points.json` is the assemble output for Option B ingest. EXAMPLE fixtures remain synthetic only. Do not commit dumps legados (`_quarantine/`, bulk `data/polls.json`).
