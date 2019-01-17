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
const Material = require('../../contract/lib/material.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('./wallet');

// Main program function
async function main(userName, args) {

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {

    // Specify userName for network access
    // const userName = 'isabella.issuer@magnetocorp.com';
    // const userName = 'User1@org1.example.com';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: false, asLocalhost: true }
    };

    // Connect to gateway using application specified parameters
    console.log('Connect to Fabric gateway.');

    await gateway.connect(connectionProfile, connectionOptions);

    // Access PaperNet network
    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');

    // Get addressability to commercial paper contract
    console.log('Use org.materialnet.material smart contract.');

    const contract = await network.getContract('materialcontract', 'org.materialnet.material');

    // issue commercial paper
    console.log('Submit commercial paper issue transaction.');

    const issueResponse = await contract.submitTransaction.apply(contract, args);

    // process response
    console.log('Process issue transaction response.');
    let buffer = Buffer.from(JSON.parse(issueResponse))
    console.log(JSON.parse(buffer.toString()))

    console.log('Transaction complete.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    gateway.disconnect();

  }
}

/* main().then(() => {

  console.log('Issue program complete.');

}).catch((e) => {

  console.log('Issue program exception.');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);

}); */

module.exports = {
  main: main
};
