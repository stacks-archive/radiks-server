import fetch from 'node-fetch';
import makeModelsController from './controllers/ModelsController';
import setupController from './controllers/RadiksController';
import { getDB } from './database/mongodb';

/**
 * radiks-server use the `doPublicKeysMatchUsername` from `blockstack` which needs access to a global fetch object
 */
if (!global.fetch) {
  global.fetch = fetch;
}

interface Options {
  mongoDBUrl?: string;
  maxLimit?: number;
}

const setup = async (config: Options = {}) => {
  const db = await getDB(config.mongoDBUrl);
  const newConfig = {
    ...config,
    maxLimit: config.maxLimit ? config.maxLimit : 1000,
  };
  const controller = setupController(db, newConfig);
  return controller;
};

export { makeModelsController, setup, getDB, setupController };
