const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const queryToMongo = require('query-to-mongo');
const { decorateApp } = require('@awaitjs/express');

const Validator = require('../lib/validator');

const makeModelsController = (db) => {
  const ModelsController = decorateApp(express.Router());
  ModelsController.use(bodyParser.json());

  ModelsController.post('/crawl', async (req, res) => {
    const { gaiaURL } = req.body;
    const attrs = await request({
      uri: gaiaURL,
      json: true,
    });
    const validator = new Validator(db, attrs);
    try {
      validator.validate();
      await db.save(attrs);

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

  ModelsController.getAsync('/find', async (req, res) => {
    const mongo = queryToMongo(req.query, {
      maxLimit: 1000,
    });

    const cursor = db.find(mongo.criteria, mongo.options);
    const results = await cursor.toArray();
    const total = await cursor.count();

    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const pageLinks = mongo.links(fullUrl.split('?')[0], total);

    res.json({
      ...pageLinks,
      total,
      results,
    });
  });

  ModelsController.getAsync('/:id', async (req, res) => {
    const { id } = req.params;
    const doc = await db.findOne({ _id: id });
    res.json(doc);
  });

  return ModelsController;
};

module.exports = makeModelsController;
