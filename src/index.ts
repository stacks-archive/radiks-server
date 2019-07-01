import makeModelsController from './controllers/ModelsController';
import setupController from './controllers/RadiksController';
import { getDB } from './database/mongodb';

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
