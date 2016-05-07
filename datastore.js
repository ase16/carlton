'use strict';
const gcloud = require('gcloud');			// --> https://github.com/GoogleCloudPlatform/gcloud-node

// Authenticating on a per-API-basis.
let datastore;								// --> https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.32.0/datastore

// This is a pseudo-check to see if we have a connection. If the object is not undefined, we assume it has been initialized/set
const isConnected = () => typeof datastore !== "undefined";

// This is the datastore object that the module eventually exports
const db = {
    connect: function(conf, callback) {
        // do we already have a connection?
        if (isConnected()) return;
        datastore = gcloud.datastore(conf);
        return callback();
    },

    insertTerm: function(term, cid, callback) {
		if (!isConnected()) {
			return callback("Not connected");
		}

		var key = datastore.key(['Term', term]);	// --> https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.32.0/datastore?method=key

		datastore.runInTransaction(function(transaction, done) {	// In case we'd like to avoid transactions, look at the last example of get --> https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.32.0/datastore?method=get
			transaction.get(key, function(err, entity) {
				if (err) {
					console.log("datastore.insertTerm: Error in get, rolling back!");
					transaction.rollback(done);
					return;
				}
				else {
					if (entity !== undefined && entity.data !== undefined && entity.data.cids !== undefined && entity.data.cids.length > 0) {
						console.log("datastore.insertTerm: Before Update entity = ", entity);
						entity.data.cids.push(cid);
						console.log("datastore.insertTerm: After Update Entity = ", entity);
					}
					else {
						entity = {
							key: key,
							data: {
								cids: [
									cid
								]
							}
						};
						console.log("datastore.insertTerm: Insert new entity = ", entity);
					}

					transaction.save(entity);
					done();
				}
			});
		}, function(err) {
			if (!err) {
				console.log("datastore.insertTerm: No Error in Transaction!");
				callback(null, key);
			}
			else {
				console.log("datastore.insertTerm: Error in Transaction!");
				callback(err);
			}
		});
    },

    removeTerm: function(term, cid, callback) {
		if (!isConnected()) {
			return callback("Not connected");
		}

		var key = datastore.key(['Term', term]);	// --> https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.32.0/datastore?method=key

		datastore.runInTransaction(function(transaction, done) {
			transaction.get(key, function(err, entity) {
				if (err) {
					console.log("datastore.removeTerm: Error in get, rolling back!");
					transaction.rollback(done);
					return;
				}
				else {
					if (entity !== undefined && entity.data !== undefined && entity.data.cids !== undefined && entity.data.cids.length > 1) {
						console.log("datastore.removeTerm: Before Update entity = ", entity);
						var i = entity.data.cids.indexOf(cid);
						entity.data.cids.splice(i, 1);
						transaction.save(entity);
						console.log("datastore.removeTerm: After Update Entity = ", entity);
						done();
					}
					else {
						console.log("datastore.removeTerm: Delete term with key = ", key);
						datastore.delete(key, function(err, apiResponse) {			// --> https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.32.0/datastore?method=delete
							done();
						});
					}
				}
			});
		}, function(err) {
			if (!err) {
				console.log("datastore.removeTerm: No Error in Transaction!");
				callback(null, key);
			}
			else {
				console.log("datastore.removeTerm: Error in Transaction!");
				callback(err);
			}
		});
    }
};

module.exports = db;