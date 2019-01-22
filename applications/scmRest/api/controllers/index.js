'use strict';

const connector = require(__dirname+'/lib/connector')

const userName = 'User1@org1.example.com';

module.exports = {
  getShippingById: getAssetById,
  getStockById: getAssetById,
  createShipping: createAsset,
  createStock: createAsset,
  updateShipping: updateAsset,
  updateStock: updateAsset,
  deleteShippingbyId: deleteAsset,
  deleteStockById: deleteAsset,
  getAllShippings: getAllAssetsByClass,
  getAllStocks: getAllAssetsByClass,
  createInvoice: createInvoice
};


function getAssetById(req, res) {
	let Id = req.swagger.params.Id.value
	let assetClass = req.swagger.params.assetClass.value
	const args = ['getAsset', assetClass, Id]
	connector.query(userName, args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function createAsset(req, res) {
	let assetData = req.swagger.params.asset.value
	const args = ['createAsset', JSON.stringify(assetData)] 
	connector.submit(userName, args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function updateAsset(req, res) {
	let assetData = req.swagger.params.asset.value
	const args = ['updateAsset', JSON.stringify(assetData)] 
	connector.submit(userName, args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function deleteAsset(req, res) {
	let Id = req.swagger.params.Id.value
	let assetClass = req.swagger.params.assetClass.value
	const args = ['deleteAsset', assetClass, Id]
	connector.submit(userName, args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function getAllAssetsByClass(req, res) {
	let assetClass = req.swagger.params.assetClass.value
	const args = ['getAllAssetsByClass', assetClass] 
	connector.query(userName, args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function createInvoice(req, res) {
	let assetData = req.swagger.params.asset.value
	const args = ['createInvoice', JSON.stringify(assetData)] 
	connector.submit(userName, args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}



function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}
