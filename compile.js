const path = require("path");
const fs = require("fs");
const solc = require("solc");

const electionPath = path.resolve(__dirname, "contracts", "Election.sol");
const source = fs.readFileSync(electionPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":Election"];
