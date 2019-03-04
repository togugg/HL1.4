/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paper.js
*/

'use strict';

// Enumerate state values
const cpState = {
    SENT: 1,
    RECEIVED: 2
}

// Utility class for ledger state
const State = require('./../ledger-api/state.js')

/**
 * Shipping class extends State class
 * Class will be used by application and smart contract to define a shipping
 */
class Shipping extends State {

    constructor(obj) {
        super(Shipping.getClass(), [obj.shippingId])
        Object.assign(this, obj)
    }

    /**
     * Set shipping as sent
     * @param {String} now timestamp
     * @param {String} invoiceId to add to the shipping
     */
    setSent(now, invoiceId) {
        // Set state to sent
        this.state = cpState.SENT
        this.sentDate = now
        this.invoiceId = invoiceId
    }

    /**
     * Set shipping as received
     * @param {String} now timestamp
     */
    setReceived(now) {
        // Set state to received
        this.state = cpState.RECEIVED
        this.receivedDate = now
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    /**
     * Factory method to create a shipping object
     */
    static createInstance(assetData) {
        return new Shipping(assetData)
    }

    static getClass() {
        return 'org.warehousenet.shipping'
    }
}

module.exports = Shipping
