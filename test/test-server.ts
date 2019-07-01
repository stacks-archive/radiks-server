import express from 'express';
import { setup } from '../src';

const getApp = async () => {
  const app = express();

  const radiksMiddleware = await setup({
    mongoDBUrl: 'mongodb://localhost:27017/radiks-local-testing',
  });
  app.use('/radiks', radiksMiddleware);

  return app;
};

export default getApp;
