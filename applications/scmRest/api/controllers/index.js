'use strict'
const path = require('path')
const connector = require(path.join(__dirname, '/lib/connector'))

// const userName = 'User1@org1.example.com';

module.exports = {
  getShipmentById: getAssetById,
  getStockById: getAssetById,
  getForecastById: getAssetById,

  createShipment: createAsset,
  createStock: createAsset,
  createForecast: createAsset,

  updateShipment: updateAsset,
  updateStock: updateAsset,
  updateForecast: updateAsset,

  deleteShipmentbyId: deleteAsset,
  deleteStockById: deleteAsset,
  deleteForecastById: deleteAsset,

  getAllShipments: getAllAssetsByClass,
  getAllStocks: getAllAssetsByClass,
  getAllForecasts: getAllAssetsByClass,

  getShipmentHistory: getAssetHistory,
  getStockHistory: getAssetHistory,
  getForecastHistory: getAssetHistory,

  getAssetsByQuery: getAssetsByQuery,

  createInvoice: createPrivateAsset,
  getInvoiceById: getPrivateAssetById,

  getCreditNoteById: getPrivateAssetById,

  signIn: signIn,
  signOut: signOut,

  withdrawStock: withdrawStock,
  adjustLimits: adjustLimits,
  createCreditNote: createCreditNote,
  sendShipment: sendShipment,
  addMonthlyForecast: addMonthlyForecast,
  updateMonthlyForecast: updateMonthlyForecast,
  deleteMonthlyForecast: deleteMonthlyForecast,
  approveMonthlyForecast: approveMonthlyForecast,
  declineMonthlyForecast: declineMonthlyForecast,
  receiveShipment: receiveShipment,

  getAllMaterials: getAllMaterials
}

function getAssetById (req, res) {
  let Id = req.swagger.params.Id.value
  let assetClass = req.swagger.params.assetClass.value
  const args = ['getAsset', assetClass, Id]
  connector.query(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function createAsset (req, res) {
  let assetData = req.swagger.params.asset.value
  const args = ['createAsset', JSON.stringify(assetData)]
  connector.submit(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function updateAsset (req, res) {
  let assetData = req.swagger.params.asset.value
  const args = ['updateAsset', JSON.stringify(assetData)]
  connector.submit(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function deleteAsset (req, res) {
  let Id = req.swagger.params.Id.value
  let assetClass = req.swagger.params.assetClass.value
  const args = ['deleteAsset', assetClass, Id]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function getAllAssetsByClass (req, res) {
  let assetClass = req.swagger.params.assetClass.value
  const args = ['getAllAssetsByClass', assetClass]
  connector.query(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function getAssetsByQuery (req, res) {
  let queryString = req.swagger.params.queryString.value
  const args = ['getAssetsByQuery', queryString]
  connector.query(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function getAssetHistory (req, res) {
  console.log(req.swagger.params.Id.value)
  let Id = req.swagger.params.Id.value
  let assetClass = req.swagger.params.assetClass.value
  const args = ['getAssetHistory', assetClass, Id]
  connector.query(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function createPrivateAsset (req, res) {
  console.log(req.headers.cookie)
  let assetData = req.swagger.params.asset.value
  const args = ['createPrivateAsset', JSON.stringify(assetData)]
  connector.submit(getUserName(req), args).then(result => { res.status(201).json(result) }).catch(err => { res.send(err) })
}

function getPrivateAssetById (req, res) {
  let Id = req.swagger.params.Id.value
  let assetClass = req.swagger.params.assetClass.value
  let collection = req.swagger.params.collection.value
  const args = ['getPrivateAsset', assetClass, Id, collection]
  console.log(args)
  connector.query(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function signIn (req, res) {
  let user = req.swagger.params.userName.value
  res.cookie('userName', user, { maxAge: 900000000, httpOnly: false })
  let x = {
    'success': 0,
    'description': 'Signed in as ' + user
  }
  res.status(200).send(x)
}

function signOut (req, res) {
  res.clearCookie('userName')
  let x = {
    'success': 0,
    'description': 'Signed out'
  }
  res.status(200).send(x)
}

function withdrawStock (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['withdrawStock', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function adjustLimits (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['adjustLimits', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function createCreditNote (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['createCreditNote', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function sendShipment (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['sendShipment', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function receiveShipment (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['receiveShipment', data.shipmentId]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function addMonthlyForecast (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['addMonthlyForecast', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function updateMonthlyForecast (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['updateMonthlyForecast', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function approveMonthlyForecast (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['approveMonthlyForecast', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function deleteMonthlyForecast (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['deleteMonthlyForecast', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function declineMonthlyForecast (req, res) {
  let data = req.swagger.params.txData.value
  const args = ['declineMonthlyForecast', JSON.stringify(data)]
  connector.submit(getUserName(req), args).then(result => { res.status(200).json(result) }).catch(err => { res.send(err) })
}

function getUserName (req) {
  let cookie = req.headers.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'))
  if (cookie) { return decodeURIComponent(cookie[2]) };
}

function getAllMaterials (req, res) {
  let supplierId = req.swagger.params.supplierId.value
  let queryString = { 'selector': { 'class': { '$eq': 'org.warehousenet.stock' }, 'supplierId': { '$eq': supplierId } } }
  const args = ['getAssetsByQuery', JSON.stringify(queryString)]
  let materials = []
  connector.query(getUserName(req), args).then(result => {
    result.forEach(element => {
      materials.push(element.Record.materialId)
    })
    res.status(200).send(materials)
  }).catch(err => { res.send(err) })
}
