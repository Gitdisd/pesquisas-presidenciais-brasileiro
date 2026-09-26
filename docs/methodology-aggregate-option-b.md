# Metodologia — Agregado Option B (v1)

**Modelo:** `option_b_sqrt_n_trailing`  
**Unidade:** fração em \[0, 1\] (`unit: "fraction"`; a UI multiplica ×100 para exibir em pontos percentuais)  
**Séries:** `poll` (pontos brutos) · `aggregate` (consenso) · `uncertainty` (dispersão)

## Em uma frase

Média ponderada por \(\sqrt{N}\) numa janela móvel dos últimos ~14 dias, com freio anti-enchente por instituto, datada no meio do trabalho de campo — **sem** correção de viés de casa (*house effects*).

## Regras publicadas

| Parâmetro | Valor v1 | Papel |
|-----------|----------|--------|
| \(k\) | 14 dias | Janela trailing: inclui pesquisas com `fieldwork_mid` em \((d-k, d]\) |
| \(W\) | 14 dias | Janela de anti-flood por instituto |
| \(n_{\cap}\) (`n_cap`) | 4000 | Teto de \(N\) antes da raiz |
| \(n_{\mathrm{ref}}\) | 2000 | Referência interna de escala (os pesos são renormalizados) |

1. **Datação.** Cada pesquisa entra no eixo \(x\) em `fieldwork_mid` (ponto médio calendário de `fieldwork_start`…`fieldwork_end`). Dia de publicação não entra no agregado.
2. **Cenário.** Só se misturam pesquisas com o **mesmo** `scenario` (ex.: `stimulated_1st_round`). Geografia v1: `national` apenas.
3. **Peso de tamanho.** \(w_i^{\mathrm{size}} = \sqrt{\min(n_i, n_{\cap}) / n_{\mathrm{ref}}}\). Se \(N\) ausente → peso 1 (fallback igualitário).
4. **Anti-flood.** Se o instituto \(h\) tem \(m_{h,d}\) pesquisas na janela \(W\), \(w_i^{\mathrm{flood}} = \sqrt{1/m}\). Assim várias liberações da mesma casa compartilham um “orçamento” de influência.
5. **Peso final.** \(w_i = w_i^{\mathrm{size}} \cdot w_i^{\mathrm{flood}}\). Agregado do candidato \(c\) no dia \(d\):
   \[
   A_c(d) = \frac{\sum_{i\in S_d} w_i\, p_{i,c}}{\sum_{i\in S_d} w_i}.
   \]
6. **Incerteza (descritiva).** `band_low` / `band_high` = \(A_c(d) \pm\) desvio-padrão ponderado das pesquisas na janela (clipado a \[0,1\]). **Não** é intervalo de confiança clássico nem probabilidade de vitória.
7. **Sem house effects.** Não há deslocamento por instituto. Os pontos `poll` coloridos por instituto permanecem visíveis para o leitor ver discordâncias.
8. **Lacunas.** Se \(S_d = \emptyset\), o dia é omitido (sem carregar o último valor).

## O que isto **não** é

- Previsão eleitoral (`projection` fica para depois)
- Correção de viés de instituto / modo
- MOE inventado ou *design effect* inventado

## Implementação

Pacote Python `models/pebr_models`. Entrada: polls canônicos (`schemas/poll.schema.json`). Saída: `site/data/chart.json`.

Fixtures `example_*` / `EXAMPLE_*` são **sintéticos** — nunca tratar como pesquisas reais.
