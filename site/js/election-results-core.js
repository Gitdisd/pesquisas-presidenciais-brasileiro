/* Pure parser/normalizer for archived or TSE-shaped election-result payloads. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PEBR_ELECTION_RESULTS_CORE = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function num(v) {
    const n = Number(String(v ?? "0").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  function flattenTseCandidates(raw) {
    const out = [];
    for (const cargo of raw?.carg || []) {
      for (const agr of cargo.agr || []) {
        for (const party of agr.par || []) {
          for (const cand of party.cand || []) {
            out.push({
              number: cand.n || "",
              name: cand.nmu || cand.nm || "—",
              candidate_id: cand.id || null,
              votes: num(cand.vap),
              percent: num(cand.pvap),
              status: cand.st || "—",
              elected: cand.e === "s",
            });
          }
        }
      }
    }
    return out;
  }

  function normalize(raw) {
    if (!raw || typeof raw !== "object") throw new Error("Payload de resultados inválido");

    if (Array.isArray(raw.candidates)) {
      return {
        candidates: raw.candidates.map((c) => ({
          number: c.number || "",
          name: c.name || "—",
          candidate_id: c.candidate_id || null,
          votes: num(c.votes),
          percent: num(c.percent),
          status: c.status || "—",
          elected: c.elected === true,
        })),
        summary: raw.summary || {},
        final: raw.official_final === true || raw.status === "final",
        updated: raw.archived_at || null,
        sourceName: raw.source_name || "Tribunal Superior Eleitoral (TSE)",
        sourceUrl: raw.source_url || "https://resultados.tse.jus.br/",
        note: raw.note || "",
        round: raw.round || "1st",
      };
    }

    const candidates = flattenTseCandidates(raw);
    if (!candidates.length) throw new Error("Resposta do TSE sem candidaturas");
    const s = raw.s || {};
    const e = raw.e || {};
    const v = raw.v || {};
    return {
      candidates,
      summary: {
        sections_totalized: num(s.st),
        sections_expected: num(s.ts),
        percent_totalized: num(s.pst),
        valid_votes: num(v.vv),
        turnout: num(e.c),
      },
      final: raw.tf === "s",
      updated: raw.dg ? (raw.dg + (raw.hg ? " " + raw.hg : "")) : null,
      sourceName: "Tribunal Superior Eleitoral (TSE)",
      sourceUrl: "https://resultados.tse.jus.br/",
      note: "",
      round: "1st",
    };
  }

  return { normalize };
});