const makeModelsController = require('./app/controllers/ModelsController');
const setupController = require('./app/controllers/RadiksController');
const fetchModels = require('./app/models');
// const { getDB } = require('./couchdb');
// const { setupDB } = require('./couchdb/setup');
const { getDB } = require('./app/database/mongodb');

const setup = async (config) => {
  const db = await getDB(config.mongoDBUrl);
  const controller = setupController(db);
  return controller;
};

module.exports = {
  makeModelsController,
  fetchModels,
  setup,
  // setupDB,
  getDB,
  setupController,
};
