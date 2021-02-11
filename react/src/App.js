//import logo from './logo.svg';
import './App.css';

const HOSTNAME = "localhost";
const PORT_EXPRESS = 2999;

const handleDeposit = async () => {
  const addr = document.querySelector("#depositTo").value;
  const unit = document.querySelector("#depositAmountUnit").value;
  const wei = document.querySelector("#depositAmount").value * (unit === "wei" ? 1 : 1e18);
  const result = await fetch(`http://${HOSTNAME}:${PORT_EXPRESS}/deposit?addr=${addr}&wei=${wei}`);
  const resultJson = await result.json();
  if(resultJson.toString().substr(0, 2) === "0x") {
    console.log(`Transaction hash: ${resultJson}`);
    window.alert("Deposit successful");
  } else {
    window.alert("Unsuccessful: insufficient funds");
  }
};

const handleWithdraw = async () => {
  const addr = document.querySelector("#withdrawFrom").value;
  const unit = document.querySelector("#withdrawAmountUnit").value;
  const wei = document.querySelector("#withdrawAmount").value * (unit === "wei" ? 1 : 1e18);
  const result = await fetch(`http://${HOSTNAME}:${PORT_EXPRESS}/withdraw?addr=${addr}&wei=${wei}`);
  const resultJson = await result.json();
  if(resultJson.toString().substr(0, 2) === "0x") {
    console.log(`Transaction hash: ${resultJson}`);
    window.alert("Withdraw successful");
  } else {
    window.alert("Unsuccessful: insufficient funds");
  }
};

const handlePay = async () => {
  const addrFrom = document.querySelector("#payFrom").value;
  const addrTo = document.querySelector("#payTo").value;
  const unit = document.querySelector("#payAmountUnit").value;
  const wei = document.querySelector("#payAmount").value * (unit === "wei" ? 1 : 1e18);;
  const result = await fetch(`http://${HOSTNAME}:${PORT_EXPRESS}/pay?from=${addrFrom}&to=${addrTo}&wei=${wei}`, { method: "POST" });
  const resultJson = await result.json();
  if(resultJson.toString().substr(0, 2) === "0x") {
    console.log(`Transaction hash: ${resultJson}`);
    window.alert("Payment successful");
  } else {
    window.alert("Unsuccessful: insufficient funds");
  }
};

function App() {
  return (
    <div className="App">
      <h2>Escrow Sample</h2>
      <p></p>
      <section>
        <div>
          <h4>Deposit:</h4>
        </div>
        <div>
          To:
          <input id="depositTo" type="text"></input>
        </div>
        <div>
          Amount:
          <input id="depositAmount" type="number"></input>
          <select id="depositAmountUnit" defaultValue="wei">
            <option value="wei">Wei</option>
            <option value="eth">ETH</option>
          </select>
        </div>
        <div>
          <button onClick={handleDeposit}>Deposit</button>
        </div>
      </section><section>
        <div>
          <h4>Withdraw:</h4>
        </div>
        <div>
          From:
          <input id="withdrawFrom" type="text"></input>
        </div>
        <div>
          Amount:
          <input id="withdrawAmount" type="number"></input>
          <select id="withdrawAmountUnit" defaultValue="wei">
            <option value="wei">Wei</option>
            <option value="eth">ETH</option>
          </select>
        </div>
        <div>
          <button onClick={handleWithdraw}>Withdraw</button>
        </div>
      </section>
      <section>
        <div>
          <h4>Make Payment:</h4>
        </div>
        <div>
          From:
          <input id="payFrom" type="text"></input>
        </div>
        <div>
          To:
          <input id="payTo" type="text"></input>
        </div>
        <div>
          Amount:
          <input id="payAmount" type="number"></input>
          <select id="payAmountUnit" defaultValue="wei">
            <option value="wei">Wei</option>
            <option value="eth">ETH</option>
          </select>
        </div>
        <div>
          <button onClick={handlePay}>Pay</button>
        </div>
      </section>
    </div>
  );
}

export default App;
