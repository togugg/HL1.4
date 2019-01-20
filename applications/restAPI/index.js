const connector = require('./lib/connector.js');

const userName = 'User1@org1.example.com';

const args = ['createStock', '2', '2', 'this is a material', '5', '10', '7', 'home']

/* var query = { "selector": { "matDesc": { "$eq": "this is a materials" } } }
const args = ['getMaterialsByQuery', JSON.stringify(query)] */

//const args = ['getAllMaterials', '2223', 'haa', 'this is a material', '5', '10', '7', 'home']

//const args = ['updateMaterial', '2', '2', 'this is a materials', '5', '10', '7', 'home']

//const args = ['deleteMaterial', '2', '2']
//const args = ['getMaterial', '2', '2']

//const args = ['createShipping', '2', '2', '500']
//const args = ['sendShipping', '897000000', "ganz viel data"]
//const args = ['receiveShipping', '0']

//const args = ['getIdentity']


connector.main(userName, args).then(() => {
  console.log('Issue program complete.');
})
