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
        super(Stock.getClass(), [obj.matNr, obj.supplier]);
        Object.assign(this, obj);
    }

    addQuantity(newQuantity) {
        this.stock = ((+this.quantity) + (+newQuantity)).toString();
    }

    static fromBuffer(buffer) {
        return Stock.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Stock);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(matNr, supplier, matDesc, min, max, quantity, location) {
        return new Stock({ matNr, supplier, matDesc, min, max, quantity, location });
    }

    static getClass() {
        return 'org.warehousenet.stock';
    }
}

module.exports = Stock;
