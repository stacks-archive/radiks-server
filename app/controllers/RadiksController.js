const express = require('express');

const makeModelsController = require('./ModelsController');
const setupAuthController = require('./AuthController');

// const router = express.Router();

const makeController = (db) => {
  const router = express.Router();
  router.use('/auth', setupAuthController(db));
  router.use('/models', makeModelsController(db));
  return router;
  // const modelsController = makeModelsController(models);
};

module.exports = makeController;
