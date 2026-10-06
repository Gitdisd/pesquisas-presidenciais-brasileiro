const assert = require("node:assert/strict");
const core = require("../site/js/election-results-core.js");

const fixture = {
  "carg": [
    {
      "agr": [
        {
          "par": [
            {
              "cand": [
                {
                  "n": "999",
                  "nmu": "Candidato Fixture A",
                  "vap": "123456",
                  "pvap": "50.25",
                  "st": "2º turno",
                  "e": "n"
                },
                {
                  "n": "998",
                  "nmu": "Candidato Fixture B",
                  "vap": "118000",
                  "pvap": "48.00",
                  "st": "Não eleito",
                  "e": "n"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "s": {
    "st": "1234",
    "ts": "1234",
    "pst": "100"
  },
  "v": {
    "vv": "241456"
  },
  "e": {
    "c": "250000"
  },
  "tf": "s",
  "dg": "04/10/2026",
  "hg": "23:59:59"
};
const parsed = core.normalize(fixture);
assert.equal(parsed.final, true);
assert.equal(parsed.candidates.length, 2);
assert.equal(parsed.candidates[0].votes, 123456);
assert.equal(parsed.candidates[0].percent, 50.25);
assert.equal(parsed.summary.sections_totalized, 1234);

const archive = require("../site/data/official-results-1st-round.json");
const archived = core.normalize(archive);
assert.equal(archived.final, true);
assert.equal(archived.candidates.find((c) => c.candidate_id === "flavio_bolsonaro").votes, 56104503);
assert.equal(archived.candidates.find((c) => c.candidate_id === "lula").votes, 53879538);
assert.equal(archived.summary.percent_totalized, 100);
console.log("election-results-core contract OK");