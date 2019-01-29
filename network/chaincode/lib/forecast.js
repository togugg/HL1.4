/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const cpState = {
    NOT_APPROVED: 1,
    APPROVED: 2
};

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Forecast extends State {

    constructor(obj) {
        super(Forecast.getClass(), [obj.forecastId]);
        Object.assign(this, obj);
    }

    approveMonthlyForecast(data) {
        let i = this.monthlyForecast.indexOf(data.month);
        this.monthlyForecast[i].state = cpState.APPROVED;
        this.monthlyForecast[i].note = data.note;
    }

    declineMonthlyForecast(data) {
        let i = this.monthlyForecast.indexOf(data.month);
        this.monthlyForecast[i].state = cpState.NOT_APPROVED;
        this.monthlyForecast[i].note = data.note;
    }

    addMonthlyForecast(monthlyForecastData) {
        monthlyForecastData.state = cpState.NOT_APPROVED; 
        this.monthlyForecast.push(monthlyForecastData);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(assetData) {
        assetData["monthlyForecast"] = []
        return new Forecast(assetData);
    }

    static getClass() {
        return 'org.warehousenet.forecast';
    }
}

module.exports = Forecast;
