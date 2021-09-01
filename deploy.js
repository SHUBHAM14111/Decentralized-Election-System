const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "emerge way beef hawk elbow foil satoshi magnet like car glue survey",
  "https://rinkeby.infura.io/v3/a79c40a8fb7e437d89f93e722456ef6a"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ gas: "1000000", gasPrice: "5000000000", from: accounts[0] });
  console.log(interface);
  console.log("Contract deployed to :", result.options.address);
};
deploy();
