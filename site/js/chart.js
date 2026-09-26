/* PEBR Research UI — D3@7 chart (vanilla JS, no bundler).
 * Consumes data/chart.json: series_kind poll | aggregate | uncertainty.
 * Data unit: fraction 0–1; display ×100 (pp). EXAMPLE series labeled in HTML. */
(function () {
  "use strict";

  const DATA_URL = "data/chart.json";
  const MARGIN = { top: 24, right: 20, bottom: 40, left: 48 };
  const SCENARIO_LABELS = {
    stimulated_1st_round: "Estimulada · 1º turno",
    spontaneous_1st_round: "Espontânea · 1º turno",
    stimulated_2nd_round: "Estimulada · 2º turno",
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
  };

  let state = {
    data: null,
    candById: new Map(),
    instById: new Map(),
    visible: new Set(),
    xScale: null,
    yScale: null,
    x0: null,
    y0: null,
    zoomBehavior: null,
    layers: {},
  };

  function pctDisplay(frac) {
    if (frac == null || Number.isNaN(frac)) return "—";
    return fmtPct(frac) + " pp";
  }

  function setHeader(meta) {
    const chips = [];
    if (meta.example) {
      chips.push('<span class="chip accent">EXAMPLE</span>');
    }
    chips.push(`<span class="chip">ciclo ${meta.election_cycle || "—"}</span>`);
    chips.push(`<span class="chip">${meta.geography === "national" ? "nacional" : meta.geography || "—"}</span>`);
    chips.push(`<span class="chip">${meta.model_id || "modelo"}</span>`);
    if (meta.generated_at) {
      const d = new Date(meta.generated_at);
      chips.push(
        `<span class="chip">gerado ${d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</span>`
      );
    }
    el.headerMeta.innerHTML = chips.join("");
    const scen = SCENARIO_LABELS[meta.scenario] || meta.scenario || "—";
    el.scenario.textContent = `Cenário: ${scen}`;
  }

  function clearDetail() {
    el.detail.innerHTML =
      '<p class="muted">Passe o mouse sobre um ponto de pesquisa ou a linha agregada.</p>';
  }

  function showPollDetail(d, cand, inst) {
    el.detail.innerHTML = `
      <p class="cand-name" style="color:${cand.color}">${cand.label}</p>
      <p class="value-big">${pctDisplay(d.value)}</p>
      <dl>
        <dt>Data</dt><dd>${fmtDate(d.date)}</dd>
        <dt>Instituto</dt><dd>${inst ? inst.label : d.institute_id || "—"}</dd>
        <dt>N</dt><dd>${d.n != null ? d.n.toLocaleString("pt-BR") : "—"}</dd>
        <dt>poll_id</dt><dd><code>${d.poll_id || "—"}</code></dd>
        <dt>Tipo</dt><dd>pesquisa (ponto)</dd>
      </dl>`;
  }

  function showAggDetail(d, cand) {
    el.detail.innerHTML = `
      <p class="cand-name" style="color:${cand.color}">${cand.label}</p>
      <p class="value-big">${pctDisplay(d.value)}</p>
      <dl>
        <dt>Data</dt><dd>${fmtDate(d.date)}</dd>
        <dt>Tipo</dt><dd>agregado Option B</dd>
        <dt>Nota</dt><dd>média ponderada √N · janela ~14d</dd>
      </dl>`;
  }

  function buildLegend(candidates) {
    el.legend.innerHTML = "";
    candidates.forEach((c) => {
      state.visible.add(c.id);
      const item = document.createElement("button");
      item.type = "button";
      item.className = "legend-item";
      item.dataset.candidateId = c.id;
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
    return { width, height, innerW: width - MARGIN.left - MARGIN.right, innerH: height - MARGIN.top - MARGIN.bottom };
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

  function renderChart(data) {
    state.data = data;
    state.candById = new Map(data.candidates.map((c) => [c.id, c]));
    state.instById = new Map((data.institutes || []).map((i) => [i.id, i]));
    setHeader(data);
    buildLegend(data.candidates);

    const payload = prepareSeries(data);
    state.payload = payload;

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

    // grid + axes (under plot)
    state.layers.xGrid = root.append("g").attr("class", "grid grid-x").attr("transform", `translate(0,${dims.innerH})`);
    state.layers.yGrid = root.append("g").attr("class", "grid grid-y");
    state.layers.xAxis = root.append("g").attr("class", "axis axis-x").attr("transform", `translate(0,${dims.innerH})`);
    state.layers.yAxis = root.append("g").attr("class", "axis axis-y");

    const plot = root.append("g").attr("clip-path", `url(#${clipId})`);
    state.layers.ribbons = plot.append("g").attr("class", "ribbons");
    state.layers.lines = plot.append("g").attr("class", "lines");
    state.layers.points = plot.append("g").attr("class", "points");

    // hover helpers
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

    // y-axis label
    root
      .append("text")
      .attr("x", -dims.innerH / 2)
      .attr("y", -36)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", 11)
      .text("Intenção de voto (pp)");

    // zoom surface
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

    // nearest-point hover on move over plot
    zoomRect.on("mousemove", function (event) {
      const [mx, my] = d3.pointer(event, this);
      const visiblePolls = payload.polls.filter((d) => state.visible.has(d.candidate_id));
      if (!visiblePolls.length) return;
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
      // also consider aggregate lines if closer in x
      let bestAgg = null;
      let bestAggDx = Infinity;
      for (const cid of state.visible) {
        const pts = payload.aggregates.filter((d) => d.candidate_id === cid);
        if (!pts.length) continue;
        const bisect = d3.bisector((d) => d.date).left;
        const xDate = state.xScale.invert(mx);
        const i = Math.min(pts.length - 1, Math.max(0, bisect(pts, xDate)));
        const candidates = [pts[i], pts[i - 1], pts[i + 1]].filter(Boolean);
        for (const p of candidates) {
          const dx = Math.abs(state.xScale(p.date) - mx);
          if (dx < bestAggDx) {
            bestAggDx = dx;
            bestAgg = p;
          }
        }
      }

      const pollHit = best && bestDist < 18 * 18;
      if (pollHit) {
        const cand = state.candById.get(best.candidate_id);
        const inst = state.instById.get(best.institute_id);
        showPollDetail(best, cand, inst);
        state.layers.crosshair
          .attr("x1", state.xScale(best.date))
          .attr("x2", state.xScale(best.date))
          .style("opacity", 1);
        state.layers.focus
          .attr("cx", state.xScale(best.date))
          .attr("cy", state.yScale(best.value))
          .attr("stroke", cand.color)
          .style("opacity", 1);
        state.layers.points.selectAll(".poll-point").classed("is-active", (d) => d === best);
      } else if (bestAgg && bestAggDx < 40) {
        const cand = state.candById.get(bestAgg.candidate_id);
        showAggDetail(bestAgg, cand);
        state.layers.crosshair
          .attr("x1", state.xScale(bestAgg.date))
          .attr("x2", state.xScale(bestAgg.date))
          .style("opacity", 1);
        state.layers.focus
          .attr("cx", state.xScale(bestAgg.date))
          .attr("cy", state.yScale(bestAgg.value))
          .attr("stroke", cand.color)
          .style("opacity", 1);
        state.layers.points.selectAll(".poll-point").classed("is-active", false);
      }
    });

    zoomRect.on("mouseleave", () => {
      state.layers.crosshair.style("opacity", 0);
      state.layers.focus.style("opacity", 0);
      state.layers.points.selectAll(".poll-point").classed("is-active", false);
      clearDetail();
    });

    el.resetBtn.onclick = () => {
      zoomRect.transition().duration(250).call(state.zoomBehavior.transform, d3.zoomIdentity);
    };

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
    const candidates = state.data.candidates.filter((c) => state.visible.has(c.id));

    // uncertainty ribbons (area between band_low and band_high)
    const area = d3
      .area()
      .x((d) => state.xScale(d.date))
      .y0((d) => state.yScale(d.band_low))
      .y1((d) => state.yScale(d.band_high))
      .curve(d3.curveMonotoneX);

    const ribbonData = candidates.map((c) => ({
      id: c.id,
      color: c.color,
      values: uncertainty
        .filter((d) => d.candidate_id === c.id)
        .sort((a, b) => a.date - b.date),
    }));

    const ribbons = state.layers.ribbons.selectAll("path.unc-ribbon").data(ribbonData, (d) => d.id);
    ribbons.exit().remove();
    ribbons
      .enter()
      .append("path")
      .attr("class", "unc-ribbon")
      .merge(ribbons)
      .attr("fill", (d) => d.color)
      .attr("d", (d) => (d.values.length ? area(d.values) : null));

    // aggregate lines
    const line = d3
      .line()
      .x((d) => state.xScale(d.date))
      .y((d) => state.yScale(d.value))
      .curve(d3.curveMonotoneX)
      .defined((d) => d.value != null);

    const lineData = candidates.map((c) => ({
      id: c.id,
      color: c.color,
      values: aggregates
        .filter((d) => d.candidate_id === c.id)
        .sort((a, b) => a.date - b.date),
    }));

    const lines = state.layers.lines.selectAll("path.agg-line").data(lineData, (d) => d.id);
    lines.exit().remove();
    lines
      .enter()
      .append("path")
      .attr("class", "agg-line")
      .merge(lines)
      .attr("stroke", (d) => d.color)
      .attr("d", (d) => (d.values.length ? line(d.values) : null));

    // poll scatter
    const visPolls = polls.filter((d) => state.visible.has(d.candidate_id));
    const pts = state.layers.points.selectAll("circle.poll-point").data(visPolls, (d) => d.poll_id + ":" + d.candidate_id);
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
        const cand = state.candById.get(d.candidate_id);
        const inst = state.instById.get(d.institute_id);
        showPollDetail(d, cand, inst);
        d3.select(this).attr("r", 6).classed("is-active", true);
        state.layers.crosshair
          .attr("x1", state.xScale(d.date))
          .attr("x2", state.xScale(d.date))
          .style("opacity", 1);
        state.layers.focus
          .attr("cx", state.xScale(d.date))
          .attr("cy", state.yScale(d.value))
          .attr("stroke", cand.color)
          .style("opacity", 1);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("r", 4).classed("is-active", false);
      });
  }

  function onResize() {
    if (!state.data) return;
    renderChart(state.data);
  }

  async function boot() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} ao carregar ${DATA_URL}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.series)) throw new Error("chart.json sem series[]");
      renderChart(data);
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
