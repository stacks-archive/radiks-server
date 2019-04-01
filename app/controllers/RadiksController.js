const express = require('express');
const EventEmitter = require('wolfy87-eventemitter');

const makeModelsController = require('./ModelsController');
const makeStreamingController = require('./StreamingController');
const makeCentralController = require('./CentralController');
const { COLLECTION, CENTRAL_COLLECTION } = require('../lib/constants');

const makeController = (db, config) => {
  const router = express.Router();

  const radiksCollection = db.collection(COLLECTION);
  const centralCollection = db.collection(CENTRAL_COLLECTION);

  router.options('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    next();
  });

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    next();
  });

  const emitter = new EventEmitter();

  router.use('/models', makeModelsController(radiksCollection, config, emitter));

  router.use('/stream', makeStreamingController(radiksCollection, emitter));

  router.use('/central', makeCentralController(radiksCollection, centralCollection));

  router.db = radiksCollection; // for backwards compatibility
  router.DB = db;
  router.radiksCollection = radiksCollection;
  router.centralCollection = centralCollection;
  router.emitter = emitter;

  return router;
};

module.exports = makeController;
