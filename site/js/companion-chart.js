/* PEBR alternate-round companion — national Option B (1º ↔ primary Lula×Flávio).
 * Demoted under Chart #2 (regional/UF). NOT a port of old Capítulo 2 geo job.
 * Consumes window.__pebrView + pebr-view-change from chart.js (no independent refetch).
 * Stack: vanilla JS + D3 SVG. No brush, no multi-candidate scoreboard, no regional UF. */
(function () {
  "use strict";

  const MARGIN = { top: 16, right: 16, bottom: 32, left: 44 };
  const PRIMARY_2ND = "stimulated_2nd_round_flavio_bolsonaro_vs_lula";
  const POLL_HIT_PX2 = 14 * 14;

  const el = {
    panel: document.getElementById("companion-panel"),
    svg: document.getElementById("companion-chart"),
    placeholder: document.getElementById("companion-placeholder"),
    heading: document.getElementById("companion-heading"),
    scenario: document.getElementById("companion-scenario"),
    legend: document.getElementById("companion-legend"),
    detail: document.getElementById("detail-body"),
  };

  if (!el.svg || typeof d3 === "undefined") return;

  const parseDate = d3.utcParse("%Y-%m-%d");
  const fmtPct = (v) =>
    (v * 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  const fmtDate = d3.utcFormat("%d/%m/%Y");

  const candCfg =
    (typeof window !== "undefined" && window.PEBR_CANDIDATES_CONFIG) || {
      displayNameFor: (c) => (c && (c.label || c.display_name || c.id)) || "—",
    };

  function candidateDisplayName(candidate) {
    if (candCfg && typeof candCfg.displayNameFor === "function") {
      return candCfg.displayNameFor(candidate);
    }
    return (candidate && (candidate.label || candidate.display_name || candidate.id)) || "—";
  }

  function normalizeCandidateText(text) {
    return String(text || "")
      .replace(/\bflavio_bolsonaro\b/gi, "Flávio Bolsonaro")
      .replace(/\bflavio\s+bolsonaro\b/gi, "Flávio Bolsonaro");
  }

  let local = {
    doc: null,
    payload: null,
    candById: new Map(),
    instById: new Map(),
    institutesOn: new Set(),
    rangeDays: null,
    x0: null,
    y0: null,
    xScale: null,
    yScale: null,
    dims: null,
    layers: {},
    zoomBehavior: null,
    zoomRect: null,
    clientAgg: null,
    clientAggKey: null,
  };

  function docFrom2nd(multi, scenarioId) {
    const blocks = multi?.scenarios || [];
    if (!blocks.length) return null;
    const primary =
      blocks.find((b) => b.scenario === scenarioId) ||
      blocks.find((b) => /flavio_bolsonaro_vs_lula/.test(b.scenario || "")) ||
      blocks[0];
    if (!primary) return null;
    return {
      schema_version: multi.schema_version,
      model_id: multi.model_id,
      unit: multi.unit,
      params: multi.params,
      band_meaning: multi.band_meaning,
      election_cycle: multi.election_cycle,
      geography: multi.geography,
      scenario: primary.scenario,
      matchup_label: primary.label || primary.scenario,
      example: multi.example,
      note: multi.note,
      candidates: primary.candidates,
      institutes: primary.institutes,
      generated_at: multi.generated_at,
      date_range: primary.date_range,
      series: primary.series,
    };
  }

  function resolveCompanionDoc(view) {
    if (!view) return null;
    // Main on 1º → companion shows primary 2º; main on 2º → companion shows 1º.
    if (view.round === 2) {
      return view.chart1st || null;
    }
    if (!view.chart2nd) return null;
    return docFrom2nd(view.chart2nd, PRIMARY_2ND);
  }

  function prepareSeries(raw) {
    const polls = [];
    const aggregates = [];
    const uncertainty = [];
    for (const row of raw.series || []) {
      const date = parseDate(row.date);
      if (!date) continue;
      const base = Object.assign({}, row, { date: date });
      if (row.series_kind === "poll") polls.push(base);
      else if (row.series_kind === "aggregate") aggregates.push(base);
      else if (row.series_kind === "uncertainty") uncertainty.push(base);
    }
    return { polls: polls, aggregates: aggregates, uncertainty: uncertainty };
  }

  function institutesAllOn() {
    if (!local.institutesOn.size) return true;
    const all = (local.doc?.institutes || []).map((i) => i.id);
    if (!all.length) return true;
    return all.every((id) => local.institutesOn.has(id));
  }

  function syncInstitutesFromView(view) {
    const ids = (local.doc?.institutes || []).map((i) => i.id);
    if (!ids.length) {
      local.institutesOn = new Set();
      return;
    }
    const src = view.institutesOn;
    if (!src || !src.size) {
      local.institutesOn = new Set(ids);
      return;
    }
    // Intersect with companion's institute list (ids are shared slugs).
    const next = new Set([...src].filter((id) => ids.includes(id)));
    local.institutesOn = next.size ? next : new Set(ids);
  }

  function size() {
    const rect = el.svg.getBoundingClientRect();
    const width = Math.max(280, rect.width || el.svg.parentElement?.clientWidth || 640);
    const height = Math.max(220, rect.height || 260);
    return {
      width: width,
      height: height,
      innerW: width - MARGIN.left - MARGIN.right,
      innerH: height - MARGIN.top - MARGIN.bottom,
    };
  }

  function initScales(payload, dims) {
    const allDates = []
      .concat(payload.polls.map((d) => d.date))
      .concat(payload.aggregates.map((d) => d.date))
      .concat(payload.uncertainty.map((d) => d.date));
    let xMin = d3.min(allDates);
    let xMax = d3.max(allDates);
    if (local.doc?.date_range) {
      const a = parseDate(local.doc.date_range.start);
      const b = parseDate(local.doc.date_range.end);
      if (a) xMin = a;
      if (b) xMax = b;
    }
    if (local.rangeDays && xMax) {
      const cut = new Date(xMax.getTime() - local.rangeDays * 86400000);
      if (xMin == null || cut > xMin) xMin = cut;
    }
    const yVals = []
      .concat(payload.polls.map((d) => d.value))
      .concat(payload.aggregates.map((d) => d.value))
      .concat(payload.uncertainty.map((d) => d.band_low))
      .concat(payload.uncertainty.map((d) => d.band_high))
      .filter((v) => v != null && !Number.isNaN(v));
    const yMax = Math.min(1, Math.max(0.45, (d3.max(yVals) || 0.4) * 1.12));
    local.x0 = d3.scaleUtc().domain([xMin, xMax]).range([0, dims.innerW]);
    local.y0 = d3.scaleLinear().domain([0, yMax]).nice().range([dims.innerH, 0]);
    local.xScale = local.x0.copy();
    local.yScale = local.y0.copy();
  }

  function ensureClientOptionB() {
    if (institutesAllOn()) {
      local.clientAgg = null;
      local.clientAggKey = null;
      return null;
    }
    const api = window.PEBR_OPTION_B;
    if (!api || typeof api.aggregateFromFlatPolls !== "function") return null;
    const key =
      (local.doc?.scenario || "") +
      "|" +
      [...local.institutesOn].sort().join(",");
    if (local.clientAgg && local.clientAggKey === key) return local.clientAgg;
    const polls = (local.payload?.polls || []).filter((d) =>
      local.institutesOn.has(d.institute_id)
    );
    const params = Object.assign({}, api.DEFAULTS, local.doc?.params || {});
    const candIds = (local.doc?.candidates || []).map((c) => c.id);
    const result = api.aggregateFromFlatPolls(polls, params, candIds);
    local.clientAgg = result;
    local.clientAggKey = key;
    return result;
  }

  function drawAxes(dims) {
    local.layers.xAxis.call(
      d3
        .axisBottom(local.xScale)
        .ticks(Math.min(6, Math.floor(dims.innerW / 90)))
        .tickFormat(d3.utcFormat("%d/%m"))
    );
    local.layers.yAxis.call(
      d3
        .axisLeft(local.yScale)
        .ticks(5)
        .tickFormat((d) => (d * 100).toFixed(0))
    );
    local.layers.xGrid.call(
      d3
        .axisBottom(local.xScale)
        .ticks(Math.min(6, Math.floor(dims.innerW / 90)))
        .tickSize(-dims.innerH)
        .tickFormat("")
    );
    local.layers.yGrid.call(
      d3.axisLeft(local.yScale).ticks(5).tickSize(-dims.innerW).tickFormat("")
    );
  }

  function redrawSeries() {
    const payload = local.payload;
    if (!payload) return;
    const candidates = local.doc.candidates || [];
    const usePipeline = institutesAllOn();
    const client = usePipeline ? null : ensureClientOptionB();
    const aggSrc = usePipeline ? payload.aggregates : client ? client.aggregates : [];
    const uncSrc = usePipeline ? payload.uncertainty : client ? client.uncertainty : [];
    const showAgg = usePipeline || (client && client.aggregates.length > 0);

    const area = d3
      .area()
      .x((d) => local.xScale(d.date))
      .y0((d) => local.yScale(d.band_low))
      .y1((d) => local.yScale(d.band_high))
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

    const ribbons = local.layers.ribbons
      .selectAll("path.unc-ribbon")
      .data(ribbonData, (d) => d.id);
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
      .x((d) => local.xScale(d.date))
      .y((d) => local.yScale(d.value))
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

    const lines = local.layers.lines
      .selectAll("path.agg-line")
      .data(lineData, (d) => d.id);
    lines.exit().remove();
    lines
      .enter()
      .append("path")
      .attr("class", "agg-line")
      .merge(lines)
      .attr("stroke", (d) => d.color)
      .attr("d", (d) => (d.values.length ? line(d.values) : null));

    const visPolls = payload.polls.filter((d) =>
      institutesAllOn() ? true : local.institutesOn.has(d.institute_id)
    );
    const pts = local.layers.points
      .selectAll("circle.poll-point")
      .data(visPolls, (d) => d.poll_id + ":" + d.candidate_id);
    pts.exit().remove();
    pts
      .enter()
      .append("circle")
      .attr("class", "poll-point")
      .attr("r", 3.5)
      .merge(pts)
      .attr("cx", (d) => local.xScale(d.date))
      .attr("cy", (d) => local.yScale(d.value))
      .attr("fill", (d) => local.candById.get(d.candidate_id)?.color || "#94a3b8");
  }

  function showDetail(d) {
    if (!el.detail) return;
    const cand = local.candById.get(d.candidate_id);
    const inst = local.instById.get(d.institute_id);
    const name = candidateDisplayName(cand || { id: d.candidate_id });
    const instName = inst?.label || inst?.display_name || d.institute_id || "—";
    el.detail.innerHTML =
      "<p><strong>" +
      escapeHtml(name) +
      "</strong> · " +
      fmtPct(d.value) +
      "%</p>" +
      "<p class=\"muted small\">" +
      escapeHtml(instName) +
      (d.n != null ? " · N=" + Number(d.n).toLocaleString("pt-BR") : "") +
      " · " +
      fmtDate(d.date) +
      "</p>" +
      "<p class=\"muted small\">Companheiro · " +
      escapeHtml(local.doc?.matchup_label || local.doc?.scenario || "") +
      "</p>";
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nearestPoll(mx, my) {
    const polls = (local.payload?.polls || []).filter((d) =>
      institutesAllOn() ? true : local.institutesOn.has(d.institute_id)
    );
    let best = null;
    let bestDist = Infinity;
    for (const d of polls) {
      const dx = local.xScale(d.date) - mx;
      const dy = local.yScale(d.value) - my;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    if (best && bestDist <= POLL_HIT_PX2) return best;
    return null;
  }

  function applyTimeZoom(transform) {
    local.xScale = transform.rescaleX(local.x0);
    local.yScale = local.y0.copy();
    const dims = local.dims || size();
    redrawSeries();
    drawAxes(dims);
  }

  function renderLegend() {
    if (!el.legend) return;
    el.legend.innerHTML = "";
    (local.doc?.candidates || []).forEach((c) => {
      const span = document.createElement("span");
      span.innerHTML =
        '<i class="cand-swatch" style="background:' +
        escapeHtml(c.color || "#888") +
        '"></i>' +
        escapeHtml(candidateDisplayName(c));
      el.legend.appendChild(span);
    });
  }

  function setLabels(view) {
    const doc = local.doc;
    if (!doc) return;
    const is2ndCompanion = view.round !== 2;
    if (el.heading) {
      el.heading.textContent = is2ndCompanion
        ? "Companheiro — 2º turno (Lula × Flávio)"
        : "Companheiro — 1º turno nacional";
    }
    if (el.scenario) {
      const label =
        doc.matchup_label ||
        (doc.scenario === "stimulated_1st_round"
          ? "Estimulada · 1º turno"
          : doc.scenario);
      el.scenario.textContent =
        "Cenário: " + normalizeCandidateText(label) + " · Option B";
    }
  }

  function render(doc, view) {
    local.doc = doc;
    local.rangeDays = view.rangeDays == null ? null : view.rangeDays;
    local.candById = new Map((doc.candidates || []).map((c) => [c.id, c]));
    local.instById = new Map((doc.institutes || []).map((i) => [i.id, i]));
    local.payload = prepareSeries(doc);
    local.clientAgg = null;
    local.clientAggKey = null;
    syncInstitutesFromView(view);
    setLabels(view);
    renderLegend();

    const dims = size();
    local.dims = dims;
    const svg = d3.select(el.svg);
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", "0 0 " + dims.width + " " + dims.height)
      .attr("width", "100%")
      .attr("height", dims.height);

    const root = svg
      .append("g")
      .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

    const clipId = "pebr-companion-clip";
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("width", dims.innerW)
      .attr("height", dims.innerH);

    initScales(local.payload, dims);

    local.layers.xGrid = root
      .append("g")
      .attr("class", "grid grid-x")
      .attr("transform", "translate(0," + dims.innerH + ")");
    local.layers.yGrid = root.append("g").attr("class", "grid grid-y");
    local.layers.xAxis = root
      .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", "translate(0," + dims.innerH + ")");
    local.layers.yAxis = root.append("g").attr("class", "axis axis-y");

    const plot = root.append("g").attr("clip-path", "url(#" + clipId + ")");
    local.layers.ribbons = plot.append("g").attr("class", "ribbons");
    local.layers.lines = plot.append("g").attr("class", "lines");
    local.layers.points = plot.append("g").attr("class", "points");

    const zoomRect = plot
      .append("rect")
      .attr("class", "zoom-rect")
      .attr("width", dims.innerW)
      .attr("height", dims.innerH)
      .attr("fill", "transparent")
      .style("cursor", "grab")
      .attr("aria-hidden", "true");
    local.zoomRect = zoomRect;

    local.zoomBehavior = d3
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
      .filter((event) => {
        if (event.type === "wheel") return !event.ctrlKey;
        if (event.button && event.button !== 0) return false;
        return true;
      })
      .on("zoom", (event) => applyTimeZoom(event.transform));

    zoomRect.call(local.zoomBehavior);
    zoomRect.on("dblclick.zoom", null);
    zoomRect.on("dblclick.reset", (event) => {
      event.preventDefault();
      zoomRect
        .transition()
        .duration(240)
        .call(local.zoomBehavior.transform, d3.zoomIdentity);
    });

    zoomRect.on("mousemove", function (event) {
      const [mx, my] = d3.pointer(event, this);
      const hit = nearestPoll(mx, my);
      if (hit) showDetail(hit);
    });

    drawAxes(dims);
    redrawSeries();

    if (el.placeholder) el.placeholder.classList.add("hidden");
    if (el.panel) el.panel.hidden = false;
  }

  function hide(reason) {
    if (el.panel) el.panel.hidden = true;
    if (el.placeholder) {
      el.placeholder.classList.remove("hidden");
      el.placeholder.innerHTML =
        '<p class="muted">' + escapeHtml(reason || "Companheiro indisponível.") + "</p>";
    }
  }

  function onView(view) {
    if (!view || !view.chart1st) {
      hide("Aguardando chart.json…");
      return;
    }
    const doc = resolveCompanionDoc(view);
    if (!doc || !Array.isArray(doc.series) || !doc.series.length) {
      hide(
        view.round === 2
          ? "Série de 1º turno indisponível para o companheiro."
          : "Série de 2º turno (Lula × Flávio) indisponível para o companheiro."
      );
      return;
    }
    try {
      render(doc, view);
    } catch (err) {
      console.warn("companion-chart failed", err);
      hide("Falha ao montar o gráfico companheiro.");
    }
  }

  function boot() {
    if (window.__pebrView) onView(window.__pebrView);
    document.addEventListener("pebr-view-change", (ev) => {
      onView(ev.detail || window.__pebrView);
    });
    window.addEventListener(
      "resize",
      debounce(() => {
        if (window.__pebrView && local.doc) onView(window.__pebrView);
      }, 180)
    );
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
