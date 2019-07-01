import makeModelsController from "../app/controllers/ModelsController";
import setupController from "../app/controllers/RadiksController";
import { getDB } from "../app/database/mongodb";

interface Options {
  mongoDBUrl?: string;
  maxLimit?: number;
}

const setup = async (config: Options = {}) => {
  const db = await getDB(config.mongoDBUrl);
  const newConfig = { ...config };
  if (!config.maxLimit) {
    newConfig.maxLimit = 1000;
  }
  const controller = setupController(db, newConfig);
  return controller;
};

export {
  makeModelsController,
  setup,
  getDB,
  setupController
};
