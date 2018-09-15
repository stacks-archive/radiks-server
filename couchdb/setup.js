const PouchDB = require('pouchdb');
const fs = require('fs-extra');
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-authentication'));

const getDB = ({ databaseName, adminUser, adminPassword }) => {
  console.log(`Setting up ${databaseName}`);
  const db = new PouchDB(`http://${adminUser}:${adminPassword}@127.0.0.1:5984/${databaseName}`);
  return db;
};

const getUsersDB = ({ adminUser, adminPassword }) => new PouchDB(`http://${adminUser}:${adminPassword}@127.0.0.1:5984/_users`);

const setupValidation = async (db) => {
  const validation = (await fs.readFile(`${__dirname}/validation.js`)).toString();
  const _id = '_design/radiks-validation';
  const existing = await db.get(_id);
  const document = {
    _id,
    _rev: existing ? existing._rev : null,
    validate_doc_update: validation,
  };
  await db.put(document);
};

const setupIndex = async (db) => {
  await db.createIndex({
    index: {
      fields: ['radiksType'],
    },
  });
};

const setupDB = async (config) => {
  getUsersDB(config);
  const db = getDB(config);

  await setupValidation(db);
  await setupIndex(db);

  console.log('Setup complete');
};

module.exports = {
  setupDB,
  getDB,
};
