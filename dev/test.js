//import Blockchain constructor function
const Blockchain = require('./blockchain');
const energy = new Blockchain();

const block1 = {
"chain": [
{
"index": 1,
"timestamp": 1564372648224,
"transactions": [],
"nonce": 5,
"hash": "1A6562590EF19D1045D06C4055742D38288E9E6DCD71CCDE5CEE80F1D5A774ES",
"prevBlockHash": "5FECEB66FFC86F38D952786C6D696C79C2DBC239DD4E91B46729D73A27FB57E9"
},
{
"index": 2,
"timestamp": 1564372664938,
"transactions": [],
"nonce": 116830,
"hash": "00001efa21fcc54a6c9025c81a6c49a2f7409e35a1f5982b1e86bf80330ed142",
"prevBlockHash": "1A6562590EF19D1045D06C4055742D38288E9E6DCD71CCDE5CEE80F1D5A774ES"
},
{
"index": 3,
"timestamp": 1564374057312,
"transactions": [
{
"amount": 10,
"sender": "00",
"transactionId": "056eb890b1b511e9bf248d5dd771d0a0" 
},
{
"amount": 60,
"sender": "204.17.5.32",
"recipient": "28.20.15.10",
"transactionId": "68c27750b1b611e9bf248d5dd771d0a0"
},
{
"amount": 30,
"sender": "204.17.51.32",
"recipient": "28.22.15.18",
"transactionId": "13171750b1b811e9bf248d5dd771d0a0"
}
],
"nonce": 116728,
"hash": "00000de652b62994258439d4f4791f5e35cc9e34bf256e938dc8a3c578e06950",
"prevBlockHash": "00001efa21fcc54a6c9025c81a6c49a2f7409e35a1f5982b1e86bf80330ed142"
},
{
"index": 4,
"timestamp": 1564374105037,
"transactions": [
{
"amount": 10,
"sender": "00",
"transactionId": "43601560b1b811e9bf248d5dd771d0a0"
},
{
"amount": 40,
"sender": "204.17.51.32",
"recipient": "28.22.15.18",
"transactionId": "489f2980b1b811e9bf248d5dd771d0a0"
},
{
"amount": 15,
"sender": "204.17.51.32",
"recipient": "28.22.15.18",
"transactionId": "4d235210b1b811e9bf248d5dd771d0a0"
},
{
"amount": 70,
"sender": "204.17.51.32",
"recipient": "28.22.15.18",
"transactionId": "550fabe0b1b811e9bf248d5dd771d0a0"
}
],
"nonce": 60047,
"hash": "0000c43c8c93e0202942b2e2489b42ee083588bf7849d1a57f07ccf077638953",
"prevBlockHash": "00000de652b62994258439d4f4791f5e35cc9e34bf256e938dc8a3c578e06950"
},
{
"index": 5,
"timestamp": 1564374108311,
"transactions": [
{
"amount": 10,
"sender": "00",
"transactionId": "5fc89330b1b811e9bf248d5dd771d0a0"
}
],
"nonce": 55095,
"hash": "000043e5736d6217956a4f73dbcbb270d69d6ad9dbe901fee1d9f7d048bf05b1",
"prevBlockHash": "0000c43c8c93e0202942b2e2489b42ee083588bf7849d1a57f07ccf077638953"
},
{
"index": 6,
"timestamp": 1564374154870,
"transactions": [
{
"amount": 10,
"sender": "00",
"transactionId": "61b93fa0b1b811e9bf248d5dd771d0a0"
}
],
"nonce": 34846,
"hash": "00003354cacc84e327738fe7031dc78a1429f1a1db3f52057c59a638a0702fe5",
"prevBlockHash": "000043e5736d6217956a4f73dbcbb270d69d6ad9dbe901fee1d9f7d048bf05b1"
}
],
"pendingTransactions": [
{
"amount": 10,
"sender": "00",
"transactionId": "7d81d3f0b1b811e9bf248d5dd771d0a0"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
};


console.log('Valid ',energy.chainIsValid(block1.chain));

/*
const previousHash='C3CFF08B73FA73D99E2ACE76B15C8F09CD6A95C6F9C27012519C7D3D8D03F37E'
const pendingTransaction = [{
	amount:20,
	sender:'8.20.15.1',
	receiver:'204.17.5.32'
},
{	amount:50,
	sender:'8.20.15.7',
	receiver:'204.17.5.32'
},
{
	amount:80,
	sender:'204.17.5.32',
	receiver:'28.20.15.1'

}];

const nonce = energy.remining(previousHash,pendingTransaction);
var val = energy.hashBlock(previousHash,pendingTransaction,nonce)
console.log(val);



energy.createNewBlock(23,'AUKVROICTMI','SOHMAPRTMSA');

energy.createNewTransactions(10,'8.20.15.1','204.17.5.32 ');

energy.createNewBlock(32,'VKITJWAYGMP','KLSOHRALRJM');

energy.createNewTransactions(20,'8.20.15.1','204.17.5.32 ');
energy.createNewTransactions(30,'8.20.15.1','204.17.5.32 ');
energy.createNewTransactions(50,'8.20.15.1','204.17.5.32 ');

energy.createNewBlock(41,'UGHHJWAYGMH','HGGKKRALRHG');


console.log(energy);
console.log('\n');
console.log(energy.chain[2]);
console.log('\n');
console.log("Amount of last transaction is "+energy.getLastBlock()['transactions'][0]['amount'])
*/