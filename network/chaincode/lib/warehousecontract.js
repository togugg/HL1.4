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
const StockList = require('./stocklist.js');
const Shipping = require('./shipping.js');
const ShippingList = require('./shippinglist.js');
const Invoice = require('./invoice.js');
const InvoiceList = require('./invoicelist.js');

/**
 * A custom context provides easy access to list of all stocks
 */
class WarehouseContext extends Context {
    constructor() {
        super();
        // All papers are held in a list of papers
        this.stockList = new StockList(this);
        this.shippingList = new ShippingList(this)
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

    async sendShipping(ctx, shippingNr, invoiceData) {
        let shippingKey = Shipping.makeKey([shippingNr]);
        let shipping = await ctx.shippingList.getShipping(shippingKey);
        let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos;

        let invoice = Invoice.createInstance(now, shipping.shippingNr, invoiceData, 'invoiceCollection')
        await ctx.invoiceList.addInvoice(invoice);

        shipping.setSent(now, invoice.invoiceNr);
        await ctx.shippingList.updateShipping(shipping);

        return shipping.toBuffer();
    }

    async receiveShipping(ctx, shippingNr) {
        let shippingKey = Shipping.makeKey([shippingNr]);
        let shipping = await ctx.shippingList.getShipping(shippingKey);
        shipping.setReceived()
        await ctx.shippingList.updateShipping(shipping)
        let stockKey = Stock.makeKey([shipping.matNr, shipping.supplier]);
        let stock = await ctx.stockList.getStock(stockKey);
        stock.addQuantity(shipping.stock)
        await ctx.stockList.updateStock(stock);
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
    async createStock(ctx, matNr, supplier, matDesc, min, max, quantity, location) {

        // create an instance of the paper
        let stock = Stock.createInstance(matNr, supplier, matDesc, min, max, quantity, location);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.stockList.addStock(stock);

        // Must return a serialized paper to caller of smart contract
        return stock.toBuffer();
    }

    async updateStock(ctx, matNr, supplier, matDesc, min, max, stock, location) {

        // create an instance of the stock
        let stock = Stock.createInstance(matNr, supplier, matDesc, min, max, stock, location);

        // Updates the stock in the ledger world state
        await ctx.stockList.updateStock(stock);

        // Must return a serialized stock to caller of smart contract
        return stock.toBuffer();
    }

    async deleteStock(ctx, matNr, supplier) {

        // create an instance of the stock
        let stockKey = Stock.makeKey([matNr, supplier]);

        // Updates the stock in the ledger world state
        let stock = await ctx.stockList.deleteStock(stockKey);

        // Must return a serialized stock to caller of smart contract
        return stock.toBuffer();
    }

    async getStockHistory(ctx, matNr, supplier) {
        let stockKey = Stock.makeKey([matNr, supplier]);
        let stocks = await ctx.stockList.getStockHistory(stockKey);
        return Buffer.from(JSON.stringify(stocks));
    }

    async getStock(ctx, matNr, supplier) {
        let stockKey = Stock.makeKey([matNr, supplier]);
        let stock = await ctx.stockList.getStock(stockKey);
        return stock.toBuffer()
    }

    async getInvoice(ctx, invoiceNr) {
        let invoiceKey = Invoice.makeKey([invoiceNr]);
        let invoice = await ctx.invoiceList.getInvoice('invoiceCollection', invoiceKey);
        return invoice.toBuffer()
    }

    async getStocksByQuery(ctx, queryString) {
        let stocks = await ctx.stockList.getStocksByQuery(queryString);
        return Buffer.from(JSON.stringify(stocks));
    }

    async createShipping(ctx, matNr, supplier, quantity) {
        let shippingNr = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
        // create an instance of the paper
        let shipping = Shipping.createInstance(shippingNr, matNr, supplier, quantity);
        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.shippingList.addShipping(shipping)
        // Must return a serialized paper to caller of smart contract
        return shipping.toBuffer();
    }

    async getShipping(ctx, shippingKey) {
        let shippingKey = Shipping.makeKey([shippingKey]);
        let shipping = await ctx.shippingList.getShipping(shippingKey);
        return shipping.toBuffer()
    }

    async getShippingByQuery(ctx, queryString) {
        let shipping = await ctx.shippingList.getShippingByQuery(queryString);
        return Buffer.from(JSON.stringify(shipping));
    }

}

module.exports = WarehouseContract;
