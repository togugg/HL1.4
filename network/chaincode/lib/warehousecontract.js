/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/papercontract.js
*/

'use strict'

// Helper libraries

// Fabric client identity class
const ClientIdentity = require('fabric-shim').ClientIdentity

// Fabric API classes
const { Contract, Context } = require('fabric-contract-api')

// SupplyNet specifc classes
const Stock = require('./stock.js')
const Shipment = require('./shipment.js')
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
 * Define warehouse smart contract by extending Fabric Contract class
 *
 */
class WarehouseContract extends Contract {
  constructor() {
    // Unique namespace when multiple contracts per chaincode file
    super('org.warehousenet.warehouse')
  }

  /**
     * Define a custom context for warehouse
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

  /**
 * Transaction for creating an new creditNote
 * 
 * @param {Context} ctx the transaction context
 * @param {String} creditNoteData data for creating a new creditNote
 */
  async createCreditNote(ctx, creditNoteData) {
    // String must be parsed

    creditNoteData = JSON.parse(creditNoteData)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', creditNoteData.stockId) } catch (err) { throw new Error('could not find stockId') };
    // Check wheter there were withdrawals
    if (stock.withdrawal == 0) {
      throw new Error('No withdrawal within this period')
    }
    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }
    // Get last creditNotePeriod
    let creditNotePeriod = stock.creditNoteHistory[stock.creditNoteHistory.length - 1]
    // Get timestamp from transaction
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    // Set creditNotePeriod variables
    creditNotePeriod.issued = true
    creditNotePeriod.endDate = now
    creditNotePeriod.endQuantity = stock.quantity
    creditNotePeriod.creditNoteId = creditNoteData.creditNoteId
    creditNotePeriod.totalWithdrawal = stock.withdrawal
    // Reset withdrawal
    stock.withdrawal = 0
    // Add perdio to creditNoteData
    creditNoteData.creditNotePeriod = creditNotePeriod
    var creditNoteExists = false
    // Check whethere asset with creditNoteId alread exits
    try {
      creditNoteExists = await ctx.privateAssetList.getAsset('org.warehousenet.creditNote', creditNoteData.creditNoteId, creditNoteData.collection)
      creditNoteExists = true
    }
    catch (err) {
      console.log('could not find creditNote, create new one')
    }
    if (creditNoteExists) { throw new Error('creditNoteId already exists') }
    // Create creditNote object
    let creditNote = CreditNote.createInstance(creditNoteData)
    // Create asset in the in the ledger world state
    await ctx.privateAssetList.addAsset(creditNote)
    // Set creditNotePerdiod to issued
    creditNotePeriod.issued = true
    // Create next period
    let newCreditNotePerdiod = {
      startDate: now,
      startQuantity: stock.quantity,
      endDate: "",
      endQuantity: "",
      issued: false
    }
    // Push new perdiod to the creditNoteHistory array
    stock.creditNoteHistory.push(newCreditNotePerdiod)
    // Update asset in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'createCreditNote',
      data: creditNotePeriod
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /** Transactions for stocks */

  /**
   * Transaction for adjusting min/max limits
   * 
   * @param {Context} ctx the transaction context
   * @param {String} withdrawData data holding withdrawal from stock
   */
  async withdrawStock(ctx, withdrawData) {
    // String must be parsed
    withdrawData = JSON.parse(withdrawData)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', withdrawData.stockId) } catch (err) { throw new Error('could not find stockId') };
    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }
    // Check whether there is enough stock
    if (stock.quantity < withdrawData.withdrawal) { throw new Error('you cannot withdrawh more than there is on stock') }
    // Update stock with new quantities
    stock.quantity = ((+stock.quantity) - (+withdrawData.withdrawal)).toString()
    stock.withdrawal = ((+stock.withdrawal) + (+withdrawData.withdrawal)).toString()
    // Get timestamp from transaction
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    // Add withdrawal to the withdrawalHistory
    stock.withdrawalHistory.push({
      timestamp: now,
      quantity: withdrawData.withdrawal
    })
    // Update asset in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'withdrawStock',
      data: withdrawData
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /**
   * Transaction for adjusting min/max limits
   * 
   * @param {Context} ctx the transaction context
   * @param {String} data data holding new min/max limits
   */
  async adjustLimits(ctx, data) {
    // String must be parsed
    data = JSON.parse(data)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', data.stockId) } catch (err) { throw new Error('could not find stockId') };
    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }
    // Update stock limits
    stock.min = data.min
    stock.max = data.max
    // Update asset in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'adjustLimits',
      data: data
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /** Transactions for shipments */

  /**
   * Transaction for sending shipment
   * 
   * @param {Context} ctx the transaction context
   * @param {String} shipmentData data for shipment and invoice creation
   */
  async sendShipment(ctx, shipmentData) {
    // String must be parsed
    shipmentData = JSON.parse(shipmentData)
    // Create key for shipment
    let shipmentKey = Shipment.makeKey([shipmentData.shipmentId])
    // Check whether asset with shipmentId exists
    try { var shipment = await ctx.assetList.getAsset('org.warehousenet.shipment', shipmentKey) } catch (err) { throw new Error('could not find shipmentId') }
    // Get clientIdentity and compare with supplierId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = shipment.supplierId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('SupplierId not fitting your MSPID')
    }
    // Get timestamp from transaction
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    // Create invoice based on shipment information
    let invoice = Invoice.createInstance(shipmentData)
    // Add private asset in the in the private ledger world state
    await ctx.privateAssetList.addAsset(invoice)
    // Set shipment as sent
    shipment.setSent(now, invoice.invoiceId)
    // Update asset in the in the ledger world state
    await ctx.assetList.updateAsset(shipment)
    let eventData = {
      transaction: 'sendShipment',
      data: shipmentData.shipmentId
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return shipment.toBuffer()
  }

  /**
   * Transaction for receiving shipment
   * 
   * @param {Context} ctx the transaction context
   * @param {String} shipmentId Id of the shipment to receive
   */
  async receiveShipment(ctx, shipmentId) {
    // Check whether asset with shipmentId exists
    try { var shipment = await ctx.assetList.getAsset('org.warehousenet.shipment', shipmentId) } catch (err) { throw new Error('could not find shipmentId') }

    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = shipment.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }

    // Get timestamp from transaction
    let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
    // Set shipment as receive
    shipment.setReceived(now)
    // update stock in the in the ledger world state
    await ctx.assetList.updateAsset(shipment)
    // Create key for stock query
    let stockKey = Stock.makeKey([shipment.materialId, shipment.supplierId])
    // Get stock from the ledger world state
    let stock = await ctx.assetList.getAsset('org.warehousenet.stock', stockKey)
    // Add quantity from the shipment to the stock
    stock.addQuantity(shipment.quantity)
    // Update stock in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'receiveShipment',
      data: shipmentId
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return shipment.toBuffer()
  }

  /** Transactions for monthlyForecasts */

  /**
   * Transaction for adding monthlyForecast
   * 
   * @param {Context} ctx the transaction context
   * @param {String} monthlyForecast data for the monthlyForecast to add
   */
  async addMonthlyForecast(ctx, monthlyForecast) {
    // String must be parsed
    monthlyForecast = JSON.parse(monthlyForecast)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('could not find stockId') }
    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }
    // add month
    stock.addMonthlyForecast(monthlyForecast.data)
    // Update stock in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'addMonthlyForecast',
      data: monthlyForecast
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /**
   * Transaction for updating monthlyForecast
   * 
   * @param {Context} ctx the transaction context
   * @param {String} monthlyForecast data for the monthlyForecast to update
   */
  async updateMonthlyForecast(ctx, monthlyForecast) {
    // String must be parsed
    monthlyForecast = JSON.parse(monthlyForecast)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }
    // Update month
    stock.updateMonthlyForecast(monthlyForecast.data)
    // update stock in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'updateMonthlyForecast',
      data: monthlyForecast
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /**
   * Transaction for deleting monthlyForecast
   * 
   * @param {Context} ctx the transaction context
   * @param {String} monthlyForecast data for the monthlyForecast to delete
   */
  async deleteMonthlyForecast(ctx, monthlyForecast) {
    // String must be parsed
    monthlyForecast = JSON.parse(monthlyForecast)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    // Get clientIdentity and compare with customerId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.customerId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('CustomerId not fitting your MSPID')
    }
    // Delete month
    stock.deleteMonthlyForecast(monthlyForecast)
    // update stock in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'deleteMonthlyForecast',
      data: monthlyForecast
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /**
   * Transaction for approving monthlyForecast
   * 
   * @param {Context} ctx the transaction context
   * @param {String} monthlyForecast data for the monthlyForecast to approve
   */
  async approveMonthlyForecast(ctx, monthlyForecast) {
    // String must be parsed
    monthlyForecast = JSON.parse(monthlyForecast)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    // Get clientIdentity and compare with supplierId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.supplierId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('SupplerId not fitting your MSPID')
    }
    // Approve month
    stock.approveMonthlyForecast(monthlyForecast)
    // update stock in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'addMonthlyForecast',
      data: monthlyForecast
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }

  /**
   * Transaction for declining monthlyForecast
   * 
   * @param {Context} ctx the transaction context
   * @param {String} monthlyForecast data for the monthlyForecast to decline
   */
  async declineMonthlyForecast(ctx, monthlyForecast) {
    // String must be parsed
    monthlyForecast = JSON.parse(monthlyForecast)
    // Check whether asset with stockId exists
    try { var stock = await ctx.assetList.getAsset('org.warehousenet.stock', monthlyForecast.stockId) } catch (err) { throw new Error('Could not find stockId') }
    // Get clientIdentity and compare with supplierId, throw error if no match
    let cid = new ClientIdentity(ctx.stub)
    let userMSPID = cid.getMSPID()
    let submitedMSPID = stock.supplierId.split('.')[0] + 'MSP'
    if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
      throw new Error('SupplerId not fitting your MSPID')
    }
    // Decline month
    stock.declineMonthlyForecast(monthlyForecast)
    // update stock in the in the ledger world state
    await ctx.assetList.updateAsset(stock)
    let eventData = {
      transaction: 'addMonthlyForecast',
      data: monthlyForecast
    }
    // Emit an event
    ctx.stub.setEvent('transactionEvent', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized asset to caller of smart contract
    return stock.toBuffer()
  }


  /** Standard seters and geters */

  /**
   * Class handler for assets
   * 
   * @param {Context} ctx the transaction context
   * @param {Object} assetData data for intance creation
   */
  async assetClassHandler(ctx, assetData) {
    // Check class of asset
    switch (assetData.class) {
      case 'org.warehousenet.stock': {
        // Get timestamp from transaction
        let now = ctx.stub.getSignedProposal().proposal.header.channel_header.timestamp.nanos
        // Get clientIdentity and compare with customerId, throw error if no match
        let cid = new ClientIdentity(ctx.stub)
        let userMSPID = cid.getMSPID()
        let submitedMSPID = assetData.customerId.split('.')[0] + 'MSP'
        if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
          throw new Error('CustomerId not fitting your MSPID')
        }
        // Return asset object
        return Stock.createInstance(assetData, now)
      }
      case 'org.warehousenet.shipment': {
        // Get clientIdentity and compare with supplierId, throw error if no match
        let cid = new ClientIdentity(ctx.stub)
        let userMSPID = cid.getMSPID()
        let submitedMSPID = assetData.supplierId.split('.')[0] + 'MSP'
        if (userMSPID.toUpperCase() != submitedMSPID.toUpperCase()) {
          throw new Error('SupplierId not fitting your MSPID')
        }
        // Return asset object
        return Shipment.createInstance(assetData)
      }
    }
  }

  /**
   * Create new asset
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetData data for intance creation
   */
  async createAsset(ctx, assetData) {
    // String musst be parsed before given to the assetClassHandler
    var asset = await this.assetClassHandler(ctx, JSON.parse(assetData))
    // Check whether asset already exists, if yes throw error
    try {
      await ctx.assetList.getAsset(asset.class, asset.key)
    } catch (err) {
      let eventData = {
        transaction: 'createAsset',
        data: asset
      }
      // Emit an event
      ctx.stub.setEvent('assetEvent', Buffer.from(JSON.stringify(eventData)))
      // Add the asset to the list of all similar assets in the ledger world state
      await ctx.assetList.addAsset(asset)
      // Must return a serialized asset to caller of smart contract
      return asset.toBuffer()
    }
    throw new Error('AssetId already exists')
  }

  /**
   * Update existing asset
   * 
   * @param {Context} ctx the transaction context
   * @param {String} assetData data for intance creation
   */
  async updateAsset(ctx, assetData) {
    // String musst be parsed before given to the assetClassHandler
    let asset = await this.assetClassHandler(ctx, JSON.parse(assetData))
    // Check whether asset exists, if no throw error
    try {
      await ctx.assetList.getAsset(asset.class, asset.key)
    }
    catch (err) {
      throw new Error('AssetId does not exist')
    }
    // Update asset in the ledger world state
    await ctx.assetList.updateAsset(asset)
    let eventData = {
      transaction: 'createAsset',
      data: asset
    }
    // Emit an event
    ctx.stub.setEvent('updateAsset', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized paper to caller of smart contract
    return asset.toBuffer()
  }

  /**
   * Delete existing asset
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetClass class of the asset
   * @param {String} assetKey key of the asset
   */
  async deleteAsset(ctx, assetClass, assetKey) {
    // Delete asset from the ledger world state
    let asset = await ctx.assetList.deleteAsset(assetClass, assetKey)
    let eventData = {
      transaction: 'createAsset',
      data: asset
    }
    // Emit an event
    ctx.stub.setEvent('updateAsset', Buffer.from(JSON.stringify(eventData)))
    // Must return a serialized stock to caller of smart contract
    return asset.toBuffer()
  }

  /**
   * Query existing asset
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetClass class of the asset
   * @param {String} assetKey key of the asset
   */
  async getAsset(ctx, assetClass, assetKey) {
    // Queriy asset from the ledger world state
    let asset = await ctx.assetList.getAsset(assetClass, assetKey)
    // Must return a serialized asset to caller of smart contract
    return asset.toBuffer()
  }

  /**
   * Query all existing assets by class
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetClass class of the asset
   */
  async getAllAssetsByClass(ctx, assetClass) {
    // Query all assets of a class from the ledger world state
    let assets = await ctx.assetList.getAllAssetsByClass(assetClass)
    // Must return a serialized asset to caller of smart contract
    return Buffer.from(JSON.stringify(assets))
  }

  /**
   * Query all existing assets by class
   *
   * @param {Context} ctx the transaction context
   * @param {String} queryString couchDB query string
   */
  async getAssetsByQuery(ctx, queryString) {
    // Query based on queryString from the ledger world state
    let assets = await ctx.assetList.getAssetsByQuery(queryString)
    // Must return a serialized asset to caller of smart contract
    return Buffer.from(JSON.stringify(assets))
  }

  /**
   * Query history of a asset
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetClass class of the asset
   * @param {String} assetKey key of the asset
   */
  async getAssetHistory(ctx, assetClass, assetKey) {
    // Query history of a class from the ledger world state
    let asset = await ctx.assetList.getAssetHistory(assetClass, assetKey)
    // Must return a serialized asset to caller of smart contract
    return Buffer.from(JSON.stringify(asset))
  }

  /** Private data seters and geters */

  /**
   * Create new private asset
   * Currently only supports invoices
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetData data for intance creation
   */
  async createPrivateAsset(ctx, assetData) {
    // Create invoice class
    let invoice = Invoice.createInstance(JSON.parse(assetData))
    // Add the asset to the list of all similar assets in the private ledger world state
    await ctx.privateAssetList.addAsset(invoice)
    // Must return a serialized asset to caller of smart contract
    return invoice.toBuffer()
  }

  /**
   * Query private asset
   *
   * @param {Context} ctx the transaction context
   * @param {String} assetClass class of the asset
   * @param {String} assetKey key of the asset
   * @param {String} assetKey private data collection
   */
  async getPrivateAsset(ctx, assetClass, assetKey, collection) {
    // Query private asset from the private ledger world state
    let privateAsset = await ctx.privateAssetList.getAsset(assetClass, assetKey, collection)
    // Must return a serialized asset to caller of smart contract
    return privateAsset.toBuffer()
  }
}

module.exports = WarehouseContract
