const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var evaluator2 = artifacts.require("Evaluator2.sol");
var exerciceSolution = artifacts.require("ExerciceSolution.sol");

let account;

module.exports = (deployer, network, accounts) => {
    account = accounts[0];
    deployer.then(async () => {
        console.log("hello");
        await deployTDToken(deployer, network, accounts); 
        console.log("hello1");
        await deployEvaluator(deployer, network, accounts); 
        console.log("hello2");
        await setPermissionsAndRandomValues(deployer, network, accounts); 
        console.log("hello3");
        await deployRecap(deployer, network, accounts);
        console.log("hello4");
        await runExercices(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
	// TDToken = await TDErc20.at("0x8B7441Cb0449c71B09B96199cCE660635dE49A1D")
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address)
	// Evaluator = await evaluator.at("0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E");
	Evaluator2 = await evaluator2.new(TDToken.address)
    // Evaluator2 = await evaluator2.at("0x4f82f7A130821F61931C7675A40fab723b70d1B8");
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	await TDToken.setTeacher(Evaluator2.address, true)
    // await TDToken.setTeacher(account, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++)
		{
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*5))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomNames)
	console.log(randomLegs)
	console.log(randomSex)
	console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
	await Evaluator2.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

async function checkBalance() {
    await TDToken.distributeTokens(account, 0);

    const currentBalance = await TDToken.balanceOf(account)
	console.log("Balance " + currentBalance)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
	console.log("Evaluator2 " + Evaluator2.address)

    await checkBalance();
}

async function deployExercice(deployer, network, accounts) {
    ExerciceSolution = await exerciceSolution.new("NFTBaptiste", "NFTB", {from: account})
}

async function runExercices(deployer, network, accounts) {

    console.log("\n## START\n");

    const start_balance = await TDToken.balanceOf(account);
    console.log("Starting balance:" + start_balance);

    await deployExercice(deployer, network, accounts);
    await Evaluator.submitExercice(ExerciceSolution.address, {from: account})

    var new_balance = await TDToken.balanceOf(account);
    console.log("Balance submit ex: " + new_balance);

    console.log("\n## EXERCICE 1\n");

    await ExerciceSolution.mint(Evaluator.address, {from: account});
    await Evaluator.ex1_testERC721({from: account});

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex1: " + new_balance);

    console.log("\n## EXERCICE 2\n");
    
    await Evaluator.ex2a_getAnimalToCreateAttributes();
    const name = await Evaluator.readName(account);
    const legs = await Evaluator.readLegs(account);
    const sex = await Evaluator.readSex(account);
    const wings = await Evaluator.readWings(account);
    await ExerciceSolution.declareAnimalToOwner(Evaluator.address, sex, legs, wings, name);
    const idx = await ExerciceSolution.getActualIdx();
    await Evaluator.ex2b_testDeclaredAnimal(idx);

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex2: " + new_balance);

    console.log("\n## EXERCICE 3\n");

    await web3.eth.sendTransaction({from:account,to:Evaluator.address, value:web3.utils.toBN(web3.utils.toWei('0.01', "ether"))});
    await Evaluator.ex3_testRegisterBreeder();

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex3: " + new_balance);

    console.log("\n## EXERCICE 4\n");

    await Evaluator.ex4_testDeclareAnimal();

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex4: " + new_balance);

    console.log("\n## EXERCICE 5\n");

    await Evaluator.ex5_declareDeadAnimal();

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex5: " + new_balance);

    console.log("\n## EXERCICE 6a\n");

    await Evaluator.ex6a_auctionAnimal_offer();

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex6a: " + new_balance);

    console.log("\n## EXERCICE 6b\n");

    await ExerciceSolution.mintAndPutForSale(account);
    const currIdx = await ExerciceSolution.getActualIdx();
    await ExerciceSolution.approve(Evaluator.address, currIdx);
    await Evaluator.ex6b_auctionAnimal_buy(currIdx);

    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex6b: " + new_balance);

    console.log("\n## EXERCICE 7a\n");

    
    
    new_balance = await TDToken.balanceOf(account);
    console.log("Balance ex6b: " + new_balance);
}


