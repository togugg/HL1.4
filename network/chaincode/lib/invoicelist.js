/*
SPDX-License-Identifier: Apache-2.0
Adapted from: https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/paperlist.js
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Invoice = require('./invoice.js');

class InvoiceList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.warehousenet.invoicelist');
        this.use(Invoice);
    }

    async addInvoice(invoiceData) {
        return this.addPrivateData(invoiceData);
    }

    async getInvoice(assetClass, collection, invoiceKey) {
        return this.getPrivateData(assetClass, collection, invoiceKey);
    }

    async updateInvoice(invoice) {
        return this.updateState(invoice);
    }

    async deleteInvoice(invoice) {
        return this.deleteState(invoice);
    }

    async getInvoicesByQuery(queryString) {
        return this.getStatesByQuery(queryString);
    }

    async getInvoiceHistory(invoiceKey) {
        return this.getStateHistory(invoiceKey);
    }
}


module.exports = InvoiceList;
