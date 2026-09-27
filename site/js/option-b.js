/* PEBR Option B — client-side recompute from flat poll rows (vanilla JS).
 * Mirrors models/pebr_models: √N size × √(1/m) institute anti-flood, trailing k days.
 * Used when institute filter is not "Todos" so the line matches visible points.
 * No house effects. Gap policy: omit empty days. Unit: fraction 0–1. */
(function (global) {
  "use strict";

  const DEFAULTS = {
    k_days: 14,
    flood_W_days: 14,
    n_cap: 4000,
    n_ref: 2000,
  };

  function sizeWeight(n, params) {
    if (n == null || n <= 0) return 1;
    const capped = Math.min(Number(n), params.n_cap);
    return Math.sqrt(capped / params.n_ref);
  }

  function floodFactor(m) {
    if (m <= 1) return 1;
    return Math.sqrt(1 / m);
  }

  function asUTCDate(v) {
    if (v == null) return null;
    if (Object.prototype.toString.call(v) === "[object Date]" && !Number.isNaN(v.getTime())) {
      return v;
    }
    if (typeof v === "number" && Number.isFinite(v)) {
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
      const d = new Date(v.slice(0, 10) + "T00:00:00Z");
      return Number.isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  /** Flat poll rows → unique poll objects with results map (matches Python NationalPoll). */
  function groupPolls(flatRows) {
    const byId = new Map();
    for (const row of flatRows) {
      if (!row || row.value == null || Number.isNaN(row.value)) continue;
      const pid = row.poll_id || `${row.institute_id}|${row.date}|${row.candidate_id}`;
      let p = byId.get(pid);
      if (!p) {
        p = {
          poll_id: pid,
          date: asUTCDate(row.date),
          institute_id: row.institute_id || "",
          n: row.n != null ? Number(row.n) : null,
          results: Object.create(null),
        };
        byId.set(pid, p);
      }
      p.results[row.candidate_id] = Number(row.value);
      if (row.n != null && p.n == null) p.n = Number(row.n);
    }
    return Array.from(byId.values()).filter((p) => p.date != null);
  }

  function dayMs(d) {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  function addDaysUTC(d, delta) {
    return new Date(dayMs(d) + delta * 86400000);
  }

  function countInstituteInWindow(windowPolls, instituteId, asOf, floodW) {
    const lo = addDaysUTC(asOf, -floodW);
    const loMs = dayMs(lo);
    const asMs = dayMs(asOf);
    let n = 0;
    for (const p of windowPolls) {
      if (p.institute_id !== instituteId) continue;
      const t = dayMs(p.date);
      if (t > loMs && t <= asMs) n += 1;
    }
    return n;
  }

  function pollWeight(poll, windowPolls, asOf, params) {
    const wSize = sizeWeight(poll.n, params);
    const m = countInstituteInWindow(
      windowPolls,
      poll.institute_id,
      asOf,
      params.flood_W_days
    );
    return wSize * floodFactor(m);
  }

  function weightedSd(values, weights) {
    if (values.length < 2 || values.length !== weights.length) return 0;
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return 0;
    const mu = values.reduce((s, x, i) => s + weights[i] * x, 0) / total;
    let var_ = 0;
    for (let i = 0; i < values.length; i++) {
      const d = values[i] - mu;
      var_ += (weights[i] / total) * d * d;
    }
    return Math.sqrt(Math.max(var_, 0));
  }

  function dispersionBand(mean, sd) {
    return [Math.max(0, mean - sd), Math.min(1, mean + sd)];
  }

  function windowPolls(polls, day, kDays) {
    const lo = addDaysUTC(day, -kDays);
    const loMs = dayMs(lo);
    const dayMs_ = dayMs(day);
    return polls.filter((p) => {
      const t = dayMs(p.date);
      return t > loMs && t <= dayMs_;
    });
  }

  function eachDayUTC(start, end) {
    const out = [];
    let cur = new Date(dayMs(start));
    const endMs = dayMs(end);
    while (dayMs(cur) <= endMs) {
      out.push(new Date(dayMs(cur)));
      cur = addDaysUTC(cur, 1);
    }
    return out;
  }

  /**
   * @param {Array} flatPollRows series_kind=poll rows (Date parsed)
   * @param {{k_days?:number,flood_W_days?:number,n_cap?:number,n_ref?:number}} paramsIn
   * @param {string[]} [candidateIds] limit candidates (default: all seen)
   * @returns {{aggregates: object[], uncertainty: object[]}}
   */
  function aggregateFromFlatPolls(flatPollRows, paramsIn, candidateIds) {
    const params = Object.assign({}, DEFAULTS, paramsIn || {});
    const polls = groupPolls(flatPollRows);
    if (!polls.length) return { aggregates: [], uncertainty: [] };

    let cands = candidateIds && candidateIds.length
      ? candidateIds.slice()
      : [];
    if (!cands.length) {
      const seen = new Set();
      for (const p of polls) {
        for (const cid of Object.keys(p.results)) {
          if (!seen.has(cid)) {
            seen.add(cid);
            cands.push(cid);
          }
        }
      }
    }

    const mids = polls.map((p) => p.date);
    const d0 = mids.reduce((a, b) => (a < b ? a : b));
    const d1 = mids.reduce((a, b) => (a > b ? a : b));

    const aggregates = [];
    const uncertainty = [];

    for (const day of eachDayUTC(d0, d1)) {
      const wp = windowPolls(polls, day, params.k_days);
      if (!wp.length) continue;
      for (const cid of cands) {
        const usable = wp.filter((p) => p.results[cid] != null);
        if (!usable.length) continue;
        const weights = usable.map((p) => pollWeight(p, wp, day, params));
        const values = usable.map((p) => p.results[cid]);
        const totalW = weights.reduce((a, b) => a + b, 0);
        if (totalW <= 0) continue;
        const mean = values.reduce((s, v, i) => s + weights[i] * v, 0) / totalW;
        const sd = weightedSd(values, weights);
        const [lo, hi] = dispersionBand(mean, sd);
        const iso = [
          day.getUTCFullYear(),
          String(day.getUTCMonth() + 1).padStart(2, "0"),
          String(day.getUTCDate()).padStart(2, "0"),
        ].join("-");
        aggregates.push({
          series_kind: "aggregate",
          date: day,
          date_iso: iso,
          candidate_id: cid,
          value: mean,
          client_option_b: true,
        });
        uncertainty.push({
          series_kind: "uncertainty",
          date: day,
          date_iso: iso,
          candidate_id: cid,
          band_low: lo,
          band_high: hi,
          client_option_b: true,
        });
      }
    }

    return { aggregates, uncertainty };
  }

  global.PEBR_OPTION_B = {
    DEFAULTS,
    aggregateFromFlatPolls,
    groupPolls,
  };
})(typeof window !== "undefined" ? window : globalThis);
