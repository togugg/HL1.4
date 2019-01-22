/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * Commi
 */

'use strict';


// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet(__dirname+'/../wallet');

// Main program function
async function main(userName, args, method) {

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {

    // Specify userName for network access
    // const userName = 'isabella.issuer@magnetocorp.com';
    // const userName = 'User1@org1.example.com';

    // Load connection profile; will be used to locate a gateway
    //let connectionProfile = yaml.safeLoad(fs.readFileSync(__dirname+'/../gateway/networkConnection.yaml', 'utf8'));
    const ccpFile = fs.readFileSync(__dirname+'/../gateway/network.json');
    const ccp = JSON.parse(ccpFile.toString());

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: false, asLocalhost: false }
    };

    // Connect to gateway using application specified parameters
    console.log('Connect to Fabric gateway.');

    await gateway.connect(ccp, connectionOptions);

    //await gateway.connect(connectionProfile, connectionOptions);

    // Access PaperNet network
    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');

    // Get addressability to commercial paper contract
    console.log('Use org.warehousenet.warehouse smart contract.');

    const contract = await network.getContract('warehousecontract', 'org.warehousenet.warehouse');

    // issue commercial paper
    console.log(`Submit ${args[0]} transaction.`);


    if (method == "submit") {
      var issueResponse = await contract.submitTransaction.apply(contract, args);
    }
    else if (method == "query") {
      var issueResponse = await contract.evaluateTransaction.apply(contract, args)
      //var issueResponse = await contract.evaluateTransaction.apply(contract, args)
    }


    // process response
    console.log('Process issue transaction response.');
    let buffer = Buffer.from(JSON.parse(issueResponse))
    let jsonResponse = JSON.parse(buffer.toString())
    console.log(jsonResponse)
    console.log('Transaction complete.');

    return jsonResponse


  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    return (error.message)

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    gateway.disconnect();

  }
}

async function query(userName, args) {
  return main(userName, args, 'query')
}

async function submit(userName, args) {
  return main(userName, args, 'submit')
}


module.exports = {
  query: query,
  submit: submit
};
