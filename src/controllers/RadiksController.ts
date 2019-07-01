import express from 'express';
import EventEmitter from 'wolfy87-eventemitter';

import makeModelsController from './ModelsController';
import makeStreamingController from './StreamingController';
import makeCentralController from './CentralController';
import constants from '../lib/constants';

const makeController = (db, config) => {
  const router: any = express.Router();

  const radiksCollection = db.collection(constants.COLLECTION);
  const centralCollection = db.collection(constants.CENTRAL_COLLECTION);

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

  router.use(
    '/models',
    makeModelsController(radiksCollection, config, emitter)
  );

  router.use('/stream', makeStreamingController(radiksCollection, emitter));

  router.use(
    '/central',
    makeCentralController(radiksCollection, centralCollection)
  );

  router.db = radiksCollection; // for backwards compatibility
  router.DB = db;
  router.radiksCollection = radiksCollection;
  router.centralCollection = centralCollection;
  router.emitter = emitter;

  return router;
};

export default makeController;
