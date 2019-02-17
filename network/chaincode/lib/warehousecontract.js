/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict'

// Helper libraries

// Fabric client identity class
const ClientIdentity = require('fabric-shim').ClientIdentity

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api')

// SupplyNet specifc classes
const Stock = require('./stock.js')
const Shipping = require('./shipping.js')
const Invoice = require('./invoice.js')
const CreditNote = require('./creditnote.js')

const AssetList = require('./assetlist.js')
const PrivateAssetList = require('./privateassetlist.js')
const InvoiceList = require('./invoicelist.js')

/**
 * A custom context provides easy access to list of all stocks
 */
class WarehouseContext extends Context {
  constructor() {
    super()
    // All papers are held in a list of papers
    this.assetList = new AssetList(this)
    this.invoiceList = new InvoiceList(this)
    this.privateAssetList = new PrivateAssetList(this)
  }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class WarehouseContract extends Contract {
  constructor() {
    // Unique namespace when multiple contracts per chaincode file
    super('org.warehousenet.warehouse')
  }

  /**
     * Define a custom context for commercial paper
    */
  createContext() {
    return new WarehouseContext()
  }

  /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
  async instantiate(ctx) {
    // No implementation required with this example
    // It could be where data migration is performed, if necessary
    console.log('Instantiate the contract')
  }

  async createCreditNote(ctx, data) {
    data = JSON.parse(data)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', data.stockId) } catch (err) { throw new Error('could not find stockId') };
    let creditNotePeriod = stock.creditHistory[stock.creditHistory.length - 1]
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    creditNotePeriod.endDate = now
    creditNotePeriod.endQuantity = stock.quantity
    creditNotePeriod.creditNoteId = data.creditNoteId
    creditNotePeriod.totalWithdrawal = stock.withdrawal
    stock.withdrawal = 0
    data.creditNotePeriod = creditNotePeriod
    let creditNote = CreditNote.createInstance(data)
    await ctx.privateAssetList.addAsset(creditNote)
    creditNotePeriod.issued = true
    let newCreditNotePerdiod = {
      startDate: now,
      startQuantity: stock.quantity,
      endDate: "",
      endQuantity: "",
      issued: false
    }
    stock.creditHistory.push(newCreditNotePerdiod)
    await ctx.assetList.updateAsset(stock)
    return stock.toBuffer()
  }

  async withdrawStock(ctx, data) {
    data = JSON.parse(data)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', data.stockId) } catch (err) { throw new Error('could not find stockId') };
    stock.quantity -= data.withdrawal
    stock.withdrawal += data.withdrawal
    await ctx.assetList.updateAsset(stock)
    return stock.toBuffer()
  }

  async sendShipping(ctx, invoiceData) {
    invoiceData = JSON.parse(invoiceData)
    let shippingKey = Shipping.makeKey([invoiceData.shippingId])
    try { var shipping = await ctx.assetList.getAsset('org.warehousenet.shipping', shippingKey) } catch (err) { throw new Error('could not find shippingId') };
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = shipping.supplierId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('SupplierId not fitting your MSPID')
    };
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    let invoice = Invoice.createInstance(invoiceData)
    await ctx.invoiceList.addInvoice(invoice)
    shipping.setSent(now, invoice.invoiceId)
    await ctx.assetList.updateAsset(shipping)
    let eventData = {
      transaction: 'sendShipping',
      data: invoiceData.shippingId
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return shipping.toBuffer()
  }

  async receiveShipping(ctx, shippingId) {
    try { var shipping = await ctx.assetList.getAsset('org.warehousenet.shipping', shippingId) } catch (err) { throw new Error('could not find shippingId') };
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    shipping.setReceived(now)
    await ctx.assetList.updateAsset(shipping)
    let stockKey = Stock.makeKey([shipping.materialId, shipping.supplierId])
    let stock = await ctx.assetList.getAsset('org.warehousenet.stock', stockKey)
    stock.addQuantity(shipping.quantity)
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'receiveShipping',
      data: shippingId
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return shipping.toBuffer()
  }

  async addMonthlyForecast(ctx, monthlyForecast) {
    monthlyForecast = JSON.parse(monthlyForecast)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('could not find stockId') }
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    };
    stock.addMonthlyForecast(monthlyForecast.data)
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'addMonthlyForecast',
      data: monthlyForecast
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return stock.toBuffer()
  }

  async updateMonthlyForecast(ctx, monthlyForecast) {
    monthlyForecast = JSON.parse(monthlyForecast)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    };
    stock.updateMonthlyForecast(monthlyForecast.data)
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'updateMonthlyForecast',
      data: monthlyForecast
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return stock.toBuffer()
  }

  async deleteMonthlyForecast(ctx, monthlyForecast) {
    monthlyForecast = JSON.parse(monthlyForecast)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    };
    stock.deleteMonthlyForecast(monthlyForecast)
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'deleteMonthlyForecast',
      data: monthlyForecast
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return stock.toBuffer()
  }

  async approveMonthlyForecast(ctx, monthlyForecast) {
    monthlyForecast = JSON.parse(monthlyForecast)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.supplierId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('SupplerId not fitting your MSPID')
    };
    stock.approveMonthlyForecast(monthlyForecast)
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'addMonthlyForecast',
      data: monthlyForecast
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return stock.toBuffer()
  }

  async declineMonthlyForecast(ctx, monthlyForecast) {
    monthlyForecast = JSON.parse(monthlyForecast)
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.supplierId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('SupplerId not fitting your MSPID')
    };
    stock.declineMonthlyForecast(monthlyForecast)
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'addMonthlyForecast',
      data: monthlyForecast
    }
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    return stock.toBuffer()
  }

  async getIdentity(ctx) {
    let cid = new ClientIdentity(ctx.stub)
    // console.log(cid.getAttributeValue("email"))
    // let matKey = CommercialPaper.makeKey([issuer]);
    let cert = cid.getX509Certificate()
    console.log(ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos)
    return Buffer.from(JSON.stringify(cert))
  }

  /** Standard seters and geters */

  async assetClassHandler(ctx, assetData) {
    switch (assetData.class) {
      case 'org.warehousenet.stock': {
        let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
        let cid = new ClientIdentity(ctx.stub)
        let userMSPID = cid.getMSPID()
        let submitedMSPID = assetData.customerId.split('.')[0] + 'MSP'
        if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
          throw new Error('CustomerId not fitting your MSPID')
        };
        return Stock.createInstance(assetData, now)
      }
      case 'org.warehousenet.shipping': {
        let cid = new ClientIdentity(ctx.stub)
        let userMSPID = cid.getMSPID()
        let submitedMSPID = assetData.supplierId.split('.')[0] + 'MSP'
        if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
          throw new Error('SupplierId not fitting your MSPID')
        };
        return Shipping.createInstance(assetData)
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
    let asset = await this.assetClassHandler(ctx, JSON.parse(assetData))
    // Add the paper to the list of all similar commercial papers in the ledger world state
    await ctx.assetList.addAsset(asset)
    // Must return a serialized paper to caller of smart contract
    try {
      await ctx.assetList.getAsset(asset.class, asset.key)
    } catch (err) {
      let eventData = {
        transaction: 'createAsset',
        data: asset
      }
      ctx.stub.setEvent('assetEvent', Buffer.from(JSON.stringify(eventData)))
      return asset.toBuffer()
    }
    throw new Error('AssetId already exists')
  }

  async getAsset(ctx, assetClass, assetKey) {
    let asset = await ctx.assetList.getAsset(assetClass, assetKey)
    return asset.toBuffer()
  }

  async getAllAssetsByClass(ctx, assetClass) {
    let assets = await ctx.assetList.getAllAssetsByClass(assetClass)
    return Buffer.from(JSON.stringify(assets))
  }

  async updateAsset(ctx, assetData) {
    let asset = await this.assetClassHandler(ctx, JSON.parse(assetData))
    // Add the paper to the list of all similar commercial papers in the ledger world state
    await ctx.assetList.updateAsset(asset)
    // Must return a serialized paper to caller of smart contract
    let eventData = {
      transaction: 'createAsset',
      data: asset
    }
    ctx.stub.setEvent('updateAsset', Buffer.from(JSON.stringify(eventData)))
    return asset.toBuffer()
  }

  async deleteAsset(ctx, assetClass, assetKey) {
    // Updates the stock in the ledger world state
    let asset = await ctx.assetList.deleteAsset(assetClass, assetKey)
    // Must return a serialized stock to caller of smart contract
    let eventData = {
      transaction: 'createAsset',
      data: asset
    }
    ctx.stub.setEvent('updateAsset', Buffer.from(JSON.stringify(eventData)))
    return asset.toBuffer()
  }

  async getAssetsByQuery(ctx, queryString) {
    let assets = await ctx.assetList.getAssetsByQuery(queryString)
    return Buffer.from(JSON.stringify(assets))
  }

  async getAssetHistory(ctx, assetClass, assetKey) {
    let asset = await ctx.assetList.getAssetHistory(assetClass, assetKey)
    return Buffer.from(JSON.stringify(asset))
  }

  // invoiceCollection
  async createInvoice(ctx, invoiceData) {
    let invoice = Invoice.createInstance(JSON.parse(invoiceData))
    await ctx.invoiceList.addInvoice(invoice)
    return invoice.toBuffer()
  }

  async createPrivateAsset(ctx, assetData) {
    let invoice = Invoice.createInstance(JSON.parse(assetData))
    await ctx.privateAssetList.addAsset(invoice)
    return invoice.toBuffer()
  }

  async getPrivateAsset(ctx, assetClass, assetKey, collection) {
    let privateAsset = await ctx.privateAssetList.getAsset(assetClass, assetKey, collection)
    return privateAsset.toBuffer()
  }
}

module.exports = WarehouseContract
