const { MongoClient } = require('mongodb');

const COLLECTION = 'radiks-server-data';

const getDB = url => new Promise(async (resolve, reject) => {
  const _url = url || process.env.MONGODB_URI || 'mongodb://localhost:27017/radiks-server';
  MongoClient.connect(_url, (err, client) => {
    if (err) {
      return reject(err);
    }
    return resolve(client.db().collection(COLLECTION));
  });
});

module.exports = {
  getDB,
};
