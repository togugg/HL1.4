/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Supply = require('./supply.js');

class SupplyList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.materialnet.supplylist');
        this.use(Supply);
    }

    async addSupply(supply) {
        return this.addState(supply);
    }

    async getSupply(supplyKey) {
        return this.getState(supplyKey);
    }

    async updateSupply(supply) {
        return this.updateState(supply);
    }

    async deleteSupply(supply) {
        return this.deleteState(supply);
    }

    async getSupplysByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getSupplyHistory(queryString) {
        return this.getStateHistory(queryString);
    }
}


module.exports = SupplyList;
