const express = require('express');
const EventEmitter = require('wolfy87-eventemitter');

const makeModelsController = require('./ModelsController');
const makeStreamingController = require('./StreamingController');

const makeController = (db) => {
  const router = express.Router();

  router.use((req, res, _next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    _next();
  });

  const emitter = new EventEmitter();

  router.use('/models', makeModelsController(db, emitter));

  router.use('/stream', makeStreamingController(db, emitter));

  router.db = db;

  return router;
};

module.exports = makeController;
