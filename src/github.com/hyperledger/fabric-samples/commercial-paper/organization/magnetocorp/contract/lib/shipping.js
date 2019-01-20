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
        super(Shipping.getClass(), [obj.shippingNr]);
        Object.assign(this, obj);
    }

    setSent() {
        this.currentState = cpState.SENT;
        this.sentDate = Date.now().toString();
    }

    setReceived() {
        this.currentState = cpState.RECEIVED;
        this.receivedDate = Date.now().toString();
    }

    static fromBuffer(buffer) {
        return Shipping.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Shipping);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(matNr, supplier, stock) {
        let shippingNr = Date.now().toString();
        return new Shipping({ shippingNr, matNr, supplier, stock });
    }

    static getClass() {
        return 'org.warehousenet.shipping';
    }
}

module.exports = Shipping;
