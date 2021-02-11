const HOSTNAME = "localhost";
const PORT_EXPRESS = 2999;
const PORT_GANACHE = 8545;
const contractAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";
const { abi } = require("./abi.js");

const Web3 = require("web3");
const express = require("express");
const cors = require("cors");
const url = require("url");
const BigNumber = require("bignumber.js");

const web3 = new Web3(new Web3.providers.HttpProvider(`http://${HOSTNAME}:${PORT_GANACHE}`));
let accounts;
web3.eth.getAccounts().then(acc => accounts = acc);

const Escrow = new web3.eth.Contract(abi, contractAddress);
console.log(Escrow._address === contractAddress ? "contract init sucess" : "contract init fail");

const app = new express();
app.use(cors());
server = app.listen(PORT_EXPRESS, HOSTNAME, () => console.log(`Server running at http://${HOSTNAME}:${PORT_EXPRESS}/`));

// todo: '/balance':
// app.get("/balance", async (req, res, next) => {
//   const urlQuery = url.parse(req.url, true).query;
//   console.log("urlQuery:", urlQuery);
  
//   const bal = await Escrow.methods.getBalance.call({ from: urlQuery.addr });
	
//   res.status = 200; // OK
//   res.setHeader("Content-Type", "application/json");
//   res.end(JSON.stringify(bal));
// });

app.get("/deposit", async (req, res, next) => {
  const urlQuery = url.parse(req.url, true).query;
  console.log("urlQuery:", urlQuery);

	const amtBN = new BigNumber(urlQuery.wei ? urlQuery.wei : (1e18 * urlQuery.eth));
  Escrow.methods.deposit().send({ value: amtBN, from: urlQuery.addr })
    .then(tx => {
      if(!tx.status) {
        console.error(`tx '${tx.transactionHash}' failed`);
        res.status = 204; // No Content
        res.send({});
      }
      res.stats = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tx.transactionHash));
    })
    .catch(err => {
      if(err.data.stack.includes("sender doesn't have enough funds")) {
        console.log("insufficient funds");
      } else {
        console.error(err);
      }
      res.status = 204; // No Content
      res.send({});
    })
  ;
});

app.get("/withdraw", async (req, res, next) => {
  const urlQuery = url.parse(req.url, true).query;
  console.log("urlQuery:", urlQuery);

	const amtBN = new BigNumber(urlQuery.wei ? urlQuery.wei : (1e18 * urlQuery.eth));
  Escrow.methods.withdraw(amtBN).send({ from: urlQuery.addr })
    .then(tx => {
      if(!tx.status) {
        console.error(`tx '${tx.transactionHash}' failed`);
        res.status = 204; // No Content
        res.send({});
      }
      res.stats = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tx.transactionHash));
    })
    .catch(err => {
      if(err.data.stack.includes("revert")) {
        console.log("insufficient funds");
      } else {
        console.error(err);
      }
      res.status = 204; // No Content
      res.send({});
    })
  ;
});

app.post("/pay", async (req, res, next) => {
  const urlQuery = url.parse(req.url, true).query;
  console.log("urlQuery:", urlQuery);

  const amtBN = new BigNumber(urlQuery.wei ? urlQuery.wei : (1e18 * urlQuery.eth));
  Escrow.methods.pay(urlQuery.from, urlQuery.to, amtBN).send({ from: accounts[0] })
    .then(tx => {
      if(!tx.status) {
        console.error(`tx '${tx.transactionHash}' failed`);
        res.status = 204; // No Content
        res.send({});
      }
      res.stats = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tx.transactionHash));
    })
    .catch(err => {
      if(err.data.stack.includes("revert")) {
        console.log("insufficient funds");
      } else {
        console.error(err);
      }
      res.status = 204; // No Content
      res.send({});
    })
  ;
});

module.exports = app;
