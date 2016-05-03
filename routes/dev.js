"use strict";

// Third-party modules
var router = require('express').Router();

// Make a route available where we can check if carlton is online
router.get('/online', function(req, res) {
	res.json( { info: 'Carlton is online!' } );
});

// Make a route available where we can test some "load" (using a blocking function for 1 second)
router.get('/loadtest', function(req, res) {
	function sleep(milliSeconds) {
		var startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds);
	}
	sleep(1000);
	res.json( { info: 'Carlton is under load!' } );
});

module.exports = router;