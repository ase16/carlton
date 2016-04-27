"use strict";

const config = require('config');
const Log = require('winston');

Log.level = config.get('log.level');

const MongoClient = require('mongodb').MongoClient;

let mongodb;

// returns the mongodb connection string
const mongodbUrl = function() {
    var user = '';
    if (config.get('mongodb.user').length > 0 && config.get('mongodb.password').length > 0) {
        user = config.get('mongodb.user') + 
         ':' + config.get('mongodb.password') + 
         '@';
    }
    return 'mongodb://'
            + user +
              config.get('mongodb.host') +
        ':' + config.get('mongodb.port') +
        '/' + config.get('mongodb.dbname');
};

// this is a pseudo-check to see if we have a connection
// if the object is not undefined, we assume it has been initialized/set
const isConnected = () => typeof mongodb !== "undefined";

const db = {

    // this should only be called at startup
	connect: function(callback) {

        // do we already have a connection?
        if (isConnected()) return;

        const url = mongodbUrl();

        MongoClient.connect(url, function(err, database) {
            if (err) {
                Log.error('DB: Could not connect to mongodb server: %s', url, err);
                process.exit(1);
            } else {
                Log.info('DB: Connected correctly to mongodb server: %s', url);
                mongodb = database;
                callback();
            }
        })
	},

    // @param term e.g. 'clinton'
    // @param cid customer-id aka the email address
    // @param callback fn(err, res)
	insertTerm: function(term, cid, callback) {

        if (isConnected()) {

            mongodb.collection('terms').updateOne(

                // query
                { 'term': term },
                {
                    // with each update we overwrite the term with the exact same val
                    // this is not pretty, but this way we can keep this fn short
                    $set: { 'term': term },
                    $currentDate: { 'updated_at': true },
                    // the referenced customer-ids array is added to keep track of
                    // how many companies dependent on this term
                    $addToSet: { 'ref_cids': cid }
                },
                // if query doesn't match, create new doc
                { upsert: true },
                callback
            )
        }
	},

    // @param term e.g. 'clinton'
    // @param cid customer-id aka the email address
    // @param callback fn(err, result)
	removeTerm: function(term, cid, callback) {

        if (isConnected()) {

            mongodb.collection('terms').updateOne(

                // query
                { term: term },
                { $pull: { 'ref_cids': cid }},
                { upsert: false },
                function(err) {

                    if (err) {
                        return callback(err);
                    }
                    else {
                        mongodb.collection('terms').remove(
                            // query
                            {
                                term: term,
                                // make sure the referenced cid array is empty
                                // to make sure no other company requires the term
                                ref_cids: { $exists: true, $size: 0 }
                            }, callback
                        )
                    }
                }
            )
        }
	}
};

module.exports = db;
