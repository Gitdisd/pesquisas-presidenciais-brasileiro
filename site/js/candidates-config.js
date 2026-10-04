/* PEBR — 2026 presidential candidate identity/status configuration.
 * The current-roster gate reflects the current TSE presidential candidature table:
 * Leonardo Avalanche remains in the current roster while his TSE status is pending judgment;
 * Pablo Marçal is not in the active allowlist.
 * Historical poll labels remain in the data archive but
 * are hidden from the default election UI.
 *
 * Current 2026 presidential candidates:
 * Lula, Flávio Bolsonaro, Samara Martins, Romeu Zema, Hertz Dias,
 * Edmilson Costa, Renan Santos, Wilson Grassi, Clariana Barão,
 * Augusto Cury, Ronaldo Caiado, Rui Costa Pimenta, Leonardo Avalanche.
 *
 * Source: TSE current candidature table (status checked 2026-10-01):
 * https://sig.tse.jus.br/ords/dwapr/r/seai/sig-eleitoral/consulta-candidatos-eleicao
 */
(function (global) {
  "use strict";

  const CURRENT_PRESIDENTIAL_2026 = Object.freeze({
    lula: Object.freeze({ displayName: "Luiz Inácio Lula da Silva", ballotNumber: 13 }),
    flavio_bolsonaro: Object.freeze({ displayName: "Flávio Bolsonaro", ballotNumber: 22 }),
    samara_martins: Object.freeze({ displayName: "Samara Martins", ballotNumber: 80 }),
    romeu_zema: Object.freeze({ displayName: "Romeu Zema", ballotNumber: 30 }),
    hertz_dias: Object.freeze({ displayName: "Hertz Dias", ballotNumber: 16 }),
    edmilson_costa: Object.freeze({ displayName: "Edmilson Costa", ballotNumber: 21 }),
    renan_santos: Object.freeze({ displayName: "Renan Santos", ballotNumber: 14 }),
    wilson_grassi: Object.freeze({ displayName: "Wilson Grassi", ballotNumber: 35 }),
    clariana_barao: Object.freeze({ displayName: "Clariana Barão", ballotNumber: 27 }),
    augusto_cury: Object.freeze({ displayName: "Augusto Cury", ballotNumber: 70 }),
    ronaldo_caiado: Object.freeze({ displayName: "Ronaldo Caiado", ballotNumber: 55 }),
    rui_costa_pimenta: Object.freeze({ displayName: "Rui Costa Pimenta", ballotNumber: 29 }),
    leonardo_avalanche: Object.freeze({ displayName: "Leonardo Avalanche", ballotNumber: 28, rosterStatus: "pending_judgment" }),
  });

  const CURRENT_PRESIDENTIAL_2026_IDS = new Set(
    Object.keys(CURRENT_PRESIDENTIAL_2026)
  );

  const DISPLAY_NAMES = Object.freeze({
    ...Object.fromEntries(
      Object.entries(CURRENT_PRESIDENTIAL_2026).map(([id, info]) => [
        id,
        info.displayName,
      ])
    ),
    aecio_neves: "Aécio Neves",
    aldo_rebelo: "Aldo Rebelo",
    cabo_daciolo: "Cabo Daciolo",
    ciro_gomes: "Ciro Gomes",
    hero_bezerra: "Heró Bezerra",
    joaquim_barbosa: "Joaquim Barbosa",
    leonardo_avalanche: "Leonardo Avalanche",
    michel_temer: "Michel Temer",
    pablo_marcal: "Pablo Marçal",
    ratinho_junior: "Ratinho Junior",
    tarcisio_de_freitas: "Tarcísio de Freitas",
  });

  /** Historical/non-current IDs seen in archived 2026 poll slates. */
  const FALLBACK_INACTIVE_IDS = new Set([
    "aecio_neves",
    "aldo_rebelo",
    "cabo_daciolo",
    "ciro_gomes",
    "hero_bezerra",
    "joaquim_barbosa",
    "michel_temer",
    "pablo_marcal",
    "ratinho_junior",
    "tarcisio_de_freitas",
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
   * @param {string|{id?: string, label?: string, display_name?: string}} candidate
   * @returns {string}
   */
  function displayNameFor(candidate) {
    const id =
      typeof candidate === "string"
        ? candidate
        : candidate && candidate.id
          ? candidate.id
          : "";
    if (id && DISPLAY_NAMES[id]) return DISPLAY_NAMES[id];

    const raw =
      typeof candidate === "string"
        ? candidate
        : candidate && (candidate.display_name || candidate.label)
          ? candidate.display_name || candidate.label
          : id;
    return String(raw || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  /**
   * Current-roster gate:
   * - synthetic example_* series remain visible for test/demo fixtures;
   * - explicit withdrawal/ineligible metadata can hide a current candidate;
   * - all other non-current historical IDs stay hidden by default.
   */
  function isCandidateActive(c) {
    if (!c || !c.id) return false;
    if (String(c.id).startsWith("example_")) return true;

    const id = String(c.id);
    if (!CURRENT_PRESIDENTIAL_2026_IDS.has(id)) return false;

    if (c.active === false || c.running === false || c.withdrawn === true) {
      return false;
    }

    if (typeof c.status === "string" && INACTIVE_STATUS.has(c.status.toLowerCase())) {
      return false;
    }
    return true;
  }

  global.PEBR_CANDIDATES_CONFIG = {
    CURRENT_PRESIDENTIAL_2026,
    CURRENT_PRESIDENTIAL_2026_IDS,
    FALLBACK_INACTIVE_IDS,
    DISPLAY_NAMES,
    displayNameFor,
    isCandidateActive,
  };
})(typeof window !== "undefined" ? window : globalThis);
