import express from 'express';
import bodyParser from 'body-parser';
import request from 'request-promise';
import { addAsync } from '@awaitjs/express';
import { verifyECDSA } from 'blockstack/lib/encryption/ec';
import { Collection } from 'mongodb';
import EventEmitter from 'wolfy87-eventemitter';
import { stringify } from 'qs';

import { Config } from '../types';
import Validator from '../lib/validator';
import constants from '../lib/constants';

export const queryToMongo = (
  query: { limit: number; offset: number; sort: any; criteria: any },
  { maxLimit }: { maxLimit: number }
) => {
  const { limit: userLimit, offset: userOffset, sort, ...criteria } = query;
  const limit = Number(userLimit) || maxLimit;
  const offset = Number(userOffset) || 0;

  return {
    options: {
      limit,
      offset,
      sort,
    },
    criteria: {
      ...criteria,
    },
    links(url: string, totalCount: number) {
      const links: {
        prev?: string;
        next?: string;
        first?: string;
        last?: string;
        pages?: number;
        offset?: number;
      } = {};
      const safeLimit = Math.min(limit, totalCount);

      const getLinkWithOffset = (offsetForLink: number): string =>
        `${url}?${stringify({ ...query, offset: offsetForLink })}`;

      if (offset > 0) {
        links.prev = getLinkWithOffset(Math.max(offset - safeLimit, 0));
        links.first = getLinkWithOffset(0);
      }
      if (offset + safeLimit < totalCount) {
        const pages = Math.ceil(totalCount / safeLimit);
        const newOffset = (pages - 1) * safeLimit;
        links.next = getLinkWithOffset(Math.min(offset + safeLimit, newOffset));
        links.last = getLinkWithOffset(newOffset);
      }
      return links;
    },
  };
};

const makeModelsController = (
  radiksCollection: Collection,
  config: Config,
  emitter: EventEmitter
) => {
  const ModelsController = addAsync(express.Router());
  ModelsController.use(bodyParser.json());

  ModelsController.postAsync('/crawl', async (req, res) => {
    const { gaiaURL } = req.body;
    const attrs = await request({
      uri: gaiaURL,
      json: true,
    });
    const validator = new Validator(radiksCollection, attrs);
    try {
      await validator.validate();
      await radiksCollection.save(attrs);
      emitter.emit(constants.STREAM_CRAWL_EVENT, [attrs]);

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message+ ', Could not Crawl the GAIA URL provided',
      });
    }
  });

  ModelsController.getAsync('/find', async (req, res) => {
    const mongo = queryToMongo(req.query, {
      maxLimit: config.maxLimit,
    });

    const cursor = radiksCollection.find(mongo.criteria, mongo.options);
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

  ModelsController.postAsync('/query', async (req, res) => {
    const query = req.body;
    const limit = Math.min(Number(req.query.limit), config.maxLimit);
    const options = { limit, offset: req.query.offset };
    const cursor = radiksCollection.find(query, options);

    const results = await cursor.toArray();
    const total = await cursor.count();

    res.json({
      total,
      results,
    });
  });

  ModelsController.getAsync('/count', async (req, res) => {
    const mongo = queryToMongo(req.query, {
      maxLimit: config.maxLimit,
    });

    const total = await radiksCollection.countDocuments(
      mongo.criteria,
      mongo.options
    );

    res.json({
      total,
    });
  });

  ModelsController.getAsync('/:id', async (req, res) => {
    const { id } = req.params;
    const doc = await radiksCollection.findOne({ _id: id });
    res.json(doc);
  });

  ModelsController.deleteAsync('/:id', async (req, res) => {
    let errors = ''
    try {
      const attrs = await radiksCollection.findOne({ _id: req.params.id });
      const { publicKey } = await radiksCollection.findOne<any>({
        _id: attrs.signingKeyId,
        radiksType: 'SigningKey',
      });
      const message = `${attrs._id}-${attrs.updatedAt}`;
      if (verifyECDSA(message, publicKey, req.query.signature)) {
        await radiksCollection.deleteOne({ _id: req.params.id });
        return res.json({
          success: true,
        });
      }
    } catch (error) {
      console.error(error);
      errors = error;
    }

    return res.json({
      success: false,
      error: 'Invalid signature: '+ errors
    });
  });

  return ModelsController;
};

export default makeModelsController;
