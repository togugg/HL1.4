/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paperlist.js
*/

'use strict';

// Utility class for collections of private ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Invoice = require('./invoice.js');
const CreditNote = require('./creditnote.js');


class PrivateAssetList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.privateassetlist');
        // Registers classes
        this.use(Invoice);
        this.use(CreditNote);
    }

    async addAsset(asset) {
        return this.addPrivateData(asset);
    }

    async getAsset(assetClass, assetKey, collection) {
        return this.getPrivateData(assetClass, assetKey, collection);
    }

}


module.exports = PrivateAssetList;
