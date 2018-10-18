const { getDB } = require('../app/database/mongodb');

const db = async () => {
  const url = 'mongodb://localhost:27017/radiks-local-testing';
  return getDB(url);
};

module.exports = db;
