const fs = require('fs');
const { FileSystemWallet, Gateway } = require('fabric-network');

const userName = 'User1@org1.example.com';

const wallet = new FileSystemWallet(__dirname + '/../wallet');


const ccpFile = fs.readFileSync(__dirname + '/../gateway/network.json');
const ccp = JSON.parse(ccpFile.toString());


let connectionOptions = {
  identity: userName,
  wallet: wallet,
  discovery: { enabled: false, asLocalhost: false }
};

async function main() {

  const gateway = new Gateway();
  await gateway.connect(ccp, connectionOptions)

  network = await gateway.getNetwork('mychannel')
  eventHub = network.getChannel().getChannelEventHub('peer0.org1.example.com')
  eventHub.connect(true)
  eventHub.registerChaincodeEvent('warehousecontract', 'shippingEvent', function (chaincodeEvent, blockNr, txId, status) {
    console.log(JSON.parse(chaincodeEvent.payload.toString()));
    console.log(blockNr),
      console.log(txId),
      console.log(status)
    process.exit()
  }, function (err) { console.log(err) },)


  process.on('exit', function () {
    eventHub.disconnect();
  });

}

main()
