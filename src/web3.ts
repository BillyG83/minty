import Web3 from "web3";
 
// Use type assertion for ethereum
(window as any).ethereum.request({ method: "eth_requestAccounts" });

// Use type assertion for web3
const web3 = new Web3((window as any).ethereum);

export default web3;
