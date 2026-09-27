/* PEBR Research UI — D3@7 chart (vanilla JS, no bundler).
 * Consumes data/chart.json (1º) and data/chart-2nd-round.json (2º pairwise scenarios[]).
 * series_kind poll | aggregate | uncertainty. Data unit: fraction 0–1; display ×100 (pp).
 * Hover: single poll point only (no multi-candidate scoreboard). Zoom/pan kept; no range slider.
 * Filters: round switch, 2º matchup chips, institute chips; Option B methodology chips. */
(function () {
  "use strict";

  const DATA_URL_1ST = "data/chart.json";
  const DATA_URL_2ND = "data/chart-2nd-round.json";
  const MARGIN = { top: 24, right: 20, bottom: 40, left: 48 };
  const POLL_HIT_PX2 = 16 * 16;
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
    resetBtn: document.getElementById("btn-reset-zoom"),
    showAllBtn: document.getElementById("btn-show-all"),
    exampleBanner: document.querySelector(".example-banner"),
    instituteFilters: document.getElementById("institute-filters"),
    methodChips: document.getElementById("method-chips"),
    methodDisclaimer: document.getElementById("method-disclaimer"),
    filterNote: document.getElementById("filter-note"),
    geoChip: document.getElementById("geo-chip"),
    round1: document.getElementById("round-1"),
    round2: document.getElementById("round-2"),
    matchupRow: document.getElementById("matchup-row"),
    matchupFilters: document.getElementById("matchup-filters"),
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
    zoomBehavior: null,
    layers: {},
    round: 1,
    chart1st: null,
    chart2nd: null,
    activeScenario: null,
    has2nd: false,
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
    syncRoundControls();
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

  function buildMatchupFilters() {
    if (!el.matchupFilters || !state.chart2nd) return;
    const blocks = state.chart2nd.scenarios || [];
    el.matchupFilters.innerHTML = "";
    blocks.forEach((block) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "chip-btn" + (state.activeScenario === block.scenario ? " on" : "");
      btn.textContent = block.label || scenarioDisplayLabel({ scenario: block.scenario });
      btn.dataset.scenario = block.scenario;
      btn.title = block.scenario;
      btn.addEventListener("click", () => {
        if (state.activeScenario === block.scenario) return;
        state.activeScenario = block.scenario;
        const doc = docFrom2nd(state.chart2nd, state.activeScenario);
        renderChart(doc);
      });
      el.matchupFilters.appendChild(btn);
    });
  }

  async function switchRound(round) {
    if (round === state.round) return;
    if (round === 2 && !state.has2nd) return;
    state.round = round;
    state.showAll = false;
    if (round === 1) {
      state.activeScenario = null;
      renderChart(state.chart1st);
    } else {
      if (!state.activeScenario && state.chart2nd?.scenarios?.length) {
        state.activeScenario = state.chart2nd.scenarios[0].scenario;
      }
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
      .map((c) => `<span class="chip-btn method">${c.html}</span>`)
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
    const name = cand?.label || d.candidate_id || "—";
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
    el.filterNote.textContent =
      "Filtro de institutos ativo: pontos filtrados. Linha/faixa Option B ocultas (agregado pré-computado usa todos os institutos — selecione Todos para ver).";
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
    allBtn.addEventListener("click", () => {
      state.institutesOn = new Set(state.allInstituteIds);
      buildInstituteFilters();
      syncFilterNote();
      redrawSeries();
      clearHover();
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
      btn.className = "chip-btn" + (state.institutesOn.has(id) ? " on" : "");
      btn.textContent = prettyInstituteLabel(inst);
      btn.dataset.instituteId = id;
      btn.addEventListener("click", () => {
        if (state.institutesOn.has(id)) {
          if (state.institutesOn.size <= 1) return;
          state.institutesOn.delete(id);
        } else {
          state.institutesOn.add(id);
        }
        buildInstituteFilters();
        syncFilterNote();
        redrawSeries();
        clearHover();
      });
      el.instituteFilters.appendChild(btn);
    });
  }

  function buildLegend() {
    el.legend.innerHTML = "";
    const candidates = candidatesForLegend();
    candidates.forEach((c) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "legend-item" + (state.visible.has(c.id) ? "" : " off");
      item.dataset.candidateId = c.id;
      if (!isActive(c)) item.classList.add("is-inactive");
      item.innerHTML = `<span class="legend-swatch" style="background:${c.color}"></span>${c.label}`;
      item.addEventListener("click", () => {
        if (state.visible.has(c.id)) {
          if (state.visible.size <= 1) return;
          state.visible.delete(c.id);
          item.classList.add("off");
        } else {
          state.visible.add(c.id);
          item.classList.remove("off");
        }
        redrawSeries();
      });
      el.legend.appendChild(item);
    });
  }

  function size() {
    const rect = el.svg.getBoundingClientRect();
    const width = Math.max(320, rect.width || el.svg.parentElement.clientWidth || 640);
    const height = Math.max(360, rect.height || 480);
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

  function renderChart(data) {
    state.data = data;
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

    // Zoom/pan surface only — no bottom brush / range slider
    const zoomRect = plot
      .append("rect")
      .attr("class", "zoom-rect")
      .attr("width", dims.innerW)
      .attr("height", dims.innerH)
      .attr("fill", "transparent")
      .style("cursor", "grab");

    state.zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 24])
      .extent([
        [0, 0],
        [dims.innerW, dims.innerH],
      ])
      .translateExtent([
        [0, 0],
        [dims.innerW, dims.innerH],
      ])
      .on("zoom", (event) => {
        const t = event.transform;
        state.xScale = t.rescaleX(state.x0);
        state.yScale = t.rescaleY(state.y0);
        redrawSeries();
        drawAxes(dims);
      });

    zoomRect.call(state.zoomBehavior);
    zoomRect
      .on("dblclick.zoom", null)
      .on("pointerdown", () => zoomRect.style("cursor", "grabbing"))
      .on("pointerup pointerleave", () => zoomRect.style("cursor", "grab"));

    // Single nearest poll point only — never a multi-candidate ranking overlay
    zoomRect.on("mousemove", function (event) {
      const [mx, my] = d3.pointer(event, this);
      const hit = nearestVisiblePoll(mx, my, payload.polls);
      if (hit) highlightPoll(hit);
      else clearHover();
    });

    zoomRect.on("mouseleave", clearHover);

    el.resetBtn.onclick = () => {
      zoomRect.transition().duration(250).call(state.zoomBehavior.transform, d3.zoomIdentity);
    };

    if (el.showAllBtn) {
      el.showAllBtn.onclick = () => {
        state.showAll = !state.showAll;
        applyDefaultVisibility();
        syncShowAllBtn();
        buildLegend();
        redrawSeries();
        clearHover();
      };
    }

    drawAxes(dims);
    redrawSeries();

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

  function redrawSeries() {
    const { polls, aggregates, uncertainty } = state.payload;
    const candidates = (state.data.candidates || []).filter((c) => state.visible.has(c.id));
    const showAgg = institutesAllOn();

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
          values: uncertainty
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
          values: aggregates
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
  }

  async function boot() {
    try {
      const res1 = await fetch(DATA_URL_1ST, { cache: "no-cache" });
      if (!res1.ok) throw new Error(`HTTP ${res1.status} ao carregar ${DATA_URL_1ST}`);
      const data1 = await res1.json();
      if (!data1 || !Array.isArray(data1.series)) {
        throw new Error("chart.json sem series[]");
      }
      state.chart1st = data1;
      state.round = 1;

      try {
        const res2 = await fetch(DATA_URL_2ND, { cache: "no-cache" });
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2 && Array.isArray(data2.scenarios) && data2.scenarios.length) {
            state.chart2nd = data2;
            state.has2nd = true;
            state.activeScenario = data2.scenarios[0].scenario;
          }
        }
      } catch (err2) {
        console.warn("2º turno indisponível:", err2);
        state.has2nd = false;
      }

      if (el.round1) {
        el.round1.addEventListener("click", () => switchRound(1));
      }
      if (el.round2) {
        el.round2.addEventListener("click", () => switchRound(2));
      }

      syncRoundControls();
      renderChart(state.chart1st);
      window.addEventListener("resize", debounce(onResize, 180));
    } catch (err) {
      console.error(err);
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
