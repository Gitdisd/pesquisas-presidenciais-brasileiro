/* PEBR Research UI — D3@7 chart (vanilla JS, no bundler).
 * Consumes data/chart.json (1º) and data/chart-2nd-round.json (2º pairwise scenarios[]).
 * series_kind poll | aggregate | uncertainty. Data unit: fraction 0–1; display ×100 (pp).
 * Hover: single poll point only (no multi-candidate scoreboard).
 * Interaction: TradingView/Polymarket-style drag-pan + wheel/pinch zoom on time (X);
 *   Y stays on data domain (no isotropic lock). NO bottom range brush/slider.
 * Period chips 30d/90d/tudo = optional X domain presets only (not a brush).
 * Filters: round, período, institutes (solo), candidatos, matchups 2º.
 * Borrowed from old site: período presets, denser filter bar, shareable URL, Option B PT copy,
 * summary cards + Δ30d, overview metrics, poll table (+ pagination/search), dark/light theme,
 * focar / scroll-top / fullscreen, cheap shortcuts, institute bitmask in share URL.
 * Client Option B when institute-filtered (same √N + anti-flood rules). Not borrowed:
 * projection models, multi-hover scoreboard, bottom brush, média-window knobs, party/CRT themes. */
(function () {
  "use strict";

  const DATA_URL_1ST = "data/chart.json";
  const DATA_URL_2ND = "data/chart-2nd-round.json";
  const MARGIN = { top: 24, right: 20, bottom: 40, left: 48 };
  const POLL_HIT_PX2 = 16 * 16;
  const TABLE_PAGE_SIZE = 25;
  const SCENARIO_LABELS = {
    stimulated_1st_round: "Estimulada · 1º turno",
    spontaneous_1st_round: "Espontânea · 1º turno",
    stimulated_2nd_round: "Estimulada · 2º turno",
  };

  const candCfg =
    (typeof window !== "undefined" && window.PEBR_CANDIDATES_CONFIG) || {
      isCandidateActive: () => true,
    };

  const fmtPct = (v) =>
    (v * 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  const fmtDate = d3.utcFormat("%d/%m/%Y");
  const parseDate = d3.utcParse("%Y-%m-%d");

  const el = {
    svg: document.getElementById("chart"),
    placeholder: document.getElementById("chart-placeholder"),
    legend: document.getElementById("legend"),
    detail: document.getElementById("detail-body"),
    headerMeta: document.getElementById("header-meta"),
    scenario: document.getElementById("scenario-label"),
    dataStatus: document.getElementById("data-status"),
    refreshBtn: document.getElementById("btn-refresh-data"),
    resetBtn: document.getElementById("btn-reset-zoom"),
    showAllBtn: document.getElementById("btn-show-all"),
    shareBtn: document.getElementById("btn-share"),
    toast: document.getElementById("toast"),
    matchupHint: document.getElementById("matchup-hint"),
    exampleBanner: document.querySelector(".example-banner"),
    instituteFilters: document.getElementById("institute-filters"),
    candidateFilters: document.getElementById("candidate-filters"),
    methodChips: document.getElementById("method-chips"),
    methodDisclaimer: document.getElementById("method-disclaimer"),
    filterNote: document.getElementById("filter-note"),
    geoChip: document.getElementById("geo-chip"),
    promptChip: document.getElementById("prompt-chip"),
    round1: document.getElementById("round-1"),
    round2: document.getElementById("round-2"),
    matchupRow: document.getElementById("matchup-row"),
    matchupFilters: document.getElementById("matchup-filters"),
    rangeBtns: document.querySelectorAll("[data-range]"),
    summaryCards: document.getElementById("summary-cards"),
    cardsNote: document.getElementById("cards-note"),
    metricPolls: document.getElementById("metric-polls"),
    metricInstitutes: document.getElementById("metric-institutes"),
    metricCampo: document.getElementById("metric-campo"),
    metricCampoSub: document.getElementById("metric-campo-sub"),
    pollsThead: document.getElementById("polls-thead"),
    pollsTbody: document.getElementById("polls-tbody"),
    pollsCount: document.getElementById("polls-count"),
    themeBtn: document.getElementById("btn-theme"),
    focusBtn: document.getElementById("btn-focus-chart"),
    fullscreenBtn: document.getElementById("btn-fullscreen"),
    scrollTopBtn: document.getElementById("btn-scroll-top"),
    chartShell: document.getElementById("chart-shell"),
    chartPanel: document.getElementById("chart-panel"),
    pollsSearch: document.getElementById("polls-search"),
    pollsPager: document.getElementById("polls-pager"),
    pollsPrev: document.getElementById("polls-prev"),
    pollsNext: document.getElementById("polls-next"),
    pollsPageLabel: document.getElementById("polls-page-label"),
  };

  let state = {
    data: null,
    candById: new Map(),
    instById: new Map(),
    visible: new Set(),
    institutesOn: new Set(),
    allInstituteIds: [],
    showAll: false,
    xScale: null,
    yScale: null,
    x0: null,
    y0: null,
    dims: null,
    zoomBehavior: null,
    zoomRect: null,
    layers: {},
    round: 1,
    chart1st: null,
    chart2nd: null,
    activeScenario: null,
    has2nd: false,
    rangeDays: null, // null = tudo; 30 | 90 (view cut only — not a brush slider)
    lastTapAt: 0,
    lastTapX: 0,
    lastTapY: 0,
    clientAgg: null, // {aggregates, uncertainty} when institutes filtered
    clientAggKey: null,
    skipUrlWrite: false,
    refreshing: false,
    tablePage: 0,
    tableQuery: "",
  };

  function pctDisplay(frac) {
    if (frac == null || Number.isNaN(frac)) return "—";
    return fmtPct(frac) + "%";
  }

  function isActive(c) {
    return candCfg.isCandidateActive(c);
  }

  function candidatesForLegend() {
    const all = state.data?.candidates || [];
    if (state.showAll) return all;
    return all.filter(isActive);
  }

  /** Display polish only — does not invent poll numbers. */
  function prettyInstituteLabel(inst) {
    const raw = (inst && (inst.label || inst.id)) || "—";
    return String(raw)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  function prettyCandidateLabel(cand) {
    const raw = (cand && (cand.label || cand.id)) || "—";
    return String(raw)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  function institutesAllOn() {
    return (
      state.allInstituteIds.length > 0 &&
      state.institutesOn.size === state.allInstituteIds.length
    );
  }

  function setHeader(meta) {
    const chips = [];
    if (meta.example) {
      chips.push('<span class="chip accent">EXAMPLE</span>');
    }
    chips.push(`<span class="chip">ciclo ${meta.election_cycle || "—"}</span>`);
    chips.push(
      `<span class="chip">${meta.geography === "national" ? "nacional" : meta.geography || "—"}</span>`
    );
    chips.push(`<span class="chip">${meta.model_id || "modelo"}</span>`);
    if (meta.note) {
      chips.push(`<span class="chip">${escapeHtml(meta.note)}</span>`);
    }
    if (meta.generated_at) {
      const d = new Date(meta.generated_at);
      chips.push(
        `<span class="chip">gerado ${d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</span>`
      );
    }
    el.headerMeta.innerHTML = chips.join("");
    const scen = scenarioDisplayLabel(meta);
    el.scenario.textContent = `Cenário: ${scen}`;
    if (el.exampleBanner) {
      el.exampleBanner.hidden = !meta.example;
    }
    if (el.geoChip) {
      el.geoChip.textContent =
        meta.geography === "national" ? "Nacional" : meta.geography || "—";
    }
    if (el.promptChip) {
      const scen = String(meta.scenario || "");
      if (/spontaneous/i.test(scen)) {
        el.promptChip.textContent = "Espontânea";
        el.promptChip.title = "Série: espontânea";
      } else {
        el.promptChip.textContent = "Estimulada";
        el.promptChip.title =
          "Série canônica PEBR: estimulada (espontânea não entra neste gráfico)";
      }
    }
    syncRoundControls();
    syncRangeControls();
    syncMatchupRow();
  }

  function scenarioDisplayLabel(meta) {
    if (!meta) return "—";
    if (meta.matchup_label) return meta.matchup_label;
    const scenario = meta.scenario || "";
    if (SCENARIO_LABELS[scenario]) return SCENARIO_LABELS[scenario];
    if (/stimulated_2nd_round_/.test(scenario) && scenario.includes("_vs_")) {
      const rest = scenario.replace(/^stimulated_2nd_round_/, "");
      const parts = rest.split("_vs_");
      if (parts.length === 2) {
        const pretty = (s) =>
          String(s)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (ch) => ch.toUpperCase());
        return `Estimulada · 2º · ${pretty(parts[0])} × ${pretty(parts[1])}`;
      }
    }
    return scenario || "—";
  }

  function syncRoundControls() {
    const is2nd = state.round === 2;
    if (el.round1) {
      el.round1.classList.toggle("active", !is2nd);
      el.round1.setAttribute("aria-pressed", !is2nd ? "true" : "false");
      el.round1.disabled = false;
      el.round1.title = "Estimulada · 1º turno";
    }
    if (el.round2) {
      el.round2.classList.toggle("active", !!is2nd);
      el.round2.setAttribute("aria-pressed", is2nd ? "true" : "false");
      el.round2.disabled = !state.has2nd;
      el.round2.title = state.has2nd
        ? "Estimulada · 2º turno (confrontos pairwise)"
        : "Série de 2º turno ainda não disponível (chart-2nd-round.json)";
    }
  }

  function syncRangeControls() {
    const cur =
      state.rangeDays == null ? "all" : String(state.rangeDays);
    if (!el.rangeBtns) return;
    el.rangeBtns.forEach((btn) => {
      const on = btn.dataset.range === cur;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function setRangeDays(v) {
    const next = v === "all" || v == null ? null : Number(v);
    if (next === state.rangeDays || (next == null && state.rangeDays == null)) {
      return;
    }
    if (next != null && !Number.isFinite(next)) return;
    state.rangeDays = next;
    syncRangeControls();
    writeUrlState();
    if (state.data) {
      // Re-render with same visibility / institutes
      const keepShowAll = state.showAll;
      const keepVisible = new Set(state.visible);
      const keepInstitutes = new Set(state.institutesOn);
      renderChart(state.data);
      state.showAll = keepShowAll;
      if (keepInstitutes.size) {
        const allowed = new Set(state.allInstituteIds);
        state.institutesOn = new Set(
          [...keepInstitutes].filter((id) => allowed.has(id))
        );
        if (!state.institutesOn.size) applyDefaultInstitutes();
        buildInstituteFilters();
        syncFilterNote();
      }
      if (keepVisible.size) {
        const allowed = new Set(candidatesForLegend().map((c) => c.id));
        state.visible = new Set([...keepVisible].filter((id) => allowed.has(id)));
        if (!state.visible.size) applyDefaultVisibility();
        syncShowAllBtn();
        buildLegend();
        redrawSeries();
      }
      resetTablePage();
      refreshExtras();
    }
  }

  function syncMatchupRow() {
    if (!el.matchupRow) return;
    const show = state.round === 2 && state.has2nd;
    el.matchupRow.hidden = !show;
    if (show) buildMatchupFilters();
  }

  /** Materialize a single-scenario chart doc from multi-scenario 2º wrapper. */
  function docFrom2nd(multi, scenarioId) {
    const blocks = multi?.scenarios || [];
    if (!blocks.length) throw new Error("chart-2nd-round.json sem scenarios[]");
    const block =
      blocks.find((b) => b.scenario === scenarioId) || blocks[0];
    return {
      schema_version: multi.schema_version,
      model_id: multi.model_id,
      unit: multi.unit,
      params: multi.params,
      band_meaning: multi.band_meaning,
      election_cycle: multi.election_cycle,
      geography: multi.geography,
      scenario: block.scenario,
      matchup_label: block.label || scenarioDisplayLabel({ scenario: block.scenario }),
      example: multi.example,
      note: multi.note,
      candidates: block.candidates,
      institutes: block.institutes,
      generated_at: multi.generated_at,
      date_range: block.date_range,
      series: block.series,
    };
  }

  function matchupPollCount(block) {
    if (!block || !Array.isArray(block.series)) return 0;
    const ids = new Set();
    for (const row of block.series) {
      if (row.series_kind === "poll" && row.poll_id) ids.add(row.poll_id);
    }
    return ids.size;
  }

  function shortMatchupLabel(block) {
    const raw = block.label || scenarioDisplayLabel({ scenario: block.scenario });
    return String(raw)
      .replace(/Flavio Bolsonaro/gi, "Flávio")
      .replace(/Flávio Bolsonaro/gi, "Flávio")
      .replace(/Augusto Cury/gi, "Cury")
      .replace(/Ronaldo Caiado/gi, "Caiado")
      .replace(/Romeu Zema/gi, "Zema")
      .replace(/Renan Santos/gi, "Renan")
      .replace(/\s*×\s*/g, " × ");
  }

  function isPrimaryMatchup(scenario) {
    const s = String(scenario || "");
    return (
      s.includes("flavio_bolsonaro_vs_lula") ||
      s.includes("lula_vs_flavio_bolsonaro")
    );
  }

  function sortedMatchupBlocks() {
    const blocks = (state.chart2nd?.scenarios || []).slice();
    blocks.sort((a, b) => {
      const pa = isPrimaryMatchup(a.scenario) ? 0 : 1;
      const pb = isPrimaryMatchup(b.scenario) ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return matchupPollCount(b) - matchupPollCount(a);
    });
    return blocks;
  }

  function preferDefault2ndScenario() {
    const blocks = state.chart2nd?.scenarios || [];
    if (!blocks.length) return null;
    const primary = blocks.find((b) => isPrimaryMatchup(b.scenario));
    if (primary) return primary.scenario;
    return sortedMatchupBlocks()[0].scenario;
  }

  function buildMatchupFilters() {
    if (!el.matchupFilters || !state.chart2nd) return;
    const blocks = sortedMatchupBlocks();
    el.matchupFilters.innerHTML = "";
    blocks.forEach((block) => {
      const btn = document.createElement("button");
      btn.type = "button";
      const on = state.activeScenario === block.scenario;
      const primary = isPrimaryMatchup(block.scenario);
      btn.className =
        "chip-btn matchup-chip" +
        (on ? " on" : "") +
        (primary ? " primary-matchup" : "");
      const nPolls = matchupPollCount(block);
      const label = shortMatchupLabel(block);
      btn.innerHTML =
        `<span class="matchup-name">${label}</span>` +
        (nPolls
          ? `<span class="matchup-count" title="Pesquisas distintas neste confronto">${nPolls}</span>`
          : "");
      btn.dataset.scenario = block.scenario;
      btn.title = `${block.label || block.scenario}${nPolls ? ` · ${nPolls} pesquisas` : ""}`;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.addEventListener("click", () => {
        if (state.activeScenario === block.scenario) return;
        state.activeScenario = block.scenario;
        writeUrlState();
        const doc = docFrom2nd(state.chart2nd, state.activeScenario);
        renderChart(doc);
      });
      el.matchupFilters.appendChild(btn);
    });
    if (el.matchupHint) {
      const cur = blocks.find((b) => b.scenario === state.activeScenario);
      if (cur) {
        el.matchupHint.hidden = false;
        const n = matchupPollCount(cur);
        el.matchupHint.textContent = primaryHint(cur, n);
      } else {
        el.matchupHint.hidden = true;
      }
    }
  }

  function primaryHint(block, nPolls) {
    const name = shortMatchupLabel(block);
    const primary = isPrimaryMatchup(block.scenario)
      ? "Confronto principal do painel. "
      : "";
    return `${primary}${name} · ${nPolls} pesquisa${nPolls === 1 ? "" : "s"} · só este par no gráfico.`;
  }

  async function switchRound(round) {
    if (round === state.round) return;
    if (round === 2 && !state.has2nd) return;
    state.round = round;
    state.showAll = false;
    state.clientAgg = null;
    state.clientAggKey = null;
    if (round === 1) {
      state.activeScenario = null;
      writeUrlState();
      renderChart(state.chart1st);
    } else {
      if (!state.activeScenario && state.chart2nd?.scenarios?.length) {
        state.activeScenario = preferDefault2ndScenario();
      }
      writeUrlState();
      renderChart(docFrom2nd(state.chart2nd, state.activeScenario));
    }
  }

  function renderMethodChips(meta) {
    if (!el.methodChips) return;
    const params = meta.params || {};
    const k = params.k_days != null ? params.k_days : "—";
    const w = params.flood_W_days != null ? params.flood_W_days : "—";
    const nCap = params.n_cap != null ? params.n_cap : "—";
    const chips = [
      { html: "<strong>Option B</strong> · √N trailing" },
      { html: `janela <strong>${k}d</strong>` },
      { html: `anti-flood <strong>${w}d</strong>` },
      { html: `N cap <strong>${nCap}</strong>` },
      { html: "sem house effects" },
      { html: "não é previsão" },
    ];
    el.methodChips.innerHTML = chips
      .map((c) => `<span class="chip-static">${c.html}</span>`)
      .join("");
    if (el.methodDisclaimer) {
      const band =
        meta.band_meaning ||
        "dispersão na janela (não IC clássico, não probabilidade de vitória)";
      el.methodDisclaimer.textContent =
        `Agregado Option B: média ponderada por √N nos últimos ~${k} dias, freio anti-enchente por instituto, datada no meio do campo. Faixa = ${band}. Sem correção de viés de casa.`;
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clearDetail() {
    el.detail.innerHTML =
      '<p class="muted">Passe o mouse sobre um ponto de pesquisa.</p>';
  }

  /** Lean hover card: candidate, %, institute, N, date only. */
  function showPollDetail(d, cand, inst) {
    const name = cand ? prettyCandidateLabel(cand) : d.candidate_id || "—";
    const color = cand?.color || "#94a3b8";
    el.detail.innerHTML = `
      <p class="cand-name" style="color:${color}">${name}</p>
      <p class="value-big">${pctDisplay(d.value)}</p>
      <dl>
        <dt>Instituto</dt><dd>${inst ? prettyInstituteLabel(inst) : d.institute_id || "—"}</dd>
        <dt>N</dt><dd>${d.n != null ? d.n.toLocaleString("pt-BR") : "—"}</dd>
        <dt>Data</dt><dd>${fmtDate(d.date)}</dd>
      </dl>`;
  }

  function syncShowAllBtn() {
    if (!el.showAllBtn) return;
    el.showAllBtn.setAttribute("aria-pressed", state.showAll ? "true" : "false");
    el.showAllBtn.classList.toggle("is-on", state.showAll);
    el.showAllBtn.textContent = state.showAll ? "só em disputa" : "mostrar todos";
    el.showAllBtn.title = state.showAll
      ? "Ocultar candidatos inativos / fora da disputa"
      : "Mostrar também candidatos inativos / fora da disputa";
  }

  function syncFilterNote() {
    if (!el.filterNote) return;
    if (institutesAllOn()) {
      el.filterNote.hidden = true;
      el.filterNote.textContent = "";
      return;
    }
    el.filterNote.hidden = false;
    const n = state.institutesOn.size;
    const soloName =
      n === 1
        ? prettyInstituteLabel(
            state.instById.get([...state.institutesOn][0]) || {
              id: [...state.institutesOn][0],
            }
          )
        : null;
    el.filterNote.textContent = soloName
      ? `Só ${soloName}: pontos desse instituto. Linha/faixa = Option B recalculada no navegador (mesmas regras √N + anti-flood) sobre esses pontos.`
      : "Filtro de institutos ativo: pontos filtrados. Linha/faixa = Option B recalculada no navegador sobre o subconjunto (não usa o agregado pré-computado de todos).";
  }

  function applyDefaultVisibility() {
    state.visible = new Set();
    const list = candidatesForLegend();
    list.forEach((c) => state.visible.add(c.id));
    // If filter emptied the set (bad metadata), fall back to all
    if (!state.visible.size && state.data?.candidates?.length) {
      state.data.candidates.forEach((c) => state.visible.add(c.id));
    }
  }

  function applyDefaultInstitutes() {
    state.allInstituteIds = (state.data?.institutes || []).map((i) => i.id);
    if (!state.allInstituteIds.length && state.payload?.polls?.length) {
      state.allInstituteIds = Array.from(
        new Set(state.payload.polls.map((p) => p.institute_id).filter(Boolean))
      ).sort();
    }
    state.institutesOn = new Set(state.allInstituteIds);
  }

  function buildInstituteFilters() {
    if (!el.instituteFilters) return;
    el.instituteFilters.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "chip-btn all" + (institutesAllOn() ? " on" : "");
    allBtn.textContent = "Todos";
    allBtn.title = institutesAllOn()
      ? "Todos os institutos visíveis"
      : "Mostrar todos os institutos (e linhas agregadas)";
    allBtn.addEventListener("click", () => {
      state.institutesOn = new Set(state.allInstituteIds);
      invalidateClientAgg();
      buildInstituteFilters();
      syncFilterNote();
      redrawSeries();
      resetTablePage();
      refreshExtras();
      clearHover();
      writeUrlState();
    });
    el.instituteFilters.appendChild(allBtn);

    const institutes = state.data?.institutes || [];
    const list =
      institutes.length > 0
        ? institutes
        : state.allInstituteIds.map((id) => ({ id, label: id }));

    list.forEach((inst) => {
      const id = inst.id;
      const btn = document.createElement("button");
      btn.type = "button";
      const solo =
        state.institutesOn.size === 1 && state.institutesOn.has(id);
      btn.className =
        "chip-btn" + (state.institutesOn.has(id) ? " on" : "") + (solo ? " solo" : "");
      btn.textContent = prettyInstituteLabel(inst);
      btn.dataset.instituteId = id;
      btn.title = solo
        ? "Só este instituto (clique em Todos para ver todos)"
        : "Mostrar só este instituto";
      btn.addEventListener("click", () => {
        // Exclusive solo: one click isolates that institute.
        // Already-solo chip stays on (no empty selection).
        if (state.institutesOn.size === 1 && state.institutesOn.has(id)) return;
        state.institutesOn = new Set([id]);
        invalidateClientAgg();
        buildInstituteFilters();
        syncFilterNote();
        redrawSeries();
        resetTablePage();
        refreshExtras();
        clearHover();
        writeUrlState();
      });
      el.instituteFilters.appendChild(btn);
    });
  }

  function buildLegend() {
    // Candidate toggles live in the denser filter bar (old-site clarity).
    // Keep #legend in sync if present, but prefer #candidate-filters.
    const host = el.candidateFilters || el.legend;
    if (!host) return;
    host.innerHTML = "";
    if (el.legend && el.legend !== host) el.legend.innerHTML = "";
    const candidates = candidatesForLegend();
    candidates.forEach((c) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className =
        "chip-btn" +
        (state.visible.has(c.id) ? " on" : " off") +
        (isActive(c) ? "" : " is-inactive");
      item.dataset.candidateId = c.id;
      item.title = isActive(c)
        ? "Alternar no gráfico"
        : "Fora da disputa (visível com “mostrar todos”)";
      item.innerHTML = `<span class="cand-swatch" style="background:${c.color}"></span>${prettyCandidateLabel(c)}`;
      item.addEventListener("click", () => {
        if (state.visible.has(c.id)) {
          if (state.visible.size <= 1) return;
          state.visible.delete(c.id);
        } else {
          state.visible.add(c.id);
        }
        buildLegend();
        redrawSeries();
        refreshExtras();
        clearHover();
      });
      host.appendChild(item);
    });
  }

  function size() {
    const rect = el.svg.getBoundingClientRect();
    const width = Math.max(320, rect.width || el.svg.parentElement.clientWidth || 960);
    // Prefer laid-out CSS height (desktop ~560–640px; mobile may be shorter)
    const height = Math.max(420, rect.height || 600);
    return {
      width,
      height,
      innerW: width - MARGIN.left - MARGIN.right,
      innerH: height - MARGIN.top - MARGIN.bottom,
    };
  }

  function prepareSeries(raw) {
    const polls = [];
    const aggregates = [];
    const uncertainty = [];
    for (const row of raw.series) {
      const date = parseDate(row.date);
      if (!date) continue;
      const base = { ...row, date };
      if (row.series_kind === "poll") polls.push(base);
      else if (row.series_kind === "aggregate") aggregates.push(base);
      else if (row.series_kind === "uncertainty") uncertainty.push(base);
    }
    return { polls, aggregates, uncertainty };
  }

  function initScales(payload, dims) {
    const { polls, aggregates, uncertainty } = payload;
    const allDates = [
      ...polls.map((d) => d.date),
      ...aggregates.map((d) => d.date),
      ...uncertainty.map((d) => d.date),
    ];
    let xMin = d3.min(allDates);
    let xMax = d3.max(allDates);
    if (rawDateRange(state.data)) {
      const dr = rawDateRange(state.data);
      if (dr[0]) xMin = dr[0];
      if (dr[1]) xMax = dr[1];
    }
    // Período view cut (old-site 30d/90d/tudo) — not a bottom brush slider
    if (state.rangeDays && xMax) {
      const cut = new Date(xMax.getTime() - state.rangeDays * 86400000);
      if (xMin == null || cut > xMin) xMin = cut;
    }
    const yVals = [
      ...polls.map((d) => d.value),
      ...aggregates.map((d) => d.value),
      ...uncertainty.map((d) => d.band_low),
      ...uncertainty.map((d) => d.band_high),
    ].filter((v) => v != null && !Number.isNaN(v));
    const yMax = Math.min(1, Math.max(0.45, (d3.max(yVals) || 0.4) * 1.12));

    state.x0 = d3.scaleUtc().domain([xMin, xMax]).range([0, dims.innerW]);
    state.y0 = d3.scaleLinear().domain([0, yMax]).nice().range([dims.innerH, 0]);
    state.xScale = state.x0.copy();
    state.yScale = state.y0.copy();
  }

  function rawDateRange(data) {
    if (!data?.date_range) return null;
    return [parseDate(data.date_range.start), parseDate(data.date_range.end)];
  }

  function highlightPoll(d) {
    const cand = state.candById.get(d.candidate_id);
    const inst = state.instById.get(d.institute_id);
    showPollDetail(d, cand, inst);
    state.layers.crosshair
      .attr("x1", state.xScale(d.date))
      .attr("x2", state.xScale(d.date))
      .style("opacity", 1);
    state.layers.focus
      .attr("cx", state.xScale(d.date))
      .attr("cy", state.yScale(d.value))
      .attr("stroke", cand?.color || "#fff")
      .style("opacity", 1);
    state.layers.points.selectAll(".poll-point").classed("is-active", (p) => p === d);
  }

  function clearHover() {
    if (!state.layers.crosshair) return;
    state.layers.crosshair.style("opacity", 0);
    state.layers.focus.style("opacity", 0);
    state.layers.points.selectAll(".poll-point").classed("is-active", false).attr("r", 4);
    clearDetail();
  }

  function pollPassesInstitute(d) {
    if (!state.institutesOn.size) return true;
    return state.institutesOn.has(d.institute_id);
  }

  function nearestVisiblePoll(mx, my, polls) {
    const visiblePolls = polls.filter(
      (d) => state.visible.has(d.candidate_id) && pollPassesInstitute(d)
    );
    let best = null;
    let bestDist = Infinity;
    for (const d of visiblePolls) {
      const dx = state.xScale(d.date) - mx;
      const dy = state.yScale(d.value) - my;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    if (best && bestDist <= POLL_HIT_PX2) return best;
    return null;
  }


  /** TradingView/Polymarket: transform drives time (X) only; Y stays on data domain. */
  function applyTimeZoom(transform) {
    state.xScale = transform.rescaleX(state.x0);
    state.yScale = state.y0.copy();
    const dims = state.dims || size();
    redrawSeries();
    drawAxes(dims);
  }

  function resetZoom() {
    if (!state.zoomRect || !state.zoomBehavior) return;
    clearHover();
    state.zoomRect
      .transition()
      .duration(280)
      .ease(d3.easeCubicOut)
      .call(state.zoomBehavior.transform, d3.zoomIdentity);
  }

  function setPanning(on) {
    if (!el.svg) return;
    el.svg.classList.toggle("is-panning", !!on);
    if (state.zoomRect) {
      state.zoomRect.style("cursor", on ? "grabbing" : "grab");
    }
  }

  function renderChart(data) {
    state.data = data;
    invalidateClientAgg();
    state.candById = new Map(data.candidates.map((c) => [c.id, c]));
    state.instById = new Map((data.institutes || []).map((i) => [i.id, i]));
    setHeader(data);
    renderMethodChips(data);
    applyDefaultVisibility();
    syncShowAllBtn();
    buildLegend();

    const payload = prepareSeries(data);
    state.payload = payload;
    applyDefaultInstitutes();
    buildInstituteFilters();
    syncFilterNote();

    const dims = size();
    const svg = d3.select(el.svg);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${dims.width} ${dims.height}`).attr("width", "100%").attr("height", dims.height);

    const root = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const clipId = "pebr-plot-clip";
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("width", dims.innerW)
      .attr("height", dims.innerH);

    initScales(payload, dims);

    state.layers.xGrid = root.append("g").attr("class", "grid grid-x").attr("transform", `translate(0,${dims.innerH})`);
    state.layers.yGrid = root.append("g").attr("class", "grid grid-y");
    state.layers.xAxis = root.append("g").attr("class", "axis axis-x").attr("transform", `translate(0,${dims.innerH})`);
    state.layers.yAxis = root.append("g").attr("class", "axis axis-y");

    const plot = root.append("g").attr("clip-path", `url(#${clipId})`);
    state.layers.ribbons = plot.append("g").attr("class", "ribbons");
    state.layers.lines = plot.append("g").attr("class", "lines");
    state.layers.points = plot.append("g").attr("class", "points");

    state.layers.crosshair = plot
      .append("line")
      .attr("class", "crosshair")
      .attr("y1", 0)
      .attr("y2", dims.innerH)
      .style("opacity", 0);
    state.layers.focus = plot
      .append("circle")
      .attr("r", 5)
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("opacity", 0);

    root
      .append("text")
      .attr("x", -dims.innerH / 2)
      .attr("y", -36)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", 11)
      .text("Intenção de voto (%)");

    // Zoom/pan surface only — no bottom brush / range slider.
    // Time-axis (X) zoom+pan like TradingView/Polymarket; Y stays on data domain.
    state.dims = dims;
    const zoomRect = plot
      .append("rect")
      .attr("class", "zoom-rect")
      .attr("width", dims.innerW)
      .attr("height", dims.innerH)
      .attr("fill", "transparent")
      .style("cursor", "grab")
      .attr("aria-hidden", "true");
    state.zoomRect = zoomRect;

    state.zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 32])
      .extent([
        [0, 0],
        [dims.innerW, dims.innerH],
      ])
      .translateExtent([
        [0, 0],
        [dims.innerW, dims.innerH],
      ])
      // Let toolbar chips/buttons receive clicks; ignore non-primary mouse.
      // Wheel always zooms (ctrl+wheel left to browser page-zoom).
      .filter((event) => {
        if (event.type === "wheel") return !event.ctrlKey;
        if (event.button && event.button !== 0) return false;
        const t = event.target;
        if (t && t.closest && t.closest("button, a, input, select, textarea, label")) {
          return false;
        }
        return true;
      })
      // Slightly gentler than d3 default — TradingView-ish steps toward cursor.
      .wheelDelta((event) => {
        const unit =
          event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.00155;
        return -event.deltaY * unit;
      })
      .on("start", (event) => {
        if (event.sourceEvent && event.sourceEvent.type !== "wheel") {
          setPanning(true);
          clearHover();
        }
      })
      .on("zoom", (event) => {
        applyTimeZoom(event.transform);
      })
      .on("end", () => {
        setPanning(false);
      });

    zoomRect.call(state.zoomBehavior);
    // Replace d3 dblclick zoom-in with reset (also keeps Redefinir zoom button).
    zoomRect.on("dblclick.zoom", null);
    zoomRect.on("dblclick.reset", (event) => {
      event.preventDefault();
      resetZoom();
    });

    // Double-tap reset on touch (pinch/pan still handled by d3.zoom).
    zoomRect.on("pointerup.dbltap", (event) => {
      if (event.pointerType !== "touch") return;
      const now = performance.now();
      const dt = now - state.lastTapAt;
      const dx = event.clientX - state.lastTapX;
      const dy = event.clientY - state.lastTapY;
      if (dt > 0 && dt < 300 && dx * dx + dy * dy < 576) {
        resetZoom();
        state.lastTapAt = 0;
      } else {
        state.lastTapAt = now;
        state.lastTapX = event.clientX;
        state.lastTapY = event.clientY;
      }
    });

    // Single nearest poll point only — never a multi-candidate ranking overlay
    zoomRect.on("mousemove", function (event) {
      if (el.svg && el.svg.classList.contains("is-panning")) return;
      const [mx, my] = d3.pointer(event, this);
      const hit = nearestVisiblePoll(mx, my, payload.polls);
      if (hit) highlightPoll(hit);
      else clearHover();
    });

    zoomRect.on("mouseleave", () => {
      setPanning(false);
      clearHover();
    });

    if (el.resetBtn) {
      el.resetBtn.onclick = () => resetZoom();
    }

    if (el.showAllBtn) {
      el.showAllBtn.onclick = () => {
        state.showAll = !state.showAll;
        applyDefaultVisibility();
        syncShowAllBtn();
        buildLegend();
        redrawSeries();
        resetTablePage();
        refreshExtras();
        clearHover();
        writeUrlState();
      };
    }

    drawAxes(dims);
    redrawSeries();
    refreshExtras();

    if (el.placeholder) el.placeholder.classList.add("hidden");
  }

  function drawAxes(dims) {
    state.layers.xAxis.call(
      d3
        .axisBottom(state.xScale)
        .ticks(Math.min(8, Math.floor(dims.innerW / 80)))
        .tickFormat(d3.utcFormat("%d/%m"))
    );
    state.layers.yAxis.call(
      d3
        .axisLeft(state.yScale)
        .ticks(6)
        .tickFormat((d) => (d * 100).toFixed(0))
    );
    state.layers.xGrid.call(
      d3
        .axisBottom(state.xScale)
        .ticks(Math.min(8, Math.floor(dims.innerW / 80)))
        .tickSize(-dims.innerH)
        .tickFormat("")
    );
    state.layers.yGrid.call(
      d3.axisLeft(state.yScale).ticks(6).tickSize(-dims.innerW).tickFormat("")
    );
  }

  function invalidateClientAgg() {
    state.clientAgg = null;
    state.clientAggKey = null;
  }

  function clientAggKey() {
    const ids = [...state.institutesOn].sort().join(",");
    const cids = [...state.visible].sort().join(",");
    const scen = state.data?.scenario || "";
    return `${scen}|${ids}|${cids}`;
  }

  function ensureClientOptionB() {
    if (institutesAllOn()) {
      invalidateClientAgg();
      return null;
    }
    const api = typeof window !== "undefined" ? window.PEBR_OPTION_B : null;
    if (!api || typeof api.aggregateFromFlatPolls !== "function") return null;
    const key = clientAggKey();
    if (state.clientAgg && state.clientAggKey === key) return state.clientAgg;
    const polls = (state.payload?.polls || []).filter((d) =>
      pollPassesInstitute(d)
    );
    const params = Object.assign({}, api.DEFAULTS, state.data?.params || {});
    const candIds = (state.data?.candidates || [])
      .filter((c) => state.visible.has(c.id))
      .map((c) => c.id);
    const result = api.aggregateFromFlatPolls(polls, params, candIds);
    state.clientAgg = result;
    state.clientAggKey = key;
    return result;
  }

  function redrawSeries() {
    const { polls, aggregates, uncertainty } = state.payload;
    const candidates = (state.data.candidates || []).filter((c) => state.visible.has(c.id));
    const usePipeline = institutesAllOn();
    const client = usePipeline ? null : ensureClientOptionB();
    const aggSrc = usePipeline ? aggregates : client ? client.aggregates : [];
    const uncSrc = usePipeline ? uncertainty : client ? client.uncertainty : [];
    const showAgg = usePipeline || (client && client.aggregates.length > 0);

    const area = d3
      .area()
      .x((d) => state.xScale(d.date))
      .y0((d) => state.yScale(d.band_low))
      .y1((d) => state.yScale(d.band_high))
      .curve(d3.curveMonotoneX);

    const ribbonData = showAgg
      ? candidates.map((c) => ({
          id: c.id,
          color: c.color,
          values: uncSrc
            .filter((d) => d.candidate_id === c.id)
            .sort((a, b) => a.date - b.date),
        }))
      : [];

    const ribbons = state.layers.ribbons.selectAll("path.unc-ribbon").data(ribbonData, (d) => d.id);
    ribbons.exit().remove();
    ribbons
      .enter()
      .append("path")
      .attr("class", "unc-ribbon")
      .merge(ribbons)
      .attr("fill", (d) => d.color)
      .attr("d", (d) => (d.values.length ? area(d.values) : null));

    const line = d3
      .line()
      .x((d) => state.xScale(d.date))
      .y((d) => state.yScale(d.value))
      .curve(d3.curveMonotoneX)
      .defined((d) => d.value != null);

    const lineData = showAgg
      ? candidates.map((c) => ({
          id: c.id,
          color: c.color,
          values: aggSrc
            .filter((d) => d.candidate_id === c.id)
            .sort((a, b) => a.date - b.date),
        }))
      : [];

    const lines = state.layers.lines.selectAll("path.agg-line").data(lineData, (d) => d.id);
    lines.exit().remove();
    lines
      .enter()
      .append("path")
      .attr("class", "agg-line")
      .merge(lines)
      .attr("stroke", (d) => d.color)
      .attr("d", (d) => (d.values.length ? line(d.values) : null));

    const visPolls = polls.filter(
      (d) => state.visible.has(d.candidate_id) && pollPassesInstitute(d)
    );
    const pts = state.layers.points
      .selectAll("circle.poll-point")
      .data(visPolls, (d) => d.poll_id + ":" + d.candidate_id);
    pts.exit().remove();
    pts
      .enter()
      .append("circle")
      .attr("class", "poll-point")
      .attr("r", 4)
      .merge(pts)
      .attr("cx", (d) => state.xScale(d.date))
      .attr("cy", (d) => state.yScale(d.value))
      .attr("fill", (d) => state.candById.get(d.candidate_id)?.color || "#94a3b8")
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("r", 6);
        highlightPoll(d);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("r", 4);
      });
  }

  function visiblePollRows() {
    const polls = state.payload?.polls || [];
    let rows = polls.filter(
      (d) => state.visible.has(d.candidate_id) && pollPassesInstitute(d)
    );
    if (state.rangeDays && state.x0) {
      const domain = state.x0.domain();
      const xMin = domain[0];
      const xMax = domain[1];
      rows = rows.filter((d) => d.date >= xMin && d.date <= xMax);
    }
    return rows;
  }

  const THEME_KEY = "pebr-theme";
  const FILTER_COLLAPSE_KEY_PREFIX = "pebr-collapse-";
  const SUMMARY_CARD_CAP = 8;

  function readFilterCollapseState(key) {
    try {
      const saved = localStorage.getItem(FILTER_COLLAPSE_KEY_PREFIX + key);
      if (saved === "closed" || saved === "false") return false;
      if (saved === "open" || saved === "true") return true;
    } catch (error) {
      // localStorage may be unavailable in private/restricted browsing modes.
    }
    return true;
  }

  function writeFilterCollapseState(key, open) {
    try {
      localStorage.setItem(
        FILTER_COLLAPSE_KEY_PREFIX + key,
        open ? "open" : "closed"
      );
    } catch (error) {
      // Keep the control usable when persistence is unavailable.
    }
  }

  function setFilterSectionOpen(section, open, persist) {
    const toggle = section.querySelector(".filter-toggle");
    if (!toggle) return;
    const contentId = toggle.getAttribute("aria-controls");
    const content = contentId ? document.getElementById(contentId) : null;
    const labelEl = toggle.querySelector(".filter-label");
    const label = (labelEl && labelEl.textContent.trim()) || "Filtros";
    section.classList.toggle("is-collapsed", !open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      open ? `${label} — recolher` : `${label} — expandir`
    );
    if (content) content.hidden = !open;
    if (persist) {
      writeFilterCollapseState(section.dataset.collapseSection, open);
    }
  }

  function installFilterCollapsibles() {
    document.querySelectorAll("[data-collapse-section]").forEach((section) => {
      const key = section.dataset.collapseSection;
      const toggle = section.querySelector(".filter-toggle");
      if (!key || !toggle) return;
      setFilterSectionOpen(section, readFilterCollapseState(key), false);
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        setFilterSectionOpen(section, open, true);
      });
    });
  }

  function fmtDeltaPp(fracDelta) {
    if (fracDelta == null || Number.isNaN(fracDelta)) {
      return { text: "—", cls: "flat" };
    }
    const pp = fracDelta * 100;
    const r = Math.round(pp * 100) / 100;
    if (Math.abs(r) < 0.005) {
      return { text: "0,00 pp vs 30d", cls: "flat" };
    }
    const sign = r > 0 ? "+" : "";
    return {
      text:
        sign +
        r.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        " pp vs 30d",
      cls: r > 0 ? "up" : "down",
    };
  }

  function currentAggSource() {
    const usePipeline = institutesAllOn();
    const client = usePipeline ? null : ensureClientOptionB();
    return {
      usePipeline,
      aggregates: usePipeline
        ? state.payload?.aggregates || []
        : client?.aggregates || [],
    };
  }

  function latestAggPair(candidateId, aggregates) {
    const rows = aggregates
      .filter((d) => d.candidate_id === candidateId && d.value != null)
      .slice()
      .sort((a, b) => a.date - b.date);
    if (!rows.length) return { cur: null, then: null };
    const last = rows[rows.length - 1];
    const ago = new Date(last.date.getTime() - 30 * 86400000);
    let then = null;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].date <= ago) {
        then = rows[i].value;
        break;
      }
    }
    return { cur: last.value, then };
  }

  function visibleCandidatesOrdered() {
    const { aggregates } = currentAggSource();
    const list = (state.data?.candidates || []).filter((c) =>
      state.visible.has(c.id)
    );
    return list
      .map((c) => {
        const pair = latestAggPair(c.id, aggregates);
        return { cand: c, cur: pair.cur, then: pair.then };
      })
      .sort((a, b) => {
        const av = a.cur == null ? -1 : a.cur;
        const bv = b.cur == null ? -1 : b.cur;
        return bv - av;
      });
  }

  function renderSummaryCards() {
    if (!el.summaryCards) return;
    if (!state.payload) {
      el.summaryCards.innerHTML = "";
      if (el.cardsNote) {
        el.cardsNote.hidden = true;
        el.cardsNote.textContent = "";
      }
      return;
    }
    const ordered = visibleCandidatesOrdered();
    const shown = ordered.slice(0, SUMMARY_CARD_CAP);
    el.summaryCards.innerHTML = shown
      .map(({ cand, cur, then }) => {
        const d = fmtDeltaPp(
          cur != null && then != null ? cur - then : null
        );
        const name = prettyCandidateLabel(cand);
        return (
          `<article class="summary-card" data-c="${escapeHtml(cand.id)}" style="--card-accent:${cand.color || "var(--accent)"}">` +
          `<div class="name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>` +
          `<div class="val">${pctDisplay(cur)}</div>` +
          `<div class="delta ${d.cls}">${d.text}</div>` +
          `</article>`
        );
      })
      .join("");
    if (el.cardsNote) {
      if (ordered.length > SUMMARY_CARD_CAP) {
        el.cardsNote.hidden = false;
        el.cardsNote.textContent = `Mostrando top ${SUMMARY_CARD_CAP} de ${ordered.length} candidatos visíveis (por agregado mais recente). Δ = variação vs ~30 dias no agregado Option B.`;
      } else if (shown.length) {
        el.cardsNote.hidden = false;
        el.cardsNote.textContent =
          "Agregado Option B mais recente · Δ vs ~30 dias (mesmos filtros de turno / instituto / candidatos).";
      } else {
        el.cardsNote.hidden = true;
        el.cardsNote.textContent = "";
      }
    }
  }

  function daysSince(date) {
    if (!date) return null;
    const ms = Date.now() - date.getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }

  function freshnessClass(age) {
    if (age == null) return "";
    if (age <= 7) return "fresh";
    if (age <= 30) return "stale";
    return "old";
  }

  function renderOverviewMetrics() {
    if (!el.metricPolls) return;
    const rows = visiblePollRows();
    const pollIds = new Set();
    const institutes = new Set();
    let latest = null;
    for (const d of rows) {
      if (d.poll_id) pollIds.add(d.poll_id);
      else
        pollIds.add(
          `${d.institute_id || "?"}|${d.date ? d.date.toISOString().slice(0, 10) : "?"}`
        );
      if (d.institute_id) institutes.add(d.institute_id);
      if (d.date && (!latest || d.date > latest)) latest = d.date;
    }
    // Prefer distinct polls; fall back to row count / candidate count heuristic
    const nPolls = pollIds.size || 0;
    el.metricPolls.textContent = nPolls
      ? nPolls.toLocaleString("pt-BR")
      : "0";
    el.metricInstitutes.textContent = institutes.size
      ? institutes.size.toLocaleString("pt-BR")
      : "0";
    if (el.metricCampo) {
      el.metricCampo.textContent = latest ? fmtDate(latest) : "—";
      el.metricCampo.className =
        "metric-value " + freshnessClass(daysSince(latest));
    }
    if (el.metricCampoSub) {
      const age = daysSince(latest);
      if (age == null) el.metricCampoSub.textContent = "sem data na vista";
      else if (age === 0) el.metricCampoSub.textContent = "campo hoje";
      else
        el.metricCampoSub.textContent = `há ${age} dia${age === 1 ? "" : "s"}`;
    }
  }

  function groupedVisiblePolls() {
    const rows = visiblePollRows();
    const byPoll = new Map();
    for (const d of rows) {
      const id =
        d.poll_id ||
        `${d.institute_id || "inst"}|${d.date ? d3.utcFormat("%Y-%m-%d")(d.date) : "?"}`;
      let g = byPoll.get(id);
      if (!g) {
        g = {
          poll_id: id,
          date: d.date,
          institute_id: d.institute_id,
          n: d.n != null ? d.n : null,
          shares: {},
        };
        byPoll.set(id, g);
      }
      g.shares[d.candidate_id] = d.value;
      if (d.n != null) g.n = d.n;
      if (d.date && (!g.date || d.date > g.date)) g.date = d.date;
      if (d.institute_id) g.institute_id = d.institute_id;
    }
    return [...byPoll.values()].sort((a, b) => {
      const ad = a.date ? a.date.getTime() : 0;
      const bd = b.date ? b.date.getTime() : 0;
      return bd - ad;
    });
  }

  function resetTablePage() {
    state.tablePage = 0;
  }

  function filteredTableGroups() {
    const groups = groupedVisiblePolls();
    const q = String(state.tableQuery || "")
      .trim()
      .toLocaleLowerCase("pt-BR");
    if (!q) return groups;
    return groups.filter((g) => {
      const inst = prettyInstituteLabel(
        state.instById.get(g.institute_id) || { id: g.institute_id }
      );
      const hay = [
        inst,
        g.institute_id,
        g.date ? fmtDate(g.date) : "",
        g.n != null ? String(g.n) : "",
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return hay.includes(q);
    });
  }

  function syncPollsPager(totalFiltered) {
    if (!el.pollsPager) return;
    const pages = Math.max(1, Math.ceil(totalFiltered / TABLE_PAGE_SIZE) || 1);
    if (state.tablePage >= pages) state.tablePage = pages - 1;
    if (state.tablePage < 0) state.tablePage = 0;
    const show = totalFiltered > TABLE_PAGE_SIZE;
    el.pollsPager.hidden = !show;
    if (el.pollsPrev) el.pollsPrev.disabled = state.tablePage <= 0;
    if (el.pollsNext) el.pollsNext.disabled = state.tablePage >= pages - 1;
    if (el.pollsPageLabel) {
      if (!totalFiltered) {
        el.pollsPageLabel.textContent = "—";
      } else {
        const from = state.tablePage * TABLE_PAGE_SIZE + 1;
        const to = Math.min(totalFiltered, (state.tablePage + 1) * TABLE_PAGE_SIZE);
        el.pollsPageLabel.textContent = `${from}–${to} de ${totalFiltered.toLocaleString("pt-BR")} · pág. ${state.tablePage + 1}/${pages}`;
      }
    }
  }

  function renderPollTable() {
    if (!el.pollsThead || !el.pollsTbody) return;
    const candCols = visibleCandidatesOrdered().map((x) => x.cand);
    // Cap candidate columns for readability when many are visible
    const cols = candCols.slice(0, 10);
    const allGroups = groupedVisiblePolls();
    const groups = filteredTableGroups();
    syncPollsPager(groups.length);
    const pageRows = groups.slice(
      state.tablePage * TABLE_PAGE_SIZE,
      state.tablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE
    );

    el.pollsThead.innerHTML =
      "<tr>" +
      '<th class="sticky-col">Data</th>' +
      "<th>Instituto</th>" +
      '<th class="num">N</th>' +
      cols
        .map(
          (c) =>
            `<th class="num" title="${escapeHtml(prettyCandidateLabel(c))}">${escapeHtml(
              shortCandLabel(c)
            )}</th>`
        )
        .join("") +
      (candCols.length > cols.length
        ? `<th title="Demais candidatos ocultos na tabela">+${candCols.length - cols.length}</th>`
        : "") +
      "</tr>";

    const colSpan = 3 + cols.length + (candCols.length > cols.length ? 1 : 0);
    if (!groups.length) {
      el.pollsTbody.innerHTML =
        '<tr><td colspan="' +
        colSpan +
        '" class="muted">' +
        (allGroups.length && state.tableQuery
          ? "Nenhuma pesquisa corresponde ao filtro da tabela."
          : "Nenhuma pesquisa visível com os filtros atuais.") +
        "</td></tr>";
    } else {
      el.pollsTbody.innerHTML = pageRows
        .map((g) => {
          const inst = prettyInstituteLabel(
            state.instById.get(g.institute_id) || { id: g.institute_id }
          );
          const cells = cols
            .map((c) => {
              const v = g.shares[c.id];
              return `<td class="num">${v == null ? "—" : pctDisplay(v)}</td>`;
            })
            .join("");
          const extra =
            candCols.length > cols.length ? '<td class="muted">…</td>' : "";
          return (
            "<tr>" +
            `<td class="sticky-col">${g.date ? fmtDate(g.date) : "—"}</td>` +
            `<td>${escapeHtml(inst)}</td>` +
            `<td class="num">${g.n != null ? g.n.toLocaleString("pt-BR") : "—"}</td>` +
            cells +
            extra +
            "</tr>"
          );
        })
        .join("");
    }
    if (el.pollsCount) {
      const qNote = state.tableQuery.trim()
        ? ` · filtro “${state.tableQuery.trim()}”`
        : "";
      el.pollsCount.textContent = allGroups.length
        ? `${allGroups.length.toLocaleString("pt-BR")} pesquisa${
            allGroups.length === 1 ? "" : "s"
          } · filtros atuais${qNote}`
        : "0 pesquisas · filtros atuais";
    }
  }

  function shortCandLabel(cand) {
    const raw = prettyCandidateLabel(cand);
    return String(raw)
      .replace(/Flávio Bolsonaro/gi, "Flávio")
      .replace(/Flavio Bolsonaro/gi, "Flávio")
      .replace(/Ronaldo Caiado/gi, "Caiado")
      .replace(/Romeu Zema/gi, "Zema")
      .replace(/Augusto Cury/gi, "Cury")
      .replace(/Renan Santos/gi, "Renan")
      .replace(/Tarcísio de Freitas/gi, "Tarcísio")
      .replace(/Tarcisio de Freitas/gi, "Tarcísio")
      .replace(/Ciro Gomes/gi, "Ciro")
      .replace(/Michel Temer/gi, "Temer")
      .replace(/Leonardo Avalanche/gi, "Avalanche")
      .replace(/Clariana Barão/gi, "Clariana")
      .replace(/Clariana Barao/gi, "Clariana");
  }

  function refreshExtras() {
    renderSummaryCards();
    renderOverviewMetrics();
    renderPollTable();
  }

  function currentTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch (_) {}
    if (el.themeBtn) {
      el.themeBtn.textContent = t === "dark" ? "Claro" : "Escuro";
      el.themeBtn.setAttribute(
        "aria-label",
        t === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
      );
      el.themeBtn.title =
        (t === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro") +
        " (atalho: T)";
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  function focusChart() {
    const target = el.chartShell || document.getElementById("chart-heading");
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function syncFullscreenBtn() {
    if (!el.fullscreenBtn) return;
    const on = !!document.fullscreenElement;
    el.fullscreenBtn.textContent = on ? "Sair tela cheia" : "Tela cheia";
    el.fullscreenBtn.setAttribute("aria-pressed", on ? "true" : "false");
    el.fullscreenBtn.title = on
      ? "Sair da tela cheia (atalho: F ou Esc)"
      : "Alternar tela cheia do painel do gráfico (atalho: F)";
  }

  async function toggleFullscreen() {
    const panel = el.chartPanel || document.querySelector(".chart-panel");
    if (!panel) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (panel.requestFullscreen) {
        await panel.requestFullscreen();
      } else {
        showToast("Tela cheia não disponível neste navegador");
      }
    } catch (_) {
      showToast("Não foi possível alternar tela cheia");
    }
  }

  function installFullscreen() {
    if (el.fullscreenBtn) {
      el.fullscreenBtn.addEventListener("click", () => {
        toggleFullscreen();
      });
    }
    document.addEventListener("fullscreenchange", () => {
      const panel = el.chartPanel || document.querySelector(".chart-panel");
      if (panel) {
        panel.classList.toggle(
          "is-fullscreen",
          document.fullscreenElement === panel
        );
      }
      syncFullscreenBtn();
      try {
        onResize();
      } catch (_) {}
    });
    syncFullscreenBtn();
  }

  function installPollsTableControls() {
    if (el.pollsSearch) {
      el.pollsSearch.addEventListener("input", () => {
        state.tableQuery = el.pollsSearch.value || "";
        resetTablePage();
        renderPollTable();
      });
    }
    if (el.pollsPrev) {
      el.pollsPrev.addEventListener("click", () => {
        if (state.tablePage <= 0) return;
        state.tablePage -= 1;
        renderPollTable();
      });
    }
    if (el.pollsNext) {
      el.pollsNext.addEventListener("click", () => {
        state.tablePage += 1;
        renderPollTable();
      });
    }
  }

  function installScrollTop() {
    const btn = el.scrollTopBtn;
    if (!btn) return;
    btn.hidden = false;
    const update = () => {
      btn.classList.toggle("show", window.scrollY > 480);
    };
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function isTypingTarget(t) {
    if (!t) return false;
    const tag = (t.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (t.isContentEditable) return true;
    return false;
  }

  function installKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      const k = event.key;
      if (k === "Escape") {
        clearHover();
        return;
      }
      if (k === "1") {
        event.preventDefault();
        switchRound(1);
        return;
      }
      if (k === "2") {
        event.preventDefault();
        switchRound(2);
        return;
      }
      if (k === "3") {
        event.preventDefault();
        setRangeDays(30);
        return;
      }
      if (k === "9") {
        event.preventDefault();
        setRangeDays(90);
        return;
      }
      if (k === "0") {
        event.preventDefault();
        setRangeDays("all");
        return;
      }
      if (k === "g" || k === "G") {
        event.preventDefault();
        focusChart();
        return;
      }
      if (k === "t" || k === "T") {
        event.preventDefault();
        toggleTheme();
        return;
      }
      if (k === "f" || k === "F") {
        event.preventDefault();
        toggleFullscreen();
      }
    });
  }

  function showToast(msg) {
    if (!el.toast) {
      try {
        console.info(msg);
      } catch (_) {}
      return;
    }
    el.toast.hidden = false;
    el.toast.textContent = msg;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      el.toast.hidden = true;
      el.toast.textContent = "";
    }, 2400);
  }

  function encodeInstituteBitmask(selectedIds) {
    const ids = state.allInstituteIds || [];
    if (!ids.length) return "";
    let mask = 0;
    const chosen = selectedIds instanceof Set ? selectedIds : new Set(selectedIds || []);
    for (let i = 0; i < ids.length && i < 31; i++) {
      if (chosen.has(ids[i])) mask |= 1 << i;
    }
    return mask.toString(36);
  }

  function decodeInstituteBitmask(token) {
    if (!token || !/^[0-9a-z]+$/i.test(token)) return null;
    const mask = parseInt(token, 36);
    if (!Number.isFinite(mask) || mask < 0) return null;
    const ids = state.allInstituteIds || [];
    const out = [];
    for (let i = 0; i < ids.length && i < 31; i++) {
      if (mask & (1 << i)) out.push(ids[i]);
    }
    return out;
  }

  function buildShareUrl() {
    const url = new URL(location.href);
    const params = new URLSearchParams();
    params.set("round", String(state.round || 1));
    if (state.rangeDays == null) params.set("range", "all");
    else params.set("range", String(state.rangeDays));
    if (state.round === 2 && state.activeScenario) {
      params.set("scenario", state.activeScenario);
    }
    if (state.showAll) params.set("show", "all");
    if (!institutesAllOn() && state.institutesOn.size) {
      const mask = encodeInstituteBitmask(state.institutesOn);
      if (mask) params.set("inst", mask);
      // Human-readable solo id kept for short links / back-compat
      if (state.institutesOn.size === 1) {
        params.set("institute", [...state.institutesOn][0]);
      } else {
        params.set(
          "institutes",
          [...state.institutesOn].sort().join(",")
        );
      }
    }
    url.search = params.toString();
    url.hash = "";
    return url.toString();
  }

  function writeUrlState() {
    if (state.skipUrlWrite) return;
    try {
      const next = buildShareUrl();
      if (next !== location.href) {
        history.replaceState(null, "", next);
      }
    } catch (_) {}
  }

  function readUrlState() {
    const params = new URLSearchParams(location.search);
    const round = Number(params.get("round"));
    if (round === 1 || round === 2) state.round = round;
    const range = params.get("range");
    if (range === "all") state.rangeDays = null;
    else if (/^\d+$/.test(range || "")) {
      const n = Number(range);
      if (n === 30 || n === 90) state.rangeDays = n;
    }
    const scenario = params.get("scenario");
    if (scenario) state.activeScenario = scenario;
    if (params.get("show") === "all") state.showAll = true;
    const institute = params.get("institute");
    const institutesCsv = params.get("institutes");
    const instMask = params.get("inst");
    return { institute, institutesCsv, instMask };
  }

  function applyInstitutesFromUrl(bits) {
    if (!bits || !state.allInstituteIds.length) return false;
    let selected = null;
    if (bits.instMask) {
      const decoded = decodeInstituteBitmask(bits.instMask);
      if (decoded && decoded.length) selected = decoded;
    }
    if (!selected && bits.institutesCsv) {
      const parts = String(bits.institutesCsv)
        .split(",")
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean);
      const allowed = new Set(state.allInstituteIds);
      const hit = parts.filter((id) => allowed.has(id));
      if (hit.length) selected = hit;
    }
    if (!selected && bits.institute && state.allInstituteIds.includes(bits.institute)) {
      selected = [bits.institute];
    }
    if (!selected || !selected.length) return false;
    state.institutesOn = new Set(selected);
    invalidateClientAgg();
    buildInstituteFilters();
    syncFilterNote();
    redrawSeries();
    resetTablePage();
    refreshExtras();
    return true;
  }

  async function shareView() {
    const url = buildShareUrl();
    writeUrlState();
    const payload = {
      title: document.title,
      text: "Pesquisas presidenciais brasileiro — PEBR 2026",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        showToast("Link copiado");
        return;
      }
      showToast("Copie o endereço da barra do navegador");
    } catch (err) {
      if (err && err.name === "AbortError") return;
      showToast("Não foi possível compartilhar");
    }
  }

  function onResize() {
    if (!state.data) return;
    const keepShowAll = state.showAll;
    const keepVisible = new Set(state.visible);
    const keepInstitutes = new Set(state.institutesOn);
    renderChart(state.data);
    state.showAll = keepShowAll;
    if (keepInstitutes.size) {
      const allowed = new Set(state.allInstituteIds);
      state.institutesOn = new Set([...keepInstitutes].filter((id) => allowed.has(id)));
      if (!state.institutesOn.size) applyDefaultInstitutes();
      buildInstituteFilters();
      syncFilterNote();
    }
    // Re-apply visibility after render's defaults if user had customized
    if (keepVisible.size) {
      const allowed = new Set(candidatesForLegend().map((c) => c.id));
      state.visible = new Set([...keepVisible].filter((id) => allowed.has(id)));
      if (!state.visible.size) applyDefaultVisibility();
      syncShowAllBtn();
      buildLegend();
      redrawSeries();
    }
    refreshExtras();
  }

  function formatPtTimestamp(date) {
    return date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function setDataStatus(kind, message) {
    if (!el.dataStatus) return;
    el.dataStatus.classList.remove("error", "checking");
    if (kind === "error" || kind === "checking") {
      el.dataStatus.classList.add(kind);
    }
    el.dataStatus.textContent = message;
  }

  function markDataLoaded(source) {
    const label = source === "refresh" ? "Última verificação" : "Dados carregados";
    setDataStatus(
      "loaded",
      `${label}: ${formatPtTimestamp(new Date())} (horário de Brasília)`
    );
  }

  function markDataError(error) {
    const detail = error && error.message ? `: ${error.message}` : ".";
    setDataStatus("error", `Falha ao verificar os dados${detail}`);
  }

  async function fetchChartBundle() {
    const bust = `?v=${Date.now()}`;
    const res1 = await fetch(`${DATA_URL_1ST}${bust}`, { cache: "no-store" });
    if (!res1.ok) throw new Error(`HTTP ${res1.status} ao carregar ${DATA_URL_1ST}`);
    const data1 = await res1.json();
    if (
      !data1 ||
      !Array.isArray(data1.series) ||
      !Array.isArray(data1.candidates)
    ) {
      throw new Error("chart.json sem candidates[]/series[] válidos");
    }

    let data2 = null;
    try {
      const res2 = await fetch(`${DATA_URL_2ND}${bust}`, { cache: "no-store" });
      if (res2.ok) {
        const candidate = await res2.json();
        const validScenarios =
          candidate &&
          Array.isArray(candidate.scenarios) &&
          candidate.scenarios.length &&
          candidate.scenarios.every(
            (scenario) =>
              scenario &&
              Array.isArray(scenario.series) &&
              Array.isArray(scenario.candidates)
          );
        if (validScenarios) {
          data2 = candidate;
        } else if (state.has2nd) {
          throw new Error(`${DATA_URL_2ND} sem scenarios[] válidos`);
        }
      } else if (state.has2nd) {
        throw new Error(`HTTP ${res2.status} ao carregar ${DATA_URL_2ND}`);
      }
    } catch (err2) {
      // The second-turn file is optional on first load. Once it is in use,
      // a failed refresh aborts the whole swap so the visible state is safe.
      if (state.has2nd) throw err2;
      console.warn("2º turno indisponível:", err2);
    }
    return { chart1st: data1, chart2nd: data2, has2nd: !!data2 };
  }

  function captureViewState() {
    return {
      showAll: state.showAll,
      visible: new Set(state.visible),
      institutesOn: new Set(state.institutesOn),
      allInstituteIds: new Set(state.allInstituteIds),
    };
  }

  function restoreViewState(view) {
    const allowedCandidates = new Set(candidatesForLegend().map((c) => c.id));
    if (view.visible.size) {
      state.visible = new Set([...view.visible].filter((id) => allowedCandidates.has(id)));
      if (!state.visible.size) applyDefaultVisibility();
    }
    const hadAllInstitutes =
      view.allInstituteIds.size > 0 &&
      view.institutesOn.size === view.allInstituteIds.size;
    if (!hadAllInstitutes && view.institutesOn.size) {
      const allowedInstitutes = new Set(state.allInstituteIds);
      state.institutesOn = new Set(
        [...view.institutesOn].filter((id) => allowedInstitutes.has(id))
      );
      if (!state.institutesOn.size) applyDefaultInstitutes();
    }
    syncShowAllBtn();
    buildLegend();
    buildInstituteFilters();
    syncFilterNote();
    redrawSeries();
    refreshExtras();
  }

  async function refreshData() {
    if (state.refreshing) return;
    state.refreshing = true;
    const view = captureViewState();
    if (el.refreshBtn) {
      el.refreshBtn.disabled = true;
      el.refreshBtn.textContent = "Verificando…";
    }
    setDataStatus("checking", "Verificando os arquivos de dados…");
    try {
      const bundle = await fetchChartBundle();
      // Do not mutate the live bundle until every requested file is valid.
      state.chart1st = bundle.chart1st;
      state.chart2nd = bundle.chart2nd;
      state.has2nd = bundle.has2nd;
      state.showAll = view.showAll;

      if (state.round === 2 && state.has2nd) {
        const scenarios = state.chart2nd.scenarios || [];
        if (!scenarios.some((b) => b.scenario === state.activeScenario)) {
          state.activeScenario = preferDefault2ndScenario();
        }
        renderChart(docFrom2nd(state.chart2nd, state.activeScenario));
      } else {
        state.round = 1;
        state.activeScenario = null;
        renderChart(state.chart1st);
      }
      restoreViewState(view);
      writeUrlState();
      markDataLoaded("refresh");
    } catch (error) {
      console.error("Verificar agora falhou:", error);
      markDataError(error);
      showToast("Não foi possível verificar agora. A vista atual foi mantida.");
    } finally {
      state.refreshing = false;
      if (el.refreshBtn) {
        el.refreshBtn.disabled = false;
        el.refreshBtn.textContent = "Verificar agora";
      }
    }
  }

  async function boot() {
    installFilterCollapsibles();
    try {
      const bundle = await fetchChartBundle();
      state.chart1st = bundle.chart1st;
      state.chart2nd = bundle.chart2nd;
      state.has2nd = bundle.has2nd;
      state.round = 1;

      if (el.round1) {
        el.round1.addEventListener("click", () => switchRound(1));
      }
      if (el.round2) {
        el.round2.addEventListener("click", () => switchRound(2));
      }
      if (el.rangeBtns) {
        el.rangeBtns.forEach((btn) => {
          btn.addEventListener("click", () => setRangeDays(btn.dataset.range));
        });
      }
      if (el.refreshBtn) {
        el.refreshBtn.addEventListener("click", refreshData);
      }
      if (el.shareBtn) {
        el.shareBtn.addEventListener("click", () => {
          shareView();
        });
      }

      const urlBits = readUrlState();
      state.skipUrlWrite = true;

      // Resolve 2º default / URL scenario before first paint
      if (state.has2nd) {
        const blocks = state.chart2nd.scenarios || [];
        const wanted = state.activeScenario;
        const ok = wanted && blocks.some((b) => b.scenario === wanted);
        if (!ok) state.activeScenario = preferDefault2ndScenario();
      }

      syncRoundControls();
      syncRangeControls();

      if (state.round === 2 && state.has2nd) {
        renderChart(docFrom2nd(state.chart2nd, state.activeScenario));
      } else {
        state.round = 1;
        renderChart(state.chart1st);
      }

      // Institutes from URL bitmask / list / solo (after institutes built by renderChart)
      applyInstitutesFromUrl(urlBits);
      if (state.showAll) {
        syncShowAllBtn();
        applyDefaultVisibility();
        buildLegend();
        redrawSeries();
        refreshExtras();
      }

      state.skipUrlWrite = false;
      writeUrlState();
      markDataLoaded("initial");
      applyTheme(currentTheme());
      if (el.themeBtn) {
        el.themeBtn.addEventListener("click", toggleTheme);
      }
      if (el.focusBtn) {
        el.focusBtn.addEventListener("click", focusChart);
      }
      installFullscreen();
      installPollsTableControls();
      installScrollTop();
      installKeyboardShortcuts();
      window.addEventListener("resize", debounce(onResize, 180));
      window.addEventListener("popstate", () => {
        state.skipUrlWrite = true;
        const bits = readUrlState();
        if (state.round === 2 && state.has2nd) {
          renderChart(docFrom2nd(state.chart2nd, state.activeScenario));
        } else {
          state.round = 1;
          renderChart(state.chart1st);
        }
        if (!applyInstitutesFromUrl(bits)) {
          refreshExtras();
        }
        state.skipUrlWrite = false;
      });
    } catch (err) {
      console.error(err);
      markDataError(err);
      if (el.placeholder) {
        el.placeholder.classList.remove("hidden");
        el.placeholder.innerHTML = `<p class="muted">Falha ao carregar <code>data/chart.json</code>: ${String(err.message || err)}</p>`;
      }
      el.headerMeta.innerHTML = '<span class="chip">erro de dados</span>';
    }
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
