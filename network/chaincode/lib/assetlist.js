/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Shipping = require('./shipping.js');
const Stock = require('./stock.js')

class AssetList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.assetlist');
        this.use(Shipping);
        this.use(Stock);
    }

    async addAsset(asset) {
        return this.addState(asset);
    }

    async getAsset(assetKey) {
        return this.getState(assetKey);
    }

    async updateAsset(asset) {
        return this.updateAsset(asset);
    }

    async deleteAsset(assetKey) {
        return this.deleteState(assetKey);
    }

    async getAssetByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getAssetHistory(assetKey) {
        return this.getStateHistory(assetKey);
    }
}


module.exports = AssetList;
