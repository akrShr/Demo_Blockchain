//import Blockchain constructor function
const Blockchain = require('./blockchain');
const energy = new Blockchain();

console.log(energy);

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
console.log("Amount of last transaction is "+energy.getLastBlock()['transcations'][0]['amount'])
*/