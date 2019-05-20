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
 * Shipment class extends State class
 * Class will be used by application and smart contract to define a shipment
 */
class Shipment extends State {

    constructor(obj) {
        super(Shipment.getClass(), [obj.shipmentId])
        Object.assign(this, obj)
    }

    /**
     * Set shipment as sent
     * @param {String} now timestamp
     * @param {String} invoiceId to add to the shipment
     */
    setSent(now, invoiceId) {
        // Set state to sent
        this.state = cpState.SENT
        this.sentDate = now
        this.invoiceId = invoiceId
    }

    /**
     * Set shipment as received
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
     * Factory method to create a shipment object
     */
    static createInstance(assetData) {
        return new Shipment(assetData)
    }

    static getClass() {
        return 'org.warehousenet.shipment'
    }
}

module.exports = Shipment
