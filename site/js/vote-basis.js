/* Explicit candidate-only normalization for runoff chart views. */
(function (root) {
  "use strict";

  const RESIDUAL_IDS = new Set([
    "branco_nulo", "branco", "nulo", "ns_nr", "indeciso", "indecisos",
    "undecided", "none", "nenhum", "abstention", "abstencao"
  ]);

  function isResidualCandidate(candidate) {
    if (!candidate) return false;
    const id = String(candidate.id || candidate.candidate_id || "").toLowerCase();
    const category = String(candidate.category || "").toLowerCase();
    return category === "residual" || RESIDUAL_IDS.has(id);
  }

  /**
   * Rescale the reported candidate shares within each poll so the listed
   * candidates sum to 1. Rows are retained only when every requested candidate
   * is reported for that poll. Published residuals (blank/null, undecided) are
   * deliberately excluded, never allocated to either candidate.
   */
  function normalizeRows(flatRows, candidateIds) {
    const ids = Array.from(new Set((candidateIds || []).map(String)))
      .filter((id) => !RESIDUAL_IDS.has(id));
    if (ids.length < 2 || !Array.isArray(flatRows)) return [];

    const wanted = new Set(ids);
    const groups = new Map();
    for (const row of flatRows) {
      if (!row || row.series_kind !== "poll" || row.value == null) continue;
      const cid = String(row.candidate_id || "");
      if (!wanted.has(cid)) continue;
      const value = Number(row.value);
      if (!Number.isFinite(value) || value < 0) continue;
      const key = row.poll_id || `${row.institute_id || ""}|${row.date || ""}|${row.scenario || ""}`;
      if (!groups.has(key)) groups.set(key, new Map());
      groups.get(key).set(cid, { ...row, value });
    }

    const output = [];
    for (const [pollId, byCandidate] of groups) {
      if (!ids.every((id) => byCandidate.has(id))) continue;
      const denominator = ids.reduce((sum, id) => sum + byCandidate.get(id).value, 0);
      if (!(denominator > 0)) continue;
      for (const id of ids) {
        const row = byCandidate.get(id);
        output.push({
          ...row,
          published_value: row.published_value == null ? row.value : row.published_value,
          value: row.value / denominator,
          normalization_mode: "candidate_only",
          normalization_denominator: denominator,
          normalization_candidate_count: ids.length,
          normalized_poll_id: pollId
        });
      }
    }
    return output;
  }

  /** Filter an aggregation-only copy; raw display data stays untouched. */
  function filterDatafolhaRows(rows, includeDatafolha) {
    if (!Array.isArray(rows)) return [];
    if (includeDatafolha) return rows.slice();
    return rows.filter((row) => row && row.institute_id !== "datafolha");
  }

  root.PEBR_VOTE_BASIS = { isResidualCandidate, normalizeRows, filterDatafolhaRows };
})(typeof window !== "undefined" ? window : globalThis);
