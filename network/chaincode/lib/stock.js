/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paper.js
*/

'use strict'

// Enumerate state values
const cpState = {
  NOT_APPROVED: 1,
  APPROVED: 2,
  DECLINED: 3
}

// Utility class for ledger state
const State = require('./../ledger-api/state.js')

/**
 * Stock class extends State class
 * Class will be used by application and smart contract to define a stock
 */
class Stock extends State {
  constructor(obj) {
    super(Stock.getClass(), [obj.materialId, obj.supplierId])
    Object.assign(this, obj)
  }

  /**
   * Add quantity to the stock
   * @param {String} newQuantity to add to the stock quantity
   */
  addQuantity(newQuantity) {
    this.quantity = ((+this.quantity) + (+newQuantity)).toString()
  }

  /**
   * Approve a specifc monthly forecast
   * @param {String} monthlyForecastData to approve
   */
  approveMonthlyForecast(monthlyForecastData) {
    // Get index of the slected forecast
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    // Check for right state
    if (this.monthlyForecast[i].state != cpState.NOT_APPROVED) {
      throw new Error('forecast already approved/ declined')
    }
    // Approvie forecast
    this.monthlyForecast[i].state = cpState.APPROVED
    // Add reasons
    this.monthlyForecast[i].reason = monthlyForecastData.reason
  }

  /**
   * Decline a specifc monthly forecast
   * @param {String} monthlyForecastData to approve
   */
  declineMonthlyForecast(monthlyForecastData) {
    // Get index of the slected forecast
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    // Check for right state
    if (this.monthlyForecast[i].state == cpState.NOT_APPROVED) {
      throw new Error('forecast already approved/ declined')
    }
    // Decline forecast
    this.monthlyForecast[i].state = cpState.DECLINED
    // Add reasons
    this.monthlyForecast[i].reason = monthlyForecastData.reason
  }

  /**
   * Add a specifc monthly forecast
   * @param {String} monthlyForecastData to approve
   */
  addMonthlyForecast(monthlyForecastData) {
    // Get index of the slected forecast
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    // Check whethere monthlyForecast already exists, throw if yes
    if (i != -1) {
      throw new Error('forecast already exits')
    }
    // Set state
    monthlyForecastData.state = cpState.NOT_APPROVED
    // Add new monthlyForecast to the monthlyForecast array
    this.monthlyForecast.push(monthlyForecastData)
  }

  /**
   * Update a specifc monthly forecast
   * @param {String} monthlyForecastData to approve
   */
  updateMonthlyForecast(monthlyForecastData) {
    // Get index of the slected forecast
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    // Check whethere monthlyForecast exists, throw if no
    if (i == -1) {
      throw new Error("couldn't find monthly forecast")
    }
    // Update monthlyForecast
    this.monthlyForecast[i] = monthlyForecastData
    // Reset state
    this.monthlyForecast[i].state = cpState.NOT_APPROVED
  }

  /**
   * Delete a specifc monthly forecast
   * @param {String} monthlyForecastData to approve
   */
  deleteMonthlyForecast(monthlyForecastData) {
    // Get index of the slected forecast
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    // Check whethere monthlyForecast exists, throw if no
    if (i == -1) {
      throw new Error("couldn't find monthly forecast")
    }
    // Delete monthlyForecast from array
    this.monthlyForecast.splice(i, 1)
  }

  toBuffer() {
    return Buffer.from(JSON.stringify(this))
  }

  /**
   * Factory method to create a stock object
   */
  static createInstance(assetData, now) {
    if (!assetData.monthlyForecast) {
      assetData.monthlyForecast = []
    }
    if (!assetData.creditHistory) {
      assetData.creditNoteHistory = []
      let creditNotePerdiod = {
        startDate: now,
        startQuantity: assetData.quantity,
        endDate: "",
        endQuantity: "",
        issued: false
      }
      assetData.creditNoteHistory.push(creditNotePerdiod)
      assetData.withdrawal = 0
      assetData.withdrawalHistory = []
    }
    return new Stock(assetData)
  }

  static getClass() {
    return 'org.warehousenet.stock'
  }
}

module.exports = Stock
