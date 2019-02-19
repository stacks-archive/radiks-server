const express = require('express');
const EventEmitter = require('wolfy87-eventemitter');

const makeModelsController = require('./ModelsController');
const makeStreamingController = require('./StreamingController');
const makeCentralController = require('./CentralController');

const COLLECTION = 'radiks-server-data';
const CENTRAL_COLLECTION = 'radiks-central-data';

const makeController = (db) => {
  const router = express.Router();

  const radiksCollection = db.collection(COLLECTION);
  const centralCollection = db.collection(CENTRAL_COLLECTION);

  router.use((req, res, _next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    _next();
  });

  const emitter = new EventEmitter();

  router.use('/models', makeModelsController(radiksCollection, emitter));

  router.use('/stream', makeStreamingController(radiksCollection, emitter));

  router.use('/central', makeCentralController(radiksCollection, centralCollection));

  router.db = radiksCollection; // for backwards compatibility
  router.DB = db;
  router.radiksCollection = radiksCollection;
  router.centralCollection = centralCollection;

  return router;
};

module.exports = makeController;
