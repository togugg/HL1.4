/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric client identity class
const ClientIdentity = require('fabric-shim').ClientIdentity;

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const CommercialPaper = require('./paper.js');
const PaperList = require('./paperlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CommercialPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CommercialPaperContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new CommercialPaperContext();
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
    async issue(ctx, matNr, matDesc, min, max, stock, location) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(matNr, matDesc, min, max, stock, location);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper.toBuffer();
    }

    async update(ctx, matNr, matDesc, min, max, stock, location) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(matNr, matDesc, min, max, stock, location);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.paperList.updatePaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper.toBuffer();
    }

    /**
     * Get all commercial papers
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
    */
    async getAll(ctx, issuer) {
	let cid = new ClientIdentity(ctx.stub); 
	console.log(cid.getAttributeValue("email"))
        //let paperKey = CommercialPaper.makeKey([issuer]);
        //let papers = await ctx.paperList.getAllPapers(paperKey);
        //return Buffer.from(JSON.stringify(papers));
    }

    async getOne(ctx, matNr, matDesc) {
        let paperKey = CommercialPaper.makeKey([matNr, matDesc]);
        let paper = await ctx.paperList.getPaper(paperKey);
        return paper.toBuffer()
        //return paper.toBuffer();
    }

}

module.exports = CommercialPaperContract;
