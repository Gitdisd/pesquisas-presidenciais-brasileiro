/* PEBR Chart #2 — regional (UF) inspect shell (old Capítulo 2 geo job).
 * Loads chart-regional.json (Lead Option B when present) OR
 * canonical-points-regional.json (raw points only until Option B exists).
 * Never invents shares. No brush. Point-only hover. No multi-UF blended mean.
 * National companion (companion-chart.js) is a separate alternate-round panel. */
(function () {
  "use strict";

  const MARGIN = { top: 16, right: 16, bottom: 32, left: 44 };
  const POLL_HIT_PX2 = 14 * 14;
  const CHART_URL = "data/chart-regional.json";
  const CANONICAL_URL = "data/canonical-points-regional.json";
  const EMPTY_MSG = "Nenhuma pesquisa regional verificada ainda";

  const FALLBACK_COLORS = [
    "#5B8CFF",
    "#FF6B6B",
    "#4ECDC4",
    "#F7B731",
    "#A78BFA",
    "#34D399",
    "#FB7185",
    "#94A3B8",
  ];

  const el = {
    panel: document.getElementById("regional-panel"),
    svg: document.getElementById("regional-chart"),
    placeholder: document.getElementById("regional-placeholder"),
    heading: document.getElementById("regional-heading"),
    scenario: document.getElementById("regional-scenario"),
    legend: document.getElementById("regional-legend"),
    ufFilters: document.getElementById("regional-uf-filters"),
    status: document.getElementById("regional-status"),
    detail: document.getElementById("detail-body"),
    refreshBtn: document.getElementById("btn-refresh-data"),
  };

  if (!el.svg || typeof d3 === "undefined") return;

  const parseDate = d3.utcParse("%Y-%m-%d");
  const fmtPct = (v) =>
    (v * 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  const fmtDate = d3.utcFormat("%d/%m/%Y");

  let local = {
    source: null, // "chart" | "canonical"
    doc: null,
    payload: null,
    allPolls: [],
    candById: new Map(),
    instById: new Map(),
    ufsOn: new Set(), // empty = all
    availableUfs: [],
    x0: null,
    y0: null,
    xScale: null,
    yScale: null,
    dims: null,
    layers: {},
    zoomBehavior: null,
    zoomRect: null,
  };

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function colorFor(id, index) {
    const fromView = window.__pebrView?.chart1st?.candidates;
    if (Array.isArray(fromView)) {
      const hit = fromView.find((c) => c.id === id);
      if (hit?.color) return hit.color;
    }
    const fromDoc = local.candById.get(id);
    if (fromDoc?.color) return fromDoc.color;
    let h = 0;
    const s = String(id || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return FALLBACK_COLORS[(index != null ? index : h) % FALLBACK_COLORS.length];
  }

  function bust() {
    return "?t=" + Date.now();
  }

  async function fetchJson(url) {
    const res = await fetch(url + bust(), { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("HTTP " + res.status + " " + url);
    return res.json();
  }

  function expandCanonicalPoints(points) {
    const polls = [];
    const candIds = new Set();
    const instIds = new Set();
    const ufs = new Set();
    for (const p of points || []) {
      if (!p || p.geography !== "state") continue;
      const uf = (p.uf || "").toUpperCase();
      if (!uf) continue;
      const dateStr = p.fieldwork_mid || p.fieldwork_end || p.fieldwork_start;
      const date = parseDate(dateStr);
      if (!date) continue;
      ufs.add(uf);
      instIds.add(p.institute_id);
      const results = p.results || {};
      for (const [cid, value] of Object.entries(results)) {
        if (value == null || Number.isNaN(Number(value))) continue;
        candIds.add(cid);
        polls.push({
          series_kind: "poll",
          date: date,
          date_str: dateStr,
          candidate_id: cid,
          value: Number(value),
          institute_id: p.institute_id,
          poll_id: p.poll_id,
          n: p.sample_size,
          uf: uf,
          scenario: p.scenario,
        });
      }
    }
    const candList = [...candIds].sort().map((id, i) => ({
      id: id,
      label: id,
      color: colorFor(id, i),
    }));
    const instList = [...instIds].sort().map((id) => ({ id: id, label: id }));
    return {
      schema_version: "0.1.0",
      geography: "state",
      scenario: "stimulated_1st_round",
      model_id: null,
      unit: "fraction",
      election_cycle: 2026,
      note: "Raw canonical regional points (no Option B aggregate yet).",
      candidates: candList,
      institutes: instList,
      series: polls,
      _ufs: [...ufs].sort(),
      _source: "canonical",
    };
  }

  function prepareFromChartDoc(doc) {
    const polls = [];
    const aggregates = [];
    const uncertainty = [];
    const ufs = new Set();
    for (const row of doc.series || []) {
      const date = parseDate(row.date);
      if (!date) continue;
      const base = Object.assign({}, row, { date: date });
      if (row.uf) ufs.add(String(row.uf).toUpperCase());
      if (row.series_kind === "poll") polls.push(base);
      else if (row.series_kind === "aggregate") aggregates.push(base);
      else if (row.series_kind === "uncertainty") uncertainty.push(base);
    }
    return {
      doc: doc,
      polls: polls,
      aggregates: aggregates,
      uncertainty: uncertainty,
      ufs: [...ufs].sort(),
      source: "chart",
    };
  }

  function setEmptyState(msg) {
    local.doc = null;
    local.payload = null;
    local.allPolls = [];
    if (el.ufFilters) {
      el.ufFilters.innerHTML = "";
      el.ufFilters.hidden = true;
    }
    if (el.legend) el.legend.innerHTML = "";
    if (el.scenario) el.scenario.textContent = "Geografia: UF · aguardando dados";
    if (el.status) el.status.textContent = msg || EMPTY_MSG;
    d3.select(el.svg).selectAll("*").remove();
    if (el.placeholder) {
      el.placeholder.classList.remove("hidden");
      el.placeholder.innerHTML =
        '<p class="muted regional-empty">' + escapeHtml(msg || EMPTY_MSG) + "</p>";
    }
  }

  function visiblePolls() {
    const all = local.allPolls || [];
    if (!local.ufsOn.size || local.ufsOn.size === local.availableUfs.length) {
      return all;
    }
    return all.filter((d) => local.ufsOn.has(d.uf));
  }

  function selectedUfCount() {
    if (!local.availableUfs.length) return 0;
    if (!local.ufsOn.size || local.ufsOn.size === local.availableUfs.length) {
      return local.availableUfs.length;
    }
    return local.ufsOn.size;
  }

  /** Aggregate/ribbon only when Option B chart export exists AND ≤1 UF selected. */
  function mayShowAggregate() {
    if (local.source !== "chart") return false;
    return selectedUfCount() <= 1;
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

  function initScales(polls, dims) {
    const agg = mayShowAggregate() ? local.payload?.aggregates || [] : [];
    const unc = mayShowAggregate() ? local.payload?.uncertainty || [] : [];
    const allDates = []
      .concat(polls.map((d) => d.date))
      .concat(agg.map((d) => d.date))
      .concat(unc.map((d) => d.date));
    let xMin = d3.min(allDates);
    let xMax = d3.max(allDates);
    if (local.doc?.date_range) {
      const a = parseDate(local.doc.date_range.start);
      const b = parseDate(local.doc.date_range.end);
      if (a) xMin = a;
      if (b) xMax = b;
    }
    if (!xMin || !xMax) {
      const now = new Date();
      xMin = new Date(now.getTime() - 90 * 86400000);
      xMax = now;
    }
    const yVals = []
      .concat(polls.map((d) => d.value))
      .concat(agg.map((d) => d.value))
      .concat(unc.map((d) => d.band_low))
      .concat(unc.map((d) => d.band_high))
      .filter((v) => v != null && !Number.isNaN(v));
    const yMax = Math.min(1, Math.max(0.45, (d3.max(yVals) || 0.4) * 1.12));
    local.x0 = d3.scaleUtc().domain([xMin, xMax]).range([0, dims.innerW]);
    local.y0 = d3.scaleLinear().domain([0, yMax]).nice().range([dims.innerH, 0]);
    local.xScale = local.x0.copy();
    local.yScale = local.y0.copy();
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
    const polls = visiblePolls();
    const candidates = local.doc?.candidates || [];
    const showAgg = mayShowAggregate();
    const aggSrc = showAgg ? local.payload?.aggregates || [] : [];
    const uncSrc = showAgg ? local.payload?.uncertainty || [] : [];

    const area = d3
      .area()
      .x((d) => local.xScale(d.date))
      .y0((d) => local.yScale(d.band_low))
      .y1((d) => local.yScale(d.band_high))
      .curve(d3.curveMonotoneX);

    const ribbonData = showAgg
      ? candidates.map((c) => ({
          id: c.id,
          color: c.color || colorFor(c.id),
          values: uncSrc
            .filter((d) => d.candidate_id === c.id)
            .filter((d) => !d.uf || local.ufsOn.has(String(d.uf).toUpperCase()) || !local.ufsOn.size)
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
          color: c.color || colorFor(c.id),
          values: aggSrc
            .filter((d) => d.candidate_id === c.id)
            .filter((d) => !d.uf || local.ufsOn.has(String(d.uf).toUpperCase()) || !local.ufsOn.size)
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

    const pts = local.layers.points
      .selectAll("circle.poll-point")
      .data(polls, (d) => d.poll_id + ":" + d.candidate_id + ":" + (d.uf || ""));
    pts.exit().remove();
    pts
      .enter()
      .append("circle")
      .attr("class", "poll-point")
      .attr("r", 3.5)
      .merge(pts)
      .attr("cx", (d) => local.xScale(d.date))
      .attr("cy", (d) => local.yScale(d.value))
      .attr("fill", (d) => local.candById.get(d.candidate_id)?.color || colorFor(d.candidate_id));
  }

  function showDetail(d) {
    if (!el.detail) return;
    const cand = local.candById.get(d.candidate_id);
    const inst = local.instById.get(d.institute_id);
    const name = cand?.label || cand?.display_name || d.candidate_id;
    const instName = inst?.label || inst?.display_name || d.institute_id || "—";
    el.detail.innerHTML =
      "<p><strong>" +
      escapeHtml(name) +
      "</strong> · " +
      fmtPct(d.value) +
      "%</p>" +
      "<p class=\"muted small\">" +
      escapeHtml(instName) +
      (d.uf ? " · " + escapeHtml(d.uf) : "") +
      (d.n != null ? " · N=" + Number(d.n).toLocaleString("pt-BR") : "") +
      " · " +
      fmtDate(d.date) +
      "</p>" +
      "<p class=\"muted small\">Pesquisas regionais (UF)</p>";
  }

  function nearestPoll(mx, my) {
    const polls = visiblePolls();
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
        escapeHtml(c.color || colorFor(c.id)) +
        '"></i>' +
        escapeHtml(c.label || c.display_name || c.id);
      el.legend.appendChild(span);
    });
  }

  function renderUfChips() {
    if (!el.ufFilters) return;
    const ufs = local.availableUfs;
    if (!ufs.length) {
      el.ufFilters.innerHTML = "";
      el.ufFilters.hidden = true;
      return;
    }
    el.ufFilters.hidden = false;
    el.ufFilters.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "chip-btn all";
    allBtn.textContent = "Todas UFs";
    const allOn = !local.ufsOn.size || local.ufsOn.size === ufs.length;
    if (allOn) allBtn.classList.add("on");
    allBtn.addEventListener("click", () => {
      local.ufsOn = new Set(ufs);
      renderUfChips();
      redrawFromFilter();
    });
    el.ufFilters.appendChild(allBtn);
    ufs.forEach((uf) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-btn";
      btn.textContent = uf;
      btn.setAttribute("aria-pressed", local.ufsOn.has(uf) ? "true" : "false");
      if (local.ufsOn.has(uf)) btn.classList.add("on");
      btn.addEventListener("click", () => {
        if (local.ufsOn.has(uf) && local.ufsOn.size === 1) {
          // keep at least one? allow toggle to all
          local.ufsOn = new Set(ufs);
        } else if (local.ufsOn.has(uf)) {
          local.ufsOn.delete(uf);
          if (!local.ufsOn.size) local.ufsOn = new Set(ufs);
        } else {
          // if currently "all", solo this UF
          if (local.ufsOn.size === ufs.length) {
            local.ufsOn = new Set([uf]);
          } else {
            local.ufsOn.add(uf);
          }
        }
        renderUfChips();
        redrawFromFilter();
      });
      el.ufFilters.appendChild(btn);
    });
  }

  function redrawFromFilter() {
    if (!local.doc) return;
    const polls = visiblePolls();
    if (el.status) {
      const nPolls = new Set(polls.map((d) => d.poll_id)).size;
      const src =
        local.source === "chart"
          ? "chart-regional.json"
          : "canonical-points-regional.json (pontos brutos)";
      const aggNote = mayShowAggregate()
        ? " · agregado ≤1 UF"
        : local.source === "chart"
          ? " · sem média multi-UF"
          : " · sem agregado Option B";
      el.status.textContent =
        nPolls +
        " pesquisa(s) · " +
        selectedUfCount() +
        " UF(s) · " +
        src +
        aggNote;
    }
    const dims = local.dims || size();
    initScales(polls, dims);
    if (local.zoomRect && local.zoomBehavior) {
      local.zoomRect.call(local.zoomBehavior.transform, d3.zoomIdentity);
    }
    redrawSeries();
    drawAxes(dims);
  }

  function renderChart() {
    const polls = visiblePolls();
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

    const clipId = "pebr-regional-clip";
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("width", dims.innerW)
      .attr("height", dims.innerH);

    initScales(polls, dims);

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
  }

  function adoptDoc(doc, source, ufs) {
    local.source = source;
    local.doc = doc;
    local.candById = new Map(
      (doc.candidates || []).map((c, i) => [
        c.id,
        Object.assign({}, c, { color: c.color || colorFor(c.id, i) }),
      ])
    );
    local.instById = new Map((doc.institutes || []).map((i) => [i.id, i]));
    const prepared =
      source === "chart"
        ? prepareFromChartDoc(doc)
        : {
            polls: doc.series || [],
            aggregates: [],
            uncertainty: [],
            ufs: ufs || [],
          };
    local.payload = {
      polls: prepared.polls,
      aggregates: prepared.aggregates || [],
      uncertainty: prepared.uncertainty || [],
    };
    local.allPolls = prepared.polls;
    local.availableUfs = (prepared.ufs && prepared.ufs.length
      ? prepared.ufs
      : ufs || []
    ).slice();
    // Derive UFs from polls if chart series omitted uf on some rows
    if (!local.availableUfs.length) {
      local.availableUfs = [
        ...new Set(prepared.polls.map((d) => d.uf).filter(Boolean)),
      ].sort();
    }
    local.ufsOn = new Set(local.availableUfs);

    if (el.scenario) {
      const label =
        doc.scenario === "stimulated_1st_round"
          ? "Estimulada · 1º turno"
          : doc.scenario || "—";
      el.scenario.textContent =
        "Cenário: " + label + " · geografia UF (fora do Option B nacional)";
    }
    if (el.status) {
      const n = new Set(local.allPolls.map((d) => d.poll_id)).size;
      el.status.textContent =
        n +
        " pesquisa(s) regional(is) · fonte " +
        (source === "chart" ? "chart-regional.json" : "canonical-points-regional.json");
    }
    renderUfChips();
    renderLegend();
    renderChart();
  }

  async function load() {
    try {
      const chartDoc = await fetchJson(CHART_URL);
      const hasChartSeries =
        chartDoc &&
        Array.isArray(chartDoc.series) &&
        chartDoc.series.some((r) => r && r.series_kind === "poll");

      if (hasChartSeries) {
        adoptDoc(chartDoc, "chart", null);
        return;
      }

      const points = await fetchJson(CANONICAL_URL);
      const list = Array.isArray(points) ? points : [];
      if (!list.length) {
        setEmptyState(EMPTY_MSG);
        return;
      }
      const expanded = expandCanonicalPoints(list);
      if (!expanded.series.length) {
        setEmptyState(EMPTY_MSG);
        return;
      }
      adoptDoc(expanded, "canonical", expanded._ufs);
    } catch (err) {
      console.warn("regional-chart failed", err);
      setEmptyState(EMPTY_MSG);
    }
  }

  function boot() {
    setEmptyState("Carregando pesquisas regionais…");
    load();
    if (el.refreshBtn) {
      el.refreshBtn.addEventListener("click", () => {
        load();
      });
    }
    window.addEventListener(
      "resize",
      debounce(() => {
        if (local.doc) renderChart();
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
