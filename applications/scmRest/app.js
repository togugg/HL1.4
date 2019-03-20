'use strict';

var swagger = require('swagger-tools');
var express = require('express');
var http = require('http');
const yaml = require('js-yaml');
var fs = require('fs');
const swaggerUi = require('swagger-ui-express');
var cors = require('cors');

var swaggerObject = yaml.safeLoad(fs.readFileSync(__dirname + '/api/swagger/swagger.yaml', 'utf8'));

var app = express();

swagger.initializeMiddleware(swaggerObject, function (middleware) {

  
  /* app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', true);
    
    next();
  }); */

  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb'}));

  app.use(cors({
    "origin": "http://195.128.101.122:4200",
    "credentials": true
  }));



  app.use(middleware.swaggerMetadata());
  //app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter({ useStubs: true, controllers: './api/controllers' }));
  app.use(middleware.swaggerUi());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerObject));

  http
    .createServer(app)
    .listen(8080);
  console.log('open API GUI at:\n  http://localhost:' + '8080' + '/api-docs/');
});



/* 'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var session = require('express-session');
var https = require('https');
var fs = require('fs');
const yaml = require('js-yaml');
let swaggerDocument = yaml.safeLoad(fs.readFileSync(__dirname + '/api/swagger/swagger.yaml', 'utf8'));

module.exports = app; // for testing
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


var options = {
  key: fs.readFileSync('my.private.key'),
  cert: fs.readFileSync('my.certificate.cer')
};

var config = {
  appRoot: __dirname // required config
};


// HTTP Server
SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 8080;
  app.disable('etag');

  app.listen(port);
  console.log('open API GUI at:\n  http://localhost:' + port + '/api-docs');
});


/* //HTTPS Server
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 10011;
    https.createServer(options, app).listen(port, function () {
        console.log('Server started @ %s!', port);
    });
}); */

