const express = require('express');
const { setup } = require('..');

const getApp = async () => {
  const app = express();

  const radiksMiddleware = await setup({
    mongoDBUrl: 'mongodb://localhost:27017/radiks-local-testing',
  });
  app.use('/radiks', radiksMiddleware);

  return app;
};

module.exports = getApp;
