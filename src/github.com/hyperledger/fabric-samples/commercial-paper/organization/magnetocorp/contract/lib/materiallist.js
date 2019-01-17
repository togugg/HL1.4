/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Material = require('./material.js');

class MaterialList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.materialnet.materiallist');
        this.use(Material);
    }

    async addMaterial(material) {
        return this.addState(material);
    }

    async getMaterial(materialKey) {
        return this.getState(materialKey);
    }

    async updateMaterial(material) {
        return this.updateState(material);
    }

    async deleteMaterial(material) {
        return this.deleteState(material);
    }

    async getMaterialsByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getMaterialHistory(queryString) {
        return this.getStateHistory(queryString);
    }
}


module.exports = MaterialList;
