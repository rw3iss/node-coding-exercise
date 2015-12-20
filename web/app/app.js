'use strict';

var http = require('http'),
    express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    config = require('./config/app'),
    async = require('async');

var app = express();

// Store config and DI container references
app.config = config;
app.container = config.container;

// Configure express app
app.set('views', __app + '/views');
app.set('view engine', 'jade');
app.use(express.static(__app + '/../public'));
app.use(bodyParser.json());

// Run application start sequence
async.series([
  // Start the MongoDB and initialize collections
  function(cb) {
    // Initialize MongoDB and app collections
    mongodb.MongoClient.connect(app.config.database.connectionString, function(err, database) {
      if(err) throw err;
     
      app.db = database;

      app.container.Data.siteCollection = app.db.collection('site');
      app.container.Data.daysCollection = app.db.collection('days');

      cb();
    });
  },

  // Initialize app routes
  function(cb) {
    require('./routes/_routes.js')(app);

    cb();
  },

  // Start the HTTP server
  function(cb) {
    var server = http.Server(app);

    server.listen(app.config.appPort, function () {
      console.log('App listening at %s:%s in mode %s', 
        'localhost',//server.address().address, 
        server.address().port,
        app.get('env')
      );
    });

    cb();
  }  
]);
