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

    setApproved(now) {
        this.currentState = cpState.APPROVED;
        this.approvedDate = now;
    }

    addMonthlyForecast(monthlyForecastData) {
        this.monthlyForecast.push(monthlyForecastData)
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(assetData) {
        assetData.currentState = cpState.NOT_APPROVED;
        if (!assetData.monthlyForecast) {
            console.log('add forecast array')
            assetData["monthlyForecast"] = []
        }
        return new Forecast(assetData);
    }

    static getClass() {
        return 'org.warehousenet.forecast';
    }
}

module.exports = Forecast;
