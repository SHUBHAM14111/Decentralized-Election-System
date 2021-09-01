import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = { manager: "", players: [], balance: "", value: "", message: "" };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: "waiting on transaction success......" });

    const accounts = await web3.eth.getAccounts();
    if (this.state.players.indexOf(accounts[0]) === -1) {
      this.setState({ message: "waiting on transaction success......" });
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      this.setState({ message: "You have been entered!" });
    } else {
      this.setState({ message: "You have been entered!" });
    }
  };
  onClick = async (event) => {
    event.preventDefault();

    this.setState({ message: "Picking a Winner....." });

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "Winner has been picked." });
  };

  render() {
    // web3.eth.getAccounts().then(console.log);
    return (
      <div className='App'>
        <h2>Lottery</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} 🤑 people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether💸 !
        </p>
        <hr />
        <h4>Want to try your luck?💰 </h4>
        <form
          onSubmit={this.onSubmit}
          style={{
            alignItems: "center",
            flexFlow: "row wrap",
          }}>
          <div style={{ display: "inline" }}>
            <p
              style={{
                margin: "5px 10px 5px 0",
              }}>
              Amount of ether to enter:
            </p>
            <input
              value={this.state.value}
              onChange={(event) => {
                this.setState({ value: event.target.value });
              }}
              style={{
                verticalAlign: "middle",
                margin: "5px 10px 5px 0",
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
              }}></input>
          </div>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "dodgerblue",
              border: "1px solid #ddd",
              color: "white",
              cursor: "pointer",
            }}>
            Enter
          </button>
        </form>
        <hr />
        <h4>Ready to pick a winner?🏆 </h4>
        <button
          onClick={this.onClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "dodgerblue",
            border: "1px solid #ddd",
            color: "white",
            cursor: "pointer",
          }}>
          Pick a Winner!
        </button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
