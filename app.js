"use strict";

// Third-party modules
require('dotenv').config({path: '.env.stormpath'});						// Automatically reads in .env files and sets environment variables --> https://github.com/motdotla/dotenv#usage
var express = require('express');
var expressStormpath = require('express-stormpath');					// Our "Tenant" for Stormpath is "majestic-panther" --> https://api.stormpath.com/login
var config = require('config');

// Express modules
var bodyParser = require('body-parser');								// --> https://github.com/expressjs/body-parser

// Custom modules
var datastore = require('./datastore.js');

// Routes modules
var company = require('./routes/company');
var dev = require('./routes/dev');

// Create express application
var app = express();													// --> http://expressjs.com/en/4x/api.html#app

// Initialize the body-parser so that we're able to access req.body of incoming requests
app.use(bodyParser.json());												// --> https://github.com/expressjs/body-parser#bodyparserjsonoptions
app.use(bodyParser.urlencoded({ extended: false }));					// --> https://github.com/expressjs/body-parser#bodyparserurlencodedoptions

// Must be defined as the last middleware, but before our routes
app.use(expressStormpath.init(app, { expand: { customData: true } }));	// --> http://docs.stormpath.com/nodejs/express/latest/configuration.html#initialize-express-stormpath

// Bind routes
app.use('/company', company);
app.use('/dev', dev);

// Our server can start listening as soon as the Stormpath SDK has been initialized
app.on('stormpath.ready', function() {
	app.listen(3001, function () {
		console.log('Carlton is listening on port 3001');
		datastore.connect(config.get('gcloud'), function () {
			console.log("Carlton has connection to Google Cloud Datastore");
		});
	});
});
