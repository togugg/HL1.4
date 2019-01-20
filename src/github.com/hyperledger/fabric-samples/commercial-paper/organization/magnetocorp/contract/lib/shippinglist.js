/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Shipping = require('./shipping.js');

class ShippingList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.shippinglist');
        this.use(Shipping);
    }

    async addShipping(shipping) {
        return this.addState(shipping);
    }

    async getShipping(shippingKey) {
        return this.getState(shippingKey);
    }

    async updateShipping(shipping) {
        return this.updateState(shipping);
    }

    async deleteShipping(shipping) {
        return this.deleteState(shipping);
    }

    async getShippingsByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getShippingHistory(shippingKey) {
        return this.getStateHistory(shippingKey);
    }
}


module.exports = ShippingList;
