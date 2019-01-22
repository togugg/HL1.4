/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Stock extends State {

    constructor(obj) {
        super(Stock.getClass(), [obj.stockId]);
        Object.assign(this, obj);
    }

    addQuantity(newQuantity) {
        this.stock = ((+this.quantity) + (+newQuantity)).toString();
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(assetData) {
        return new Stock(assetData);
    }

    static getClass() {
        return 'org.warehousenet.stock';
    }
}

module.exports = Stock;
