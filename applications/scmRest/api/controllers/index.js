'use strict';

const connector = require(__dirname + '/lib/connector')

//const userName = 'User1@org1.example.com';

module.exports = {
	getShippingById: getAssetById,
	getStockById: getAssetById,
	getForecastById: getAssetById,

	createShipping: createAsset,
	createStock: createAsset,
	createForecast: createAsset,

	updateShipping: updateAsset,
	updateStock: updateAsset,
	updateForecast: updateAsset,

	deleteShippingbyId: deleteAsset,
	deleteStockById: deleteAsset,
	deleteForecastById: deleteAsset,

	getAllShippings: getAllAssetsByClass,
	getAllStocks: getAllAssetsByClass,
	getAllForecasts: getAllAssetsByClass,

	getShippingHistory: getAssetHistory,
	getStocksHistory: getAssetHistory,
	getForecastHistory: getAssetHistory,

	createInvoice: createInvoice,
	signIn: signIn,
	signOut: signOut,

	sendShipping: sendShipping,
	addMonthlyData: addMonthlyData
};


function getAssetById(req) {
	let Id = req.swagger.params.Id.value
	let assetClass = req.swagger.params.assetClass.value
	const args = ['getAsset', assetClass, Id]
	connector.query(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function createAsset(req, res) {
	let assetData = req.swagger.params.asset.value
	const args = ['createAsset', JSON.stringify(assetData)]
	connector.submit(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function updateAsset(req, res) {
	let assetData = req.swagger.params.asset.value
	const args = ['updateAsset', JSON.stringify(assetData)]
	connector.submit(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function deleteAsset(req, res) {
	let Id = req.swagger.params.Id.value
	let assetClass = req.swagger.params.assetClass.value
	const args = ['deleteAsset', assetClass, Id]
	connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function getAllAssetsByClass(req, res) {
	let assetClass = req.swagger.params.assetClass.value
	const args = ['getAllAssetsByClass', assetClass]
	connector.query(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function getAssetHistory(req, res) {
	let Id = req.swagger.params.Id.value
	let assetClass = req.swagger.params.assetClass.value
	const args = ['getAssetHistory', assetClass, Id]
	connector.query(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function createInvoice(req, res) {
	console.log(req.headers.cookie)
	let assetData = req.swagger.params.asset.value
	const args = ['createInvoice', JSON.stringify(assetData)]
	connector.submit(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function signIn(req, res) {
	let user = req.swagger.params.userName.value
	res.header('Access-Control-Allow-Origin', '*');
	//res.header('Access-Control-Allow-Headers','*');
	//res.header('Access-Control-Allow-Credentials', true);
	//res.header('Access-Control-Allow-Headers', 'Content-Type');
	//res.header('Access-Control-Request-Headers', 'X-Requested-With, accept, content-type');
	res.cookie('userName', user, { maxAge: 900000000, httpOnly: false })
	let x = {
		"success": 0,
		"description": "Signed in as " + user
	}
	res.status(200).send(x)
}

function signOut(req, res) {
	res.clearCookie('userName')
	let x = {
		"success": 0,
		"description": "Signed out"
	}
	res.status(200).send(x)
}

function sendShipping(req, res) {
	let data = req.swagger.params.txData.value;
	const args = ['sendShipping',  JSON.stringify(data)];
	connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function addMonthlyData(req, res) {
	let data = req.swagger.params.txData.value;
	const args = ['addMonthlyData',  JSON.stringify(data)];
	connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function getUserName(req) {
	let cookie = req.headers.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'));
	if (cookie) { return decodeURIComponent(cookie[2]) };
}

