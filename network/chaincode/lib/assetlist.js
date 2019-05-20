/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paperlist.js
*/

'use strict'

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js')

const Shipment = require('./shipment.js')
const Stock = require('./stock.js')

class AssetList extends StateList {
  constructor (ctx) {
    super(ctx, 'org.warehousenet.assetlist')
    // Registers classes
    this.use(Shipment)
    this.use(Stock)
  }

  async addAsset (asset) {
    return this.addState(asset)
  }

  async getAsset (assetClass, assetKey) {
    return this.getState(assetClass, assetKey)
  }

  async updateAsset (asset) {
    return this.updateState(asset)
  }

  async deleteAsset (assetClass, assetKey) {
    return this.deleteState(assetClass, assetKey)
  }

  async getAssetsByQuery (queryString) {
    return this.getStatesByQuery(queryString)
  }

  async getAssetHistory (assetClass, assetKey) {
    return this.getStateHistory(assetClass, assetKey)
  }

  async getAllAssetsByClass (assetClass) {
    return this.getAllStatesByClass(assetClass)
  }
}

module.exports = AssetList
