/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const cpState = {
    SENT: 1,
    RECEIVED: 2
};

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Shipping extends State {

    constructor(obj) {
        super(Shipping.getClass(), [obj.shippingId]);
        Object.assign(this, obj);
    }

    setSent(now, invoiceNr) {
        this.currentState = cpState.SENT;
        this.sentDate = now;
        this.invoiceNr = invoiceNr;
    }

    setReceived(now) {
        this.currentState = cpState.RECEIVED;
        this.receivedDate = now;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(assetData) {
        return new Shipping(assetData);
    }

    static getClass() {
        return 'org.warehousenet.shipping';
    }
}

module.exports = Shipping;
