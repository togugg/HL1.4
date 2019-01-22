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
class Asset extends State {

    constructor(obj) {
        super(obj.class, [obj.AssetNr]);
        Object.assign(this, obj);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(assetData) {
        return new Asset(assetData);
    }
}

module.exports = Asset;
