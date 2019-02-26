const { getDB } = require('../app/database/mongodb');

const db = async () => {
  const url = process.env.MONGODB_URI;
  return getDB(url);
};

module.exports = db;
