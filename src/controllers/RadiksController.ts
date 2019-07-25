import express from 'express';
import EventEmitter from 'wolfy87-eventemitter';
import { Db } from 'mongodb';

import { Config } from '../types';
import makeModelsController from './ModelsController';
import makeStreamingController from './StreamingController';
import makeCentralController from './CentralController';
import constants from '../lib/constants';

const makeController = (db: Db, config: Config) => {
  const router = express.Router();

  const radiksCollection = db.collection(constants.COLLECTION);
  const centralCollection = db.collection(constants.CENTRAL_COLLECTION);

  router.options('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    next();
  });

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
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

  (router as any).db = radiksCollection; // for backwards compatibility
  (router as any).DB = db;
  (router as any).radiksCollection = radiksCollection;
  (router as any).centralCollection = centralCollection;
  (router as any).emitter = emitter;

  return router;
};

export default makeController;
