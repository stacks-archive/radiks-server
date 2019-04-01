const makeModelsController = require('./app/controllers/ModelsController');
const setupController = require('./app/controllers/RadiksController');
const { getDB } = require('./app/database/mongodb');

const setup = async (config = {}) => {
  const db = await getDB(config.mongoDBUrl);
  const newConfig = { ...config };
  if (!config.maxLimit) {
    newConfig.maxLimit = 1000;
  }
  const controller = setupController(db, config);
  return controller;
};

module.exports = {
  makeModelsController,
  setup,
  getDB,
  setupController,
};
