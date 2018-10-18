const express = require('express');

const makeModelsController = require('./ModelsController');

const makeController = (db) => {
  const router = express.Router();
  router.use('/models', makeModelsController(db));
  return router;
};

module.exports = makeController;
