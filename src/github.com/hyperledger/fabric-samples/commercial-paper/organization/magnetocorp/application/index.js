const connector = require('./lib/connector.js');

const userName = 'User1@org1.example.com';

//const args = ['createMaterial', '2', '2', 'this is a material', '5', '10', '7', 'home']

/* var query = { "selector": { "matDesc": { "$eq": "this is a materials" } } }
const args = ['getMaterialsByQuery', JSON.stringify(query)] */

//const args = ['getAllMaterials', '2223', 'haa', 'this is a material', '5', '10', '7', 'home']

//const args = ['updateMaterial', '2223', 'haa', 'this is a materials', '5', '10', '7', 'home']

//const args = ['getMaterialHistory', '1', '2']

//const args = ['createSupply', '2', '2', '500']

const args = ['receiveSupply', '1547735334386']

connector.main(userName, args).then(() => {
  console.log('Issue program complete.');
})
