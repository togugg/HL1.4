/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Shipping = require('./shipping.js');
const Stock = require('./stock.js');
const Forecast = require('./forecast.js')


class AssetList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.assetlist');
        this.use(Shipping);
        this.use(Stock);
        this.use(Forecast);
    }

    async addAsset(asset) {
        return this.addState(asset);
    }

    async getAsset(assetClass, assetKey) {
        return this.getState(assetClass, assetKey);
    }

    async updateAsset(asset) {
        return this.updateState(asset);
    }

    async deleteAsset(assetClass, assetKey) {
        return this.deleteState(assetClass, assetKey);
    }

    async getAssetsByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getAssetHistory(assetClass, assetKey) {
        return this.getStateHistory(assetClass, assetKey);
    }

    async getAllAssetsByClass(assetClass) {
        return this.getAllStatesByClass(assetClass);
    }
}


module.exports = AssetList;
