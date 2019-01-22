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
class Invoice extends State {

    constructor(obj) {
        super(Invoice.getClass(), [obj.invoiceId]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        return Invoice.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Invoice);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance( invoiceData ) {
        return new Invoice( invoiceData );
    }

    static getClass() {
        return 'org.warehousenet.invoice';
    }
}

module.exports = Invoice;
