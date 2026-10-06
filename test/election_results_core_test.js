const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../site/js/election-results-core.js");

const fixturePath = path.join(__dirname, "..", "fixtures", "tse-official-results-fixture.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const parsed = core.normalize(fixture);

assert.equal(parsed.final, true);
assert.equal(parsed.candidates.length, 2);
assert.equal(parsed.candidates[0].votes, 123456);
assert.equal(parsed.candidates[0].percent, 50.25);
assert.equal(parsed.summary.sections_totalized, 1234);
assert.equal(parsed.summary.sections_expected, 1234);

const archivePath = path.join(__dirname, "..", "site", "data", "official-results-1st-round.json");
const archive = JSON.parse(fs.readFileSync(archivePath, "utf8"));
const archived = core.normalize(archive);

assert.equal(archived.final, true);
assert.equal(archived.round, "1st");
assert.equal(archived.candidates.length, 12);
assert.equal(archived.candidates.find((c) => c.candidate_id === "flavio_bolsonaro").votes, 56104503);
assert.equal(archived.candidates.find((c) => c.candidate_id === "lula").votes, 53879538);
assert.equal(archived.summary.percent_totalized, 100);
assert.equal(archived.summary.valid_votes, 119300788);

console.log("election-results-core contract OK");
