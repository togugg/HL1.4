/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paper.js
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * Invoice class extends State class
 * Class will be used by application and smart contract to define a invoice
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
     * Deserialize a state data to invoice
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Invoice);
    }

    /**
     * Factory method to create a invoice object
     */
    static createInstance(invoiceData) {
        return new Invoice(invoiceData);
    }

    static getClass() {
        return 'org.warehousenet.invoice';
    }
}

module.exports = Invoice;
