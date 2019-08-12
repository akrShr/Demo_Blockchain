//Blockchain Data Structure
const uuid = require('uuid/v1');
const sha256 = require('sha256');
const currentNodeUrl=process.argv[3];

//Constructor
function Blockchain(){
	this.chain=[]; //All of the blocks we mine will be stored in this array
	this.pendingTransactions=[]; //All of new created transactions are stored here before thay are mined and stored in blocks
	this.currentNodeUrl =currentNodeUrl;//Node to be aware of which URL it is hosted on
	this.networkNodes =[];//Array to store info for a blockchain's node to be aware of all other nodes inside the network
	this.createNewBlock(5,'5FECEB66FFC86F38D952786C6D696C79C2DBC239DD4E91B46729D73A27FB57E9','1A6562590EF19D1045D06C4055742D38288E9E6DCD71CCDE5CEE80F1D5A774ES');//Genesis Block
}

Blockchain.prototype.createNewBlock=function(nonce,prevBlockHash,hash){
	//New block object
	const newBlock = {
		index : this.chain.length + 1,
		timestamp : Date.now(),
		transactions : this.pendingTransactions,
		nonce: nonce,
		hash : hash,
		prevBlockHash : prevBlockHash
	};
	
	this.pendingTransactions=[];
	this.chain.push(newBlock);

	return newBlock;

}

/*Creation on new transcation,but these transactions are not recorded in Blockchain---pending transactions
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

/*Part of consensus algorithm: it takes a blockchain as an argument and return whether the chain is valid or not.
It validates other chains present inside the network while we compare them to chain of current node.
To validate the legitimacy of a blockchain, we iterate over every block in blockchain and make sure that all hashes align up correctly.
We check that for every block inside the blockchain the prevBlockHash === Hash of the block before that block
*/
Blockchain.prototype.chainIsValid = function(blockchain) {
	var validChain=true;
	for(var i=1;i<blockchain.length;i++){
		const currentBlock=blockchain[i];
		const prevBlock=blockchain[i-1];
		if (currentBlock['prevBlockHash']!== prevBlock['hash']) //invalid chain		
			validChain=false;

		//validate whether current's block data is valid,ie, by rehashing every single block and check it has '0000' initially
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') 
			validChain = false;
		
	}
	
	//Check for block 0---genesis block
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 5;
	const correctPreviousBlockHash = genesisBlock['prevBlockHash'] === '5FECEB66FFC86F38D952786C6D696C79C2DBC239DD4E91B46729D73A27FB57E9';
	const correctHash = genesisBlock['hash'] === '1A6562590EF19D1045D06C4055742D38288E9E6DCD71CCDE5CEE80F1D5A774ES';
	const correctTransactions = genesisBlock['transactions'].length === 0;
	
	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) 
		validChain = false;

	
	return validChain;
};


//To get the last block insterted into Blockchain
Blockchain.prototype.getLastBlock = function(){
	var idx = this.chain.length-1;
		return this.chain[idx];
}

//Inside this method we will iterate through our entire blockchain and search for the block corresponding to this blockHash
Blockchain.prototype.getBlock = function(blockHash) {
	var correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};

/*Get specific transaction by passing in the transactionID. Inside this method we will iterate through our entire blockchain 
and search for a particular transaction. Then for each block's transaction we iterate over and find for the matching transcationId which correpons to requested transcation details
if there is no transaction corresponding to transactionID we get both block and transcation as null
*/
Blockchain.prototype.getTransaction = function(transactionId) {
	var correctTransaction = null;
	var correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};

/*
To get data/transactions associated with an address this method takes address as an argument. All the data retrieved will be put in an array and send to the user
We iterate through all the transactions inside our blockchain and any of them if have this adress as sender or recipient will then be put in the array.
For each transcation put in array we calculate what amount of energy user send or received to know his energy reservoir on that address
the balance amount is also sent along transaction array.
*/
Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	var balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};

//To export the Blockchain constructor function to be used in other js files
module.exports=Blockchain;