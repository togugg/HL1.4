/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict'

const cpState = {
  NOT_APPROVED: 1,
  APPROVED: 2,
  DECLINED: 3
}

// Utility class for ledger state
const State = require('./../ledger-api/state.js')

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Stock extends State {
  constructor (obj) {
    super(Stock.getClass(), [obj.materialId, obj.supplierId])
    Object.assign(this, obj)
  }

  addQuantity (newQuantity) {
    this.quantity = ((+this.quantity) + (+newQuantity)).toString()
  }

  approveMonthlyForecast (data) {
    let i = this.monthlyForecast.findIndex(obj => obj.month == data.month)
    if (this.monthlyForecast[i].state != cpState.NOT_APPROVED) {
      throw new Error('forecast already approved/ declined')
    }
    this.monthlyForecast[i].state = cpState.APPROVED
    this.monthlyForecast[i].reason = data.reason
  }

  declineMonthlyForecast (data) {
    let i = this.monthlyForecast.findIndex(obj => obj.month == data.month)
    if (this.monthlyForecast[i].state == cpState.NOT_APPROVED) {
      throw new Error('forecast already approved/ declined')
    }
    this.monthlyForecast[i].state = cpState.DECLINED
    this.monthlyForecast[i].reason = data.reason
  }

  addMonthlyForecast (monthlyForecastData) {
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    if (i != -1) {
      throw new Error('forecast already exits')
    }
    monthlyForecastData.state = cpState.NOT_APPROVED
    this.monthlyForecast.push(monthlyForecastData)
  }

  updateMonthlyForecast (monthlyForecastData) {
    let i = this.monthlyForecast.findIndex(obj => obj.month == monthlyForecastData.month)
    if (i == -1) {
      throw new Error("couldn't find monthly forecast")
    }
    this.monthlyForecast[i] = monthlyForecastData
    this.monthlyForecast[i].state = cpState.NOT_APPROVED
  }

  deleteMonthlyForecast (data) {
    let i = this.monthlyForecast.findIndex(obj => obj.month == data.month)
    if (i == -1) {
      throw new Error("couldn't find monthly forecast")
    }
    this.monthlyForecast.splice(i, 1)
  }

  createCreditPerdiod(now) {
    this.creditPerdiod.start = now
    this.this.creditPerdiod.end = ""
    this.creditHistory.push
  }

  toBuffer () {
    return Buffer.from(JSON.stringify(this))
  }

  /**
       * Factory method to create a commercial paper object
       */
  static createInstance (assetData, now) {
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
      assetData.creditNoteHistory.push(creditPerdiod)
    }
    return new Stock(assetData)
  }

  static getClass () {
    return 'org.warehousenet.stock'
  }
}

module.exports = Stock
