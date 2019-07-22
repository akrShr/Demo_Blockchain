//Blockchain Data Structure
const uuid = require('uuid/v1');
const sha256 = require('sha256');
const currentNodeUrl=process.argv[3];

//Constructor
function Blockchain(){
	this.chain=[]; //All of the blocks we mine will be stored in this array
	this.pendingTransactions=[]; //All of new created transcations are stored here before thay are mined and stored in blocks
	this.currentNodeUrl =currentNodeUrl;//Node to be aware of which URL it is hosted on
	this.networkNodes =[];//Array to store info for a blockchain's node to be aware of all other nodes inside the network
	this.createNewBlock(5,'5FECEB66FFC86F38D952786C6D696C79C2DBC239DD4E91B46729D73A27FB57E9','1A6562590EF19D1045D06C4055742D38288E9E6DCD71CCDE5CEE80F1D5A774ES');//Genesis Block
}

Blockchain.prototype.createNewBlock=function(nonce,prevBlockHash,hash){
	//New block object
	const newBlock = {
		index : this.chain.length + 1,
		timestamp : Date.now(),
		transcations : this.pendingTransactions,
		nonce: nonce,
		hash : hash,
		prevBlockHash : prevBlockHash
	};
	
	this.pendingTransactions=[];
	this.chain.push(newBlock);

	return newBlock;

}

/*Creation on new transcation,but these transcations are not recorded in Blockchain---pending transcations
returns the number of block the pending transaction once verified, will be added to: after a new block is created
*/
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};


Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};

//SHA256 hashing the block
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

/*
Repeatedly hash block until it finds the correct hash, uses current block's data, with previous block hash
and continuosly changes nonce until the first four letter of generated hash is '0000'
*/
Blockchain.prototype.remining = function(previousBlockHash, currentBlockData) {
	var nonce = 0;
	var hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}
	//console.log(hash)
	return nonce;
};



//To get the last block insterted into Blockchain
Blockchain.prototype.getLastBlock = function(){
	var idx = this.chain.length-1;
		return this.chain[idx];
}

//To export the Blockchain constructor function to be used in other js files
module.exports=Blockchain;