const connector = require('./lib/connector.js');

const userName = 'User1@org1.example.com';

const args = ['createMaterial', '234234', '2', 'this is a material', '5', '10', '7', 'home']

/* var query = { "selector": { "matDesc": { "$eq": "this is a materials" } } }
const args = ['getMaterialsByQuery', JSON.stringify(query)] */

//const args = ['getAllMaterials', '2223', 'haa', 'this is a material', '5', '10', '7', 'home']

//const args = ['updateMaterial', '2', '2', 'this is a materials', '5', '10', '7', 'home']

//const args = ['deleteMaterial', '2', '2']
//const args = ['getMaterial', '2', '2']

//const args = ['createShipping', '2', '2', '500']
//const args = ['sendShipping', '1547761926172']
//const args = ['receiveShipping', '1547761926172']

connector.main(userName, args).then(() => {
  console.log('Issue program complete.');
})
