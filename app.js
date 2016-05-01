"use strict";

// Third-party modules
require('dotenv').config({path: '.env.stormpath'});						// Automatically reads in .env files and sets environment variables --> https://github.com/motdotla/dotenv#usage
var express = require('express');
var expressStormpath = require('express-stormpath');					// Our "Tenant" for Stormpath is "majestic-panther" --> https://api.stormpath.com/login
var config = require('config');

// Express modules
var cors = require('cors');												// --> https://github.com/expressjs/cors
var bodyParser = require('body-parser');								// --> https://github.com/expressjs/body-parser

// Custom modules
var db = require('./dbModule.js');

// Routes modules
var company = require('./routes/company');

// Create express application
var app = express();													// --> http://expressjs.com/en/4x/api.html#app

// Initialize the bodyParser so
app.use(bodyParser.json());												// --> https://github.com/expressjs/body-parser#bodyparserjsonoptions
app.use(bodyParser.urlencoded({ extended: false }));					// --> https://github.com/expressjs/body-parser#bodyparserurlencodedoptions

// Enable CORS for geoffrey
var corsOrigin = config.get('cors-origin');								// We need to copy the loaded cors properties to a new object, to avoid "read only property" errors
var corsOptions = {
	origin: corsOrigin,
	methods: 'GET,HEAD,PUT,POST,DELETE',
	credentials: true
};
console.log("cors-options = ", corsOptions);
app.use(cors(corsOptions));

// Must be defined as the last middleware, but before our routes
app.use(expressStormpath.init(app, { expand: { customData: true } }));	// --> http://docs.stormpath.com/nodejs/express/latest/configuration.html#initialize-express-stormpath

// Bind routes
app.use('/company', company);

// Make a route available where we can check if carlton is online
app.get('/online', function(req, res) { res.json( { info: 'Carlton is online!' } ); });

// Make a route available where we can test some "load" (using a blocking function for 1 second)
app.get('/loadtest', function(req, res) {
	function sleep(milliSeconds) {
		var startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds);
	}
	sleep(1000);
	res.json( { info: 'Carlton is under load!' } );
});

// Our server can start listening as soon as the Stormpath SDK has been initialized
app.on('stormpath.ready', function() {
	app.listen(3001, function () {
		console.log('Carlton is listening on port 3001');
		db.connect(function () {
			console.log("Carlton has connection to MongoDB");
		});
	});
});
