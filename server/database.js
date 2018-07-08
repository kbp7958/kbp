const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {MONGODB_URL, DATABASE_NAME} = require('./constants');

let db = null;

let connect = (callback) => {
    MongoClient.connect(MONGODB_URL, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);
        db = client.db(DATABASE_NAME);
        callback();
    });
};

let setSounds = (value) => {
    db.collection("sounds").updateOne({}, { $set: {value: value }}, {upsert: true}, (err, res) => {
        assert.equal(null, err);
    });
};

let querySounds = (callback) => {
    db.collection("sounds").findOne({}, (err, res) => {
        assert.equal(null, err);
        callback(res? res.value : 0);
    });
};

module.exports = {
    connect,
    setSounds,
    querySounds
}