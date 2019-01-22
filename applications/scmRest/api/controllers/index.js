'use strict';

const connector = require(__dirname+'/lib/connector')

const userName = 'User1@org1.example.com';

module.exports = {
  getShippingById: getAssetById,
  getStockById: getAssetById,
  createShipping: createAsset,
  createStock: createAsset
};


function getAssetById(req, res) {
	let Id = req.swagger.params.Id.value
	let assetClass = req.swagger.params.assetClass.value
	const args = ['getAsset', assetClass, Id]
	connector.query(userName, args).then(result => { res.json(result) }).catch(err => { res.send(err) })
}

function createAsset(req, res) {
	let assetData = req.swagger.params.asset.value
	const args = ['createAsset', JSON.stringify(assetData)] 
	connector.submit(userName, args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}



function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}
