var State = require('../../../network/chaincode/lib/stock.js')

stock = {
    "class":"org.warehousenet.stock",
    "key":"2:2",
    "location":"home",
    "matDesc":"this is a material",
    "matNr":"2",
    "max":"10",
    "min":"5",
    "quantity":"7",
    "supplier":"2"
    }

newStock = State.createInstance(stock)


console.log(newStock.class)
