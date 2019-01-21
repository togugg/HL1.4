const connector = require('./lib/connector.js');

const userName = 'User1@org1.example.com';

/*  asset = {
  "class":"org.warehousenet.shipping",
  "shippingNr":"home",
  "matDesc":"this is a material",
  "matNr":"223",
  "max":"10",
  "min":"5",
  "quantity":"7",
  "supplier":"2"
  }

const args = ['createAsset', JSON.stringify(asset)] */

const args = ['getAsset', 'homes']

//const args = ['deleteAsset', 'home']


/* var query = { "selector": { "matDesc": { "$eq": "this is a materials" } } }
const args = ['getMaterialsByQuery', JSON.stringify(query)] */

//const args = ['getAllMaterials', '2223', 'haa', 'this is a material', '5', '10', '7', 'home']

//const args = ['updateMaterial', '2', '2', 'this is a materials', '5', '10', '7', 'home']

//const args = ['deleteMaterial', '2', '2']
//const args = ['getAsset', '223:2']

//const args = ['createShipping', '2', '2', '500']
//const args = ['sendShipping', '897000000', "ganz viel data"]
//const args = ['receiveShipping', '0']

//const args = ['getIdentity']


connector.submit(userName, args).then(() => {
  console.log('Issue program complete.');
})
