#!/usr/bin/env node

const express = require('express');

const { setup } = require('../lib/index');

const run = () => {
  setup()
    .then(RadiksController => {
      const port = parseInt(process.env.PORT, 10) || 1260;

      const server = express();

      server.use('/radiks', RadiksController);

      server.listen(port, err => {
        if (err) throw err;
        console.log(`radiks-server is ready on http://localhost:${port}`);
      });
    })
    .catch(e => {
      console.error('Caught an error while setting up MongoDB:', e);
    });
};

run();
