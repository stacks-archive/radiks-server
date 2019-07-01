import express from 'express';
import bodyParser from 'body-parser';
import { verifyECDSA } from 'blockstack/lib/encryption';
import { addAsync } from '@awaitjs/express';

export default (radiksCollection, centralCollection) => {
  const CentralController = addAsync(express.Router());
  CentralController.use(bodyParser.json());

  CentralController.postAsync('/', async (req, res) => {
    const { key, value, signature, username } = req.body;

    const { publicKey } = await radiksCollection.findOne({
      username,
      radiksType: 'BlockstackUser',
    });
    const _id = `${username}-${key}`;
    if (verifyECDSA(_id, publicKey, signature)) {
      await centralCollection.updateOne(
        { _id },
        { $set: value },
        { upsert: true }
      );
      return res.json({
        success: true,
      });
    }
    return res.status(400).json({
      success: false,
    });
  });

  CentralController.getAsync('/:key', async (req, res) => {
    const { username, signature } = req.query;
    const { key } = req.params;
    const _id = `${username}-${key}`;
    const { publicKey } = await radiksCollection.findOne({
      username,
      radiksType: 'BlockstackUser',
    });
    if (verifyECDSA(_id, publicKey, signature)) {
      const value = await centralCollection.findOne({ _id });
      return res.json(value);
    }
    return res.status(400).json({ success: false });
  });

  return CentralController;
};
