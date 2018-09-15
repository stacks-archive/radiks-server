const makeModelsController = require('./app/controllers/ModelsController');
const setupController = require('./app/controllers/RadiksController');
const fetchModels = require('./app/models');
const { setupDB, getDB } = require('./couchdb/setup');

const setup = (config) => {
  const db = getDB(config);
  const controller = setupController(db);
  return controller;
};

module.exports = {
  makeModelsController,
  fetchModels,
  setup,
  setupDB,
  getDB,
  setupController,
};
