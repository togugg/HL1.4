'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var https = require('https');
var fs = require('fs');
const yaml = require('js-yaml');
let swaggerDocument = yaml.safeLoad(fs.readFileSync(__dirname+'/api/swagger/swagger.yaml', 'utf8'));

module.exports = app; // for testing
const swaggerUi = require('swagger-ui-express');

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


var options = {
   key  : fs.readFileSync('my.private.key'),
   cert : fs.readFileSync('my.certificate.cer')
};

var config = {
  appRoot: __dirname // required config
};


// HTTP Server
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  app.listen(port);

  
    console.log('open API GUI at:\n  http://127.0.0.1:' + port + '/api-docs');
  
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

