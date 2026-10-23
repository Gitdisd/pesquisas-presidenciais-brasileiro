"use strict";

const assert = require("node:assert/strict");
require("../site/js/vote-basis.js");
const api = globalThis.PEBR_VOTE_BASIS;
assert.ok(api && typeof api.normalizeRows === "function");
assert.ok(typeof api.filterDatafolhaRows === "function");

const rows = [
  { series_kind: "poll", poll_id: "p1", candidate_id: "flavio", value: 0.46, vote_basis: "total_votes" },
  { series_kind: "poll", poll_id: "p1", candidate_id: "lula", value: 0.44, vote_basis: "total_votes" },
  { series_kind: "poll", poll_id: "p1", candidate_id: "branco_nulo", value: 0.08, vote_basis: "total_votes" },
  { series_kind: "poll", poll_id: "p2", candidate_id: "flavio", value: 0.49, vote_basis: "unknown" },
  { series_kind: "poll", poll_id: "p2", candidate_id: "lula", value: 0.47, vote_basis: "unknown" },
  { series_kind: "poll", poll_id: "p3", candidate_id: "flavio", value: 0.51, vote_basis: "unknown" },
  { series_kind: "aggregate", poll_id: "not-a-poll", candidate_id: "flavio", value: 0.51 }
];

const normalized = api.normalizeRows(rows, ["flavio", "lula", "branco_nulo"]);
assert.equal(normalized.length, 4, "both complete polls should be kept; residuals and aggregate rows removed");

function valueOf(pollId, candidateId) {
  const row = normalized.find((item) => item.poll_id === pollId && item.candidate_id === candidateId);
  assert.ok(row, "expected a normalized candidate row");
  return row;
}
assert.ok(Math.abs(valueOf("p1", "flavio").value - (46 / 90)) < 1e-12);
assert.ok(Math.abs(valueOf("p1", "lula").value - (44 / 90)) < 1e-12);
assert.ok(Math.abs(valueOf("p2", "flavio").value - (49 / 96)) < 1e-12);
assert.ok(Math.abs(valueOf("p2", "lula").value - (47 / 96)) < 1e-12);
assert.equal(valueOf("p1", "flavio").published_value, 0.46);
assert.equal(valueOf("p1", "flavio").vote_basis, "total_votes");
assert.ok(Math.abs(valueOf("p1", "flavio").value + valueOf("p1", "lula").value - 1) < 1e-12);
assert.equal(api.normalizeRows(rows, ["flavio"]).length, 0);
assert.equal(api.isResidualCandidate({ id: "branco_nulo", category: "residual" }), true);

const aggregateSource = [
  { series_kind: "poll", poll_id: "df1", institute_id: "datafolha", candidate_id: "flavio", value: 0.47 },
  { series_kind: "poll", poll_id: "q1", institute_id: "quaest", candidate_id: "flavio", value: 0.46 }
];
const aggregateDefault = api.filterDatafolhaRows(aggregateSource, false);
assert.deepEqual(aggregateDefault.map((row) => row.institute_id), ["quaest"]);
assert.equal(aggregateSource.length, 2, "filtering the aggregate copy must not delete raw observations");
assert.equal(api.filterDatafolhaRows(aggregateSource, true).length, 2, "explicit include restores Datafolha to the aggregate");

console.log("vote-basis tests OK — normalization and aggregation-only Datafolha exclusion");
