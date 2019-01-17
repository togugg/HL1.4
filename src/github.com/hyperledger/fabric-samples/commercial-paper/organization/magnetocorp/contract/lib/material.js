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
class Material extends State {

    constructor(obj) {
        super(Material.getClass(), [obj.matNr, obj.supplier]);
        Object.assign(this, obj);
    }

    addStock(newStock) {
        this.stock = ((+this.stock) + (+newStock)).toString();
    }

    static fromBuffer(buffer) {
        return Material.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Material);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(matNr, supplier, matDesc, min, max, stock, location) {
        return new Material({ matNr, supplier, matDesc, min, max, stock, location });
    }

    static getClass() {
        return 'org.materialnet.material';
    }
}

module.exports = Material;
