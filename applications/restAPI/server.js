// external scripts
const connector = require('./lib/connector.js');

// libraries for express server
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var multer = require("multer");
//var request = require("request-promise-native");

const upload = multer({ storage: multer.memoryStorage() });

// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

var router = express.Router();

const userName = 'User1@org1.example.com';


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", router);

// ROUTES FOR OUR API
// =============================================================================
// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

router.get("/stock/:stock_key", function (req, res) {
  let request = req.params.stock_key.split(':')
  const args = ['getStock', request[0], request[1]]
  connector.main(userName, args).then(result => { res.json(result) }).catch(err => { res.send(err) })
});

router.get("/stock/byquery/:queryString", function (req, res) {
  let request = req.params.queryString
  const args = ['getStocksByQuery', request]
  connector.main(userName, args).then(result => { res.json(result) }).catch(err => { res.send(err) })
});

router.post("/stock", function (req, res) {
  let request = req.body
  const args = ['createStock', request.matNr, request.supplier, request.matDesc, request.min, request.max, request.quantity, request.location]
  connector.main(userName, args).then(result => { res.json(result) }).catch(err => { res.send(err) })
});

router.get("/shipping/:shipping_key", function (req, res) {
  let request = req.params.shipping_key.split(':')
  const args = ['getShipping', request[0]]
  connector.main(userName , args).then(result => { res.json(result) }).catch(err => { res.send(err) })
});

router.post("/shipping", function (req, res) {
  let request = req.body
  const args = ['createShipping', request.matNr, request.supplier, request.quantity]
  connector.main(userName, args).then(result => { res.json(result) }).catch(err => { res.send(err) })
});

/* router.put("/update", function(req, res) {
  dbService.updateJobs(req).then(result => {
    res.send(result);
  });
});

router.post("/printJobs", upload.single("file"), (req, res) => {
  dbService.newJob(req).then(result => {
    contractService.writeDataHelper(result, req.body);
    res.send(result);
  });
});


router.delete("/printJobs", function(req, res) {
  dbService.deleteJob(req).then(result => {
    res.send(result);
  });
}); */



// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; // set our port
app.listen(port);
console.log("Magic happens on port " + port);
