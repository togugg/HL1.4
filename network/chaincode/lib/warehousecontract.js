/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric client identity class
const ClientIdentity = require('fabric-shim').ClientIdentity;

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// SupplyNet specifc classes
const Stock = require('./stock.js');
const Shipping = require('./shipping.js');
const AssetList = require('./assetlist.js');
const Invoice = require('./invoice.js');
const InvoiceList = require('./invoicelist.js');

/**
 * A custom context provides easy access to list of all stocks
 */
class WarehouseContext extends Context {
    constructor() {
        super();
        // All papers are held in a list of papers
        this.assetList = new AssetList(this);
        this.invoiceList = new InvoiceList(this)
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class WarehouseContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.warehousenet.warehouse');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new WarehouseContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async sendShipping(ctx, shippingId, invoiceData) {
        let shippingKey = Shipping.makeKey([shippingId]);
        let shipping = await ctx.assetList.getAsset("org.warehousenet.shipping", shippingKey);
        let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos;

        let invoice = Invoice.createInstance(now, shipping.shippingId, invoiceData, 'invoiceCollection')
        await ctx.invoiceList.addInvoice(invoice);

        shipping.setSent(now, invoice.invoiceId);
        await ctx.assetList.updateAsset(shipping);

        return shipping.toBuffer();
    }

    async receiveShipping(ctx, shippingId) {
        let shippingKey = Shipping.makeKey([shippingId]);
        let shipping = await ctx.assetList.getAsset('org.warehousenet.shipping', shippingKey);
        shipping.setReceived()
        await ctx.assetList.updateAsset(shipping)
        let stockKey = Stock.makeKey([shipping.matId, shipping.supplier]);
        let stock = await ctx.assetList.getAsset('org.warehousenet.stock', stockKey);
        stock.addQuantity(shipping.quantity)
        await ctx.assetList.updateAsset(stock);
        return shipping.toBuffer()
    }


    async getIdentity(ctx) {
        let cid = new ClientIdentity(ctx.stub);
        //console.log(cid.getAttributeValue("email"))
        //let matKey = CommercialPaper.makeKey([issuer]);
        let cert = cid.getX509Certificate();
        console.log(ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos)
        return Buffer.from(JSON.stringify(cert));
    }

    /** Standard seters and geters */

    async assetClassHandler(assetData) {
        switch (assetData.class) {
            case 'org.warehousenet.stock': {
                return Stock.createInstance(assetData);
            };
            case 'org.warehousenet.shipping': {
                return Shipping.createInstance(assetData);
            }
        }

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
    async createAsset(ctx, assetData) {
        let asset = await this.assetClassHandler(JSON.parse(assetData))
        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.assetList.addAsset(asset);
        // Must return a serialized paper to caller of smart contract
        return asset.toBuffer();
    }

    async getAsset(ctx, assetClass, assetKey) {
        let asset = await ctx.assetList.getAsset(assetClass, assetKey);
        return asset.toBuffer()
    }

    async updateAsset(ctx, assetData) {
        let asset = await this.assetClassHandler(JSON.parse(assetData))
        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.assetList.updateAsset(asset);
        // Must return a serialized paper to caller of smart contract
        return asset.toBuffer();
    }

    async deleteAsset(ctx, assetClass, assetKey) {
        // Updates the stock in the ledger world state
        let asset = await ctx.assetList.deleteAsset(assetClass, assetKey);
        // Must return a serialized stock to caller of smart contract
        return asset.toBuffer();
    }

    async getAssetByQuery(ctx, queryString) {
        let asset = await ctx.assetList.getAssetByQuery(queryString);
        return Buffer.from(JSON.stringify(asset));
    }

    async getAssetHistory(ctx, assetClass, assetKey) {
        let asset = await ctx.assetList.getAssetHistory(assetClass, assetKey);
        return Buffer.from(JSON.stringify(asset));
    }

    async getInvoice(ctx, assetClass, invoiceId) {
        let invoiceKey = Invoice.makeKey([invoiceId]);
        let invoice = await ctx.invoiceList.getInvoice('invoiceCollection', assetClass, invoiceKey);
        return invoice.toBuffer()
    }

}

module.exports = WarehouseContract;
