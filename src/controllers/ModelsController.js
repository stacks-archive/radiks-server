const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const queryToMongo = require('query-to-mongo');
const { decorateApp } = require('@awaitjs/express');
const { verifyECDSA } = require('blockstack/lib/encryption');

const Validator = require('../lib/validator');
const { STREAM_CRAWL_EVENT } = require('../lib/constants');

const makeModelsController = (db, config, emitter) => {
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
      emitter.emit(STREAM_CRAWL_EVENT, [attrs]);

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
      maxLimit: config.maxLimit,
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

  ModelsController.getAsync('/count', async (req, res) => {
    const mongo = queryToMongo(req.query, {
      maxLimit: config.maxLimit,
    });

    const total = await db.countDocuments(mongo.criteria, mongo.options);

    res.json({
      total,
    });
  });

  ModelsController.getAsync('/:id', async (req, res) => {
    const { id } = req.params;
    const doc = await db.findOne({ _id: id });
    res.json(doc);
  });

  ModelsController.deleteAsync('/:id', async (req, res) => {
    try {
      const attrs = await db.findOne({ _id: req.params.id });
      const { publicKey } = await db.findOne({
        _id: attrs.signingKeyId,
        radiksType: 'SigningKey',
      });
      const message = `${attrs._id}-${attrs.updatedAt}`;
      if (verifyECDSA(message, publicKey, req.query.signature)) {
        await db.deleteOne({ _id: req.params.id });
        return res.json({
          success: true,
        });
      }
    } catch (error) {
      console.error(error);
    }

    return res.json({
      success: false,
      error: 'Invalid signature',
    });
  });

  return ModelsController;
};

module.exports = makeModelsController;
