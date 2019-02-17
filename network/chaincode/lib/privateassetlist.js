/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Invoice = require('./invoice.js');
const CreditNote = require('./creditnote.js');


class PrivateAssetList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.privateassetlist');
        this.use(Invoice);
        this.use(CreditNote);
    }

    async addAsset(asset) {
        return this.addPrivateData(asset);
    }

    async getAsset(assetClass, assetKey, collection) {
        return this.getPrivateData(assetClass, assetKey, collection);
    }

/*     async getAsset(assetClass, assetKey) {
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
    } */
}


module.exports = PrivateAssetList;
