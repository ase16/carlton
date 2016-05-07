"use strict";

var datastore = require('./../../datastore.js');

// Terms module is designed like a mini CRUD application
var terms = {

	create: function(req, callback) {

		console.log("POST /company/terms ==> CREATE: req.body = ", req.body);
		var term = req.body.term;

		if (term) {
			if (!req.user.customData.hasOwnProperty("terms")) {
				req.user.customData.terms = [];
			}

			if (req.user.customData.terms.indexOf(term) !== -1) {
				return callback({ err: 'Term already exists' }, req.user.customData.terms);
			}

			req.user.customData.terms.push(term);
			req.user.customData.save(function(err, data) {
				if (!err) {
					datastore.insertTerm(term, req.user.email, function(err) {
						if (!err) return callback(null, data.terms);
						else callback(err)
					});
				}
				else {
					callback(err);
				}
			});
		}
		else {
			// ToDo: Implement some clean error handling
			// roy: maybe this way
			return callback(new Error('term is not defined'));
		}
	},

	read: function(req, callback) {

		console.log("GET /company/terms ==> READ");

		if (req.user.customData.terms !== undefined) {
			var terms = req.user.customData.terms;
			return callback(null, terms);
		}
		else {
			// ToDo: Implement some clean error handling
			return callback({}, undefined);
		}
	},

	update: function(req, callback) {

		var originalTerm = req.params.id;
		var newTerm = req.body.newTerm;
		console.log("PUT /company/terms/:id ==> UPDATE: originalTerm = ", originalTerm);
		console.log("PUT /company/terms/:id ==> UPDATE: newTerm = ", newTerm);

		if (req.user.customData.terms !== undefined && originalTerm && newTerm) {
			var i = req.user.customData.terms.indexOf(originalTerm);
			req.user.customData.terms[i] = newTerm;
			req.user.customData.save(function(err, data) {

				if(!err) {
					datastore.insertTerm(newTerm, req.user.email, function(err) {
						if (!err) {
							datastore.removeTerm(originalTerm, req.user.email, function(err) {
								if(!err) return callback(null, data.terms);
								else callback(err)
							})
						}
						else callback(err)
					})
				} else {
					return callback(err);
				}
			});
		}
		else {
			// ToDo: Implement some clean error handling
			return callback({}, undefined);
		}
	},

	delete: function(req, callback) {

		var term = req.params.id;
		console.log("DELETE /company/terms/:id ==> DELETE: term = ", term);

		if (req.user.customData.terms !== undefined && term) {
			var i = req.user.customData.terms.indexOf(term);
			req.user.customData.terms.splice(i, 1);
			req.user.customData.save(function(err, data) {

				if (!err) {
					datastore.removeTerm(term, req.user.email, function(err) {
						if(!err) return callback(null, data.terms);
						else callback(err)
					})
				}
				else callback(err)

			});
		}
		else {
			// ToDo: Implement some clean error handling
			return callback({}, undefined);
		}
	}
};

module.exports = terms;
