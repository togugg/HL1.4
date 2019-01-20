/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Stock = require('./stock.js');

class StockList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.stocklist');
        this.use(Stock);
    }

    async addStock(stock) {
        return this.addState(stock);
    }

    async getStock(stockKey) {
        return this.getState(stockKey);
    }

    async updateStock(stock) {
        return this.updateState(stock);
    }

    async deleteStock(stock) {
        return this.deleteState(stock);
    }

    async getStocksByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getStockHistory(queryString) {
        return this.getStateHistory(queryString);
    }
}


module.exports = StockList;
