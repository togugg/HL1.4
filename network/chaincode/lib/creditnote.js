/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paper.js
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * CreditNote class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CreditNote extends State {

    constructor(obj) {
        super(CreditNote.getClass(), [obj.creditNoteId]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        return CreditNote.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to CreditNote
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Invoice);
    }

    /**
     * Factory method to create a cCreditNote object
     */
    static createInstance( creditNoteData ) {
        return new CreditNote( creditNoteData );
    }

    static getClass() {
        return 'org.warehousenet.creditNote';
    }
}

module.exports = CreditNote;
