

/* 
 1) const waveContractFactory = await hexStripZeros.ethers.getContractFactory('WavePortal');
 compile our contract and generate the necessary files we need to work with 
 our contract under the artifacts directory.

 2) const waveContract = await waveContractFactory.deploy();
 Hardhat will create a local Ethereum network for us, but just for this contract. 
 Then, after the script completes it'll destroy that local network. 
 So, every time you run the contract, it'll be a fresh blockchain. What's the point? 
 It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.

 3) await waveContract.deployed();
 We'll wait until our contract is officially deployed to our local blockchain! 
 Our constructor runs when we actually deploy.

 4) console.log("Contract deployed to:", waveContract.address);
 Finally, once it's deployed waveContract.address  will basically give us 
 the address of the deployed contract. This address is how we can actually find 
 our contract on the blockchain. There are millions of contracts on the 
 actual blockchain. So, this address gives us easy access to the contract 
 we're interested in working with! 
 This will be more important a bit later once we deploy to a real Ethereum network.

 5) Run: npx hardhat run scripts/run.js

 6) hre: every time you run a terminal command that starts with 
 npx hardhat you are getting this hre object built on the fly using 
 the hardhat.config.js specified in your code! This means you will 
 never have to actually do some sort of import into your files like:
 const hre = require("hardhat").

 7) const [owner, randomPerson] = await hre.ethers.getSigners();
 In order to deploy something to the blockchain, we need to have a wallet address! 
 Hardhat does this for us magically in the background, but here I grabbed the 
 wallet address of contract owner and I also grabbed a random wallet 
 address and called it randomPerson .

 8) console.log("Contract deployed by:", owner.address);
 To see the address of the person deploying our contract.

 9) let waveCount;...
 Basically, we need to manually call our functions! 
 Just like we would any normal API. First I call the function to grab 
 the # of total waves. Then, I do the wave. Finally, I grab the waveCount 
 one more time to see if it changed.

 10) waveTxn = await waveContract.connect(randomPerson).wave();...
 how we can simulate other people hitting our functions :). Keep an eye on 
 the wallet addresses in your terminal once you change the code and run it.
*/


const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  console.log('Contract addy:', waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  
   
  const waveTxn = await waveContract.wave('This is wave #1');
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave('This is wave #2');
  await waveTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
