"use strict";

const assert = require("node:assert/strict");
require("../site/js/option-b.js");
const api = globalThis.PEBR_OPTION_B;
assert.ok(api && typeof api.aggregateWithMethod === "function");

const sourcePolls = [
  { poll_id: "p1", date: "2026-10-01", institute_id: "house_a", n: 1000, values: { candidate_a: 0.20 } },
  { poll_id: "p2", date: "2026-10-02", institute_id: "house_a", n: 4000, values: { candidate_a: 0.40 } },
  { poll_id: "p3", date: "2026-10-03", institute_id: "house_b", n: 3000, values: { candidate_a: 0.80 } },
];
const rows = [];
for (const poll of sourcePolls) {
  for (const [candidate_id, value] of Object.entries(poll.values)) {
    rows.push({
      series_kind: "poll",
      poll_id: poll.poll_id,
      institute_id: poll.institute_id,
      date: poll.date,
      n: poll.n,
      candidate_id,
      value,
    });
  }
}

function lastDayValue(result) {
  const row = result.aggregates.find((item) =>
    item.candidate_id === "candidate_a" && item.date_iso === "2026-10-03"
  );
  assert.ok(row, "expected a final-day candidate aggregate");
  assert.ok(row.value >= 0 && row.value <= 1);
  return row.value;
}

const simple = api.aggregateWithMethod(rows, api.DEFAULTS, ["candidate_a"], "equal_poll");
const house = api.aggregateWithMethod(rows, api.DEFAULTS, ["candidate_a"], "equal_house");
const robust = api.aggregateWithMethod(rows, api.DEFAULTS, ["candidate_a"], "median");
const recency = api.aggregateWithMethod(rows, api.DEFAULTS, ["candidate_a"], "recency");

assert.ok(Math.abs(lastDayValue(simple) - (0.2 + 0.4 + 0.8) / 3) < 1e-9);
assert.ok(Math.abs(lastDayValue(house) - 0.55) < 1e-9);
assert.ok(Math.abs(lastDayValue(robust) - 0.40) < 1e-9);
assert.ok(Math.abs(lastDayValue(recency) - lastDayValue(simple)) > 1e-4);
for (const result of [simple, house, robust, recency]) {
  assert.ok(result.aggregates.length > 0);
  assert.ok(result.uncertainty.length > 0);
}
const baseline = api.aggregateWithMethod(rows, api.DEFAULTS, ["candidate_a"], "option_b");
assert.ok(baseline.aggregates.length > 0);
console.log("option-b method tests OK — equal poll, equal house, median, recency and baseline");
