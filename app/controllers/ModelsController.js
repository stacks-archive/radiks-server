const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const queryToMongo = require('query-to-mongo');

const makeModelsController = (db) => {
  const ModelsController = express.Router();
  ModelsController.use(bodyParser.json());

  ModelsController.post('/crawl', async (req, res) => {
    const { gaiaURL } = req.body;
    // console.log(gaiaURL);
    const attrs = await request({
      uri: gaiaURL,
      json: true,
    });
    await db.insertOne(attrs);
    // console.log(doc);

    res.json({
      success: true,
    });
  });

  ModelsController.get('/find', async (req, res) => {
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

  ModelsController.get('/:id', async (req, res) => {
    const { id } = req.params;
    const doc = await db.findOne({ _id: id });
    res.json(doc);
  });

  return ModelsController;
};

module.exports = makeModelsController;
