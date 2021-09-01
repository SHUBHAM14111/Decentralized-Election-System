const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let election;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  election = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Election", () => {
  it("deploys a contract", () => {
    assert.ok(election.options.address);
  });

  it("initializes with two candidates", async () => {
    const count = await election.methods.candidatesCount().call();
    assert.equal(count, 2);
  });

  it("initializes the candidates with correct values", async () => {
    const candidate1 = await election.methods.candidates(1).call();
    assert.equal(candidate1[0], 1, "contains correct id");
    assert.equal(candidate1[1], "Candidate 1", "contains correct name");
    assert.equal(candidate1[2], 0, "contains correct vote counts");
    const candidate2 = await election.methods.candidates(2).call();
    assert.equal(candidate2[0], 2, "contains correct id");
    assert.equal(candidate2[1], "Candidate 2", "contains correct name");
    assert.equal(candidate2[2], 0, "contains correct vote counts");
  });

  it("allows a voter to cast a vote", async () => {
    const candidateId = 1;
    const receipt = await election.methods
      .vote(candidateId)
      .send({ from: accounts[0] });
    assert.ok(receipt.events, "an event was triggered");
    // assert.equal(
    //   receipt.events[0].event,
    //   "votedEvent",
    //   "the event type is correct"
    // );
    // assert.equal(
    //   receipt.logs[0].args._candidateId,
    //   candidateId,
    //   "the candidate id is correct"
    // );
    const voted = election.methods.voters(accounts[0]).call();
    assert(voted, "the voter was marked voted");
    const candidate = await election.methods.candidates(candidateId).call();
    assert.equal(candidate[2], 1, "increment the candidate's vote count");
  });

  it("throws an exception for invalid candidate", async () => {
    try {
      const candidateId = 99;
      await election.methods.vote(candidateId).send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
    const candidate1 = await election.methods.candidates(1).call();
    assert.equal(candidate1[2], 0, "Candidate 1 has not recieved the vote");
    const candidate2 = await election.methods.candidates(2).call();
    assert.equal(candidate2[2], 0, "Candidate 2 has not recieved the vote");
  });

  it("throws an exception for double voting", async () => {
    const candidateId = 1;
    await election.methods.vote(candidateId).send({ from: accounts[0] });
    try {
      const candidateId = 2;
      await election.methods.vote(candidateId).send({ from: accounts[0] });
      assert(false);
    } catch (err) {
      assert(err);
    }
    const candidate1 = await election.methods.candidates(1).call();
    assert.equal(candidate1[2], 1, "Candidate 1 has not recieved the vote");
    const candidate2 = await election.methods.candidates(2).call();
    assert.equal(candidate2[2], 0, "Candidate 2 has not recieved the vote");
  });
});
