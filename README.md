# Pesquisas presidenciais brasileiro (PEBR 2026)

Arquivo e agregador de pesquisas presidenciais nacionais — GitHub Pages.

## GitHub Pages

- **Source folder:** `/site` (Settings → Pages → Deploy from a branch → `/site`, or equivalent “folder” source).
- Site root on Pages maps to this repo’s `site/` directory.
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

## Pipeline Ruby (validate)

```bash
# deps (once)
sudo apt-get install -y ruby ruby-dev bundler build-essential   # or equivalent
bundle install

# validate EXAMPLE fixtures against schemas/
bin/pebr validate
```

Other commands (stubs for now):

```bash
bin/pebr discover    # no-op until intake
bin/pebr normalize   # no-op until identity merge
bin/pebr version
```

CI: [`.github/workflows/refresh.yml`](.github/workflows/refresh.yml) runs `bin/pebr validate` on relevant pushes.



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

Greenfield. Corpus real de pesquisas só após auditoria de proveniência do source map. Fixtures e `chart.json` com `example: true` / `EXAMPLE_*` **não são pesquisas reais** — o banner EXAMPLE na UI deixa isso explícito. Não commitar dumps legados (`_quarantine/`, `data/polls.json`).
