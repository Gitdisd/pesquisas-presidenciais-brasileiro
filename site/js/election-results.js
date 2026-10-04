/* PEBR election-day official results panel.
 * Reads only the public TSE result JSON after the official 17:00 BRT release.
 * This is deliberately separate from polls, canonical points and Option B.
 */
(function () {
  "use strict";

  const TSE_RESULT_URL = "https://resultados.tse.jus.br/oficial/ele2026/6257/dados/br/br-c0001-e06257-u.json";
  const START_HOUR = 17;
  const POLL_MS = 30000;
  const el = {
    status: document.getElementById("official-results-status"),
    progress: document.getElementById("official-results-progress"),
    summary: document.getElementById("official-results-summary"),
    tableWrap: document.getElementById("official-results-table-wrap"),
    body: document.getElementById("official-results-body"),
    refresh: document.getElementById("btn-refresh-results"),
  };
  if (!el.status || !el.body) return;

  let timer = null;
  let loading = false;

  function brNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  }
  function afterStart() { return brNow().getHours() >= START_HOUR; }
  function num(v) {
    const n = Number(String(v ?? "0").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  function fmtInt(v) { return Math.round(num(v)).toLocaleString("pt-BR"); }
  function fmtPct(v) {
    return num(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
  }
  function escapeHtml(s) {
    return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function setWaiting() {
    if (el.progress) el.progress.textContent = "Aguardando 17h";
    el.status.textContent = "A apuração presidencial oficial será divulgada a partir das 17h, horário de Brasília. O painel começará a consultar o TSE automaticamente nesse horário.";
  }

  function flattenCandidates(raw) {
    const out = [];
    for (const cargo of raw?.carg || []) {
      for (const agr of cargo.agr || []) {
        for (const party of agr.par || []) {
          for (const cand of party.cand || []) {
            out.push({
              number: cand.n || "",
              name: cand.nmu || cand.nm || "—",
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

  function render(raw) {
    const candidates = flattenCandidates(raw);
    if (!candidates.length) throw new Error("Resposta do TSE sem candidaturas");
    el.body.innerHTML = candidates.map((c) =>
      "<tr>" +
      "<td><strong>" + escapeHtml(c.name) + "</strong><br><span class="muted small">nº " + escapeHtml(c.number) + "</span></td>" +
      "<td>" + fmtInt(c.votes) + "</td>" +
      "<td>" + fmtPct(c.percent) + "</td>" +
      "<td>" + escapeHtml(c.status) + (c.elected ? " · eleito" : "") + "</td>" +
      "</tr>"
    ).join("");

    const s = raw.s || {};
    const e = raw.e || {};
    const v = raw.v || {};
    el.summary.hidden = false;
    el.summary.innerHTML = [
      "<span class="chip">Seções " + fmtInt(s.st) + " / " + fmtInt(s.ts) + " · " + fmtPct(s.pst) + "</span>",
      "<span class="chip">Votos apurados " + fmtInt(v.vv) + "</span>",
      "<span class="chip">Comparecimento " + fmtInt(e.c) + "</span>",
      "<span class="chip">Atualizado " + escapeHtml(raw.dg || "—") + " " + escapeHtml(raw.hg || "") + "</span>"
    ].join("");
    el.tableWrap.hidden = false;
    if (el.progress) el.progress.textContent = raw.tf === "s" ? "Totalização final" : fmtPct(s.pst) + " totalizado";
    el.status.textContent = raw.tf === "s"
      ? "Totalização final publicada pelo TSE. Os valores abaixo são resultados oficiais, não pesquisas."
      : "Totalização em andamento. Os valores abaixo são os dados oficiais mais recentes disponibilizados pelo TSE.";
  }

  async function load() {
    if (loading) return;
    if (!afterStart()) { setWaiting(); return; }
    loading = true;
    if (el.progress) el.progress.textContent = "Consultando TSE…";
    try {
      const res = await fetch(TSE_RESULT_URL + "?t=" + Date.now(), { cache: "no-store" });
      if (res.status === 404) throw new Error("TSE ainda não disponibilizou o arquivo");
      if (!res.ok) throw new Error("TSE HTTP " + res.status);
      render(await res.json());
    } catch (err) {
      if (!el.tableWrap.hidden) {
        el.status.textContent = "Não foi possível atualizar agora; mantendo o último resultado recebido. " + err.message;
      } else {
        el.status.textContent = "Aguardando o arquivo oficial do TSE. " + err.message;
        if (el.progress) el.progress.textContent = "Aguardando TSE";
      }
    } finally {
      loading = false;
    }
  }

  el.refresh.addEventListener("click", load);
  setWaiting();
  load();
  timer = setInterval(load, POLL_MS);
})();
