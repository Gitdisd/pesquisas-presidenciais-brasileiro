/* PEBR — fallback candidate UI flags when chart.json omits status metadata.
 * Prefer chart.json fields: active, status, running, withdrawn.
 * Keep in sync with verified 2026 race exits (UI-only; does not invent poll %). */
(function (global) {
  "use strict";

  /** @type {ReadonlySet<string>} ids treated as inactive / not running / withdrawn */
  const FALLBACK_INACTIVE_IDS = new Set([
    "aldo_rebelo", // DC retirou / substituiu
    "joaquim_barbosa", // desistiu / DC oficializou Clariana Barão
    "aecio_neves", // desistiu da Presidência (PSDB sem chapa)
    "cabo_daciolo", // Mobiliza não lançou ao Planalto
    "pablo_marcal", // indeferido / substituído (PRTB → Avalanche)
    "hero_bezerra", // nome PRTB supersedido nas listas
    "ratinho_junior", // só em slates iniciais; fora do cenário atual
  ]);

  const INACTIVE_STATUS = new Set([
    "inactive",
    "withdrawn",
    "withdrawn_from_race",
    "not_running",
    "out",
    "dropped",
    "ineligible",
  ]);

  /**
   * @param {{ id?: string, active?: boolean, running?: boolean, withdrawn?: boolean, status?: string }} c
   * @returns {boolean} true if candidate should show by default
   */
  function isCandidateActive(c) {
    if (!c || !c.id) return false;
    if (typeof c.active === "boolean") return c.active;
    if (typeof c.running === "boolean") return c.running;
    if (c.withdrawn === true) return false;
    if (typeof c.status === "string" && INACTIVE_STATUS.has(c.status.toLowerCase())) {
      return false;
    }
    return !FALLBACK_INACTIVE_IDS.has(c.id);
  }

  global.PEBR_CANDIDATES_CONFIG = {
    FALLBACK_INACTIVE_IDS,
    isCandidateActive,
  };
})(typeof window !== "undefined" ? window : globalThis);
