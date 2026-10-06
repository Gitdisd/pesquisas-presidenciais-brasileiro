/* PEBR post-election official-result archive.
 * The first-round result is now final. Keep it local so the public site does not
 * depend forever on a volatile live TSE JSON endpoint. Poll data and official
 * results remain separate products.
 */
(function () {
  "use strict";

  const ARCHIVE_URL = "data/official-results-1st-round.json";
  const el = {
    status: document.getElementById("official-results-status"),
    progress: document.getElementById("official-results-progress"),
    summary: document.getElementById("official-results-summary"),
    tableWrap: document.getElementById("official-results-table-wrap"),
    body: document.getElementById("official-results-body"),
    refresh: document.getElementById("btn-refresh-results"),
  };
  const core = window.PEBR_ELECTION_RESULTS_CORE;
  if (!el.status || !el.body || !core) return;

  function fmtInt(v) { return Math.round(Number(v || 0)).toLocaleString("pt-BR"); }
  function fmtPct(v) { return Number(v || 0).toLocaleString("pt-BR", {minimumFractionDigits:2, maximumFractionDigits:2}) + "%"; }
  function escapeHtml(s) {
    return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function render(raw) {
    const data = core.normalize(raw);
    el.body.innerHTML = data.candidates.map((c) =>
      "<tr>" +
      "<td><strong>" + escapeHtml(c.name) + "</strong>" +
      (c.number ? "<br><span class=\"muted small\">nº " + escapeHtml(c.number) + "</span>" : "") +
      "</td>" +
      "<td>" + fmtInt(c.votes) + "</td>" +
      "<td>" + fmtPct(c.percent) + "</td>" +
      "<td>" + escapeHtml(c.status) + (c.elected ? " · eleito" : "") + "</td>" +
      "</tr>"
    ).join("");

    const s = data.summary || {};
    el.summary.hidden = false;
    el.summary.innerHTML = [
      "<span class=\"chip\">Seções " + fmtInt(s.sections_totalized) + " / " + fmtInt(s.sections_expected) + " · " + fmtPct(s.percent_totalized) + "</span>",
      "<span class=\"chip\">Votos válidos " + fmtInt(s.valid_votes) + "</span>",
      "<span class=\"chip\">Comparecimento " + fmtInt(s.turnout) + "</span>",
      "<span class=\"chip\">Brancos " + fmtInt(s.blank_votes) + " · nulos " + fmtInt(s.null_votes) + "</span>",
      "<span class=\"chip\">Abstenções " + fmtInt(s.abstentions) + "</span>"
    ].join("");
    el.tableWrap.hidden = false;
    el.progress.textContent = data.final ? "Resultado final" : "Resultado arquivado";
    el.status.textContent = "Resultado oficial final do 1º turno, arquivado localmente após a totalização. Os valores abaixo são do TSE, não pesquisas.";
  }

  async function load() {
    try {
      const res = await fetch(ARCHIVE_URL + "?v=" + Date.now(), {cache:"no-store"});
      if (!res.ok) throw new Error("HTTP " + res.status);
      render(await res.json());
    } catch (err) {
      el.status.textContent = "Falha ao carregar o resultado oficial arquivado: " + (err.message || err);
      el.progress.textContent = "Erro no arquivo";
    }
  }

  if (el.refresh) el.refresh.addEventListener("click", load);
  load();
})();