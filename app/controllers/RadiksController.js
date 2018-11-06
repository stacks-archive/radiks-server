const express = require('express');

const makeModelsController = require('./ModelsController');

const makeController = (db) => {
  const router = express.Router();

  router.use((req, res, _next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    _next();
  });

  router.use('/models', makeModelsController(db));

  router.db = db;

  return router;
};

module.exports = makeController;
