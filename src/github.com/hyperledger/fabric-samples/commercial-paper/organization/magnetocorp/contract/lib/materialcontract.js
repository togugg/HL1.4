/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric client identity class
const ClientIdentity = require('fabric-shim').ClientIdentity;

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// SupplyNet specifc classes
const Material = require('./material.js');
const MaterialList = require('./materiallist.js');
const Supply = require('./supply.js');
const SupplyList = require('./supplylist.js');

/**
 * A custom context provides easy access to list of all materials
 */
class MaterialContext extends Context {
    constructor() {
        super();
        // All papers are held in a list of papers
        this.materialList = new MaterialList(this);
        this.supplyList = new SupplyList(this)
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class MaterialContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.materialnet.material');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new MaterialContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contr22act');
    }

    async createSupply(ctx, matNr, supplier, stock) {

        // create an instance of the paper
        let supply = Supply.createInstance(matNr, supplier, stock);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.supplyList.addSupply(supply)

        // Must return a serialized paper to caller of smart contract
        return supply.toBuffer();
    }

    async sendSupply(ctx, supplyNr) {
        let supplyKey = Supply.makeKey([supplyNr]);
        let supply = await ctx.supplyList.getSupply(supplyKey);
        supply.setSent()
        await ctx.supplyList.updateSupply(supply)
        return supply.toBuffer()
    }

    async receiveSupply(ctx, supplyNr) {
        let supplyKey = Supply.makeKey([supplyNr]);
        let supply = await ctx.supplyList.getSupply(supplyKey);
        supply.setReceived()
        await ctx.supplyList.updateSupply(supply)
        let materialKey = Material.makeKey([supply.matNr, supply.supplier]);
        let material = await ctx.materialList.getMaterial(materialKey);
        material.addStock(supply.stock)
        await ctx.materialList.updateMaterial(material);
        return supply.toBuffer()
    }

    /**
     * Issue commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} issueDateTime paper issue date
     * @param {String} maturityDateTime paper maturity date
     * @param {Integer} faceValue face value of paper
    */
    async createMaterial(ctx, matNr, supplier, matDesc, min, max, stock, location) {

        // create an instance of the paper
        let material = Material.createInstance(matNr, supplier, matDesc, min, max, stock, location);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.materialList.addMaterial(material);

        // Must return a serialized paper to caller of smart contract
        return material.toBuffer();
    }

    async updateMaterial(ctx, matNr, supplier, matDesc, min, max, stock, location) {

        // create an instance of the material
        let material = Material.createInstance(matNr, supplier, matDesc, min, max, stock, location);

        // Updates the material in the ledger world state
        await ctx.materialList.updateMaterial(material);

        // Must return a serialized material to caller of smart contract
        return material.toBuffer();
    }

    async deleteMaterial(ctx, matNr, supplier) {

        // create an instance of the material
        let materialKey = Material.makeKey([matNr, supplier]);

        // Updates the material in the ledger world state
        let material = await ctx.materialList.deleteMaterial(materialKey);

        // Must return a serialized material to caller of smart contract
        return material.toBuffer();
    }

    /**
     * Get all commercial papers
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
    */
    async getMaterialsByQuery(ctx, queryString) {
        //let cid = new ClientIdentity(ctx.stub); 
        //console.log(cid.getAttributeValue("email"))
        //let matKey = CommercialPaper.makeKey([issuer]);
        let materials = await ctx.materialList.getMaterialsByQuery(queryString);
        return Buffer.from(JSON.stringify(materials));
    }

    async getMaterial(ctx, matNr, supplier) {
        let materialKey = Material.makeKey([matNr, supplier]);
        let material = await ctx.materialList.getMaterial(materialKey);
        return material.toBuffer()
        //return paper.toBuffer();
    }

    async getMaterialHistory(ctx, matNr, supplier) {
        let materialKey = Material.makeKey([matNr, supplier]);
        let materials = await ctx.materialList.getMaterialHistory(materialKey);
        return Buffer.from(JSON.stringify(materials));
    }

}

module.exports = MaterialContract;
