# Pesquisas presidenciais brasileiro (PEBR 2026)

Arquivo e agregador de pesquisas presidenciais nacionais — GitHub Pages.

## Contrato de dados (Pipeline)

Schemas canônicos: [`schemas/`](schemas/). Fixtures sintéticos: [`fixtures/national/`](fixtures/national/).

- Shares e resíduos: frações 0–1
- Identidade: `poll_id` + witnesses; TSE só proveniência
- v1: apenas **nacional**

Stats (Python) gera `data/chart.json`. UI (HTML/CSS + D3) consome esse arquivo.

## Status

Greenfield. Corpus real de pesquisas só após mapa de fontes + auditoria de proveniência. Fixtures `EXAMPLE_*` não são pesquisas reais.
