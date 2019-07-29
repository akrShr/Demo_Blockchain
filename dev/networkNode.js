const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const uuid = require('uuid/v1');
const rp = require('request-promise');
const nodeAddress = uuid().split('-').join('');

//To make the API run on different ports
const port = process.argv[2];

const Blockchain = require('./blockchain');
const energy = new Blockchain();

//If a request comes with a json data or form-data, we should be able to parse it it any of these endpoints
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));



 //Fetch entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(energy)
});

//Create new transcations
app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
	const blockIndex = energy.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: 'Transaction will be added when block will be mined' });
});


// broadcast transaction
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = energy.createNewTransaction(req.body.amount, req.body.sender, req.body.receiver);
	energy.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	energy.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'Transaction created and broadcast successfully.' });
	});
});




//Create new block
app.get('/mine', function (req, res) {
  const previousBlockHash = energy.getLastBlock()['hash']
  const currentBlockData = {
	  transactions : energy.pendingTransactions,
	  index : energy.getLastBlock()['index'] + 1
  };

  const nonce = energy.remining(previousBlockHash,currentBlockData);
  const currentBlockHash=energy.hashBlock(previousBlockHash,currentBlockData,nonce)

  const newBlock = energy.createNewBlock(nonce,previousBlockHash,currentBlockHash); 

	const requestPromises = [];
	energy.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receiveNewBlock',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: energy.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 10,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};

		return rp(requestOptions);
	})
	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock

		});
	});
});


// receive new block
app.post('/receiveNewBlock', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = energy.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.prevBlockHash; 
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		energy.chain.push(newBlock);
		energy.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

//Create a decentralized network and register the new nodes present in the network on it's server and broadcast them to the whole network
app.post('/registerBroadcastNode', function (req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (energy.networkNodes.indexOf(newNodeUrl) == -1) energy.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	energy.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/registerNode',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/registerBulkNode',
			method: 'POST',
			body: { allNetworkNodes: [ ...energy.networkNodes, energy.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});

//Register a node with the network-- All other regsitered nodes will accept the newly broadcasted node info on this endpoint
app.post('/registerNode', function (req, res) {

	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = energy.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = energy.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) energy.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
	
});

//Register multiple nodes with the network-- All other regsitered nodes info will be registred on newly created node on this enpoint
app.post('/registerBulkNode', function (req, res) {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = energy.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = energy.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) energy.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});

/* Consensus endpoint---uses isValidChain() method
Make a request to every other node inside of our blockchain network to retrieve their chain datastructure(array).
Then compare those arrays with the chain of the current blockchain which is hosted on the node through which we send request for consensus
*/
app.get('/consensus', function(req, res) {
	const requestPromises = [];
	energy.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

/*We iterate through all the blockchains coming from other nodes inside of our network to verify if there exist a blockchain which is longer
than the copy of blockchain ledger(chain) hosted on current node
*/
	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = energy.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

//Reset variable with info about longest chain variables
		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			};
		});

//If there is no new longest chain or if there is a new longest chain but that chain is invalid then no replacement
		if (!newLongestChain || (newLongestChain && !energy.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: energy.chain
			});
		}
		//Replace with Longest chain rule algo. for consensus inside the network
		else {
			energy.chain = newLongestChain;
			energy.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: energy.chain
			});
		}
	});
});


app.listen(port, function() {
	console.log('Listening on port '+port+' ...');
});