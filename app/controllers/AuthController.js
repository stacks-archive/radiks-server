const express = require('express');
const bodyParser = require('body-parser');

const { publicKeyToAddress } = require('blockstack/lib/keys');
const { getUserAppFileUrl } = require('blockstack/lib/storage/index');
const { verifyECDSA } = require('blockstack/lib/encryption');

const setupAuthController = (db) => {
  const router = express.Router();
  router.use(bodyParser.json());

  router.post('/login', async (req, res) => {
    try {
      const {
        signature, publicKey, username, origin,
      } = req.body;
      // console.log(signature);
      // console.log(publicKey);
      const signerAddress = publicKeyToAddress(publicKey);
      // console.log(signerAddress);
      const gaiaPath = await getUserAppFileUrl('', username, origin);
      const gaiaParts = gaiaPath.split('/');
      const gaiaAddress = gaiaParts[gaiaParts.length - 2];
      if (signerAddress !== gaiaAddress) {
        return res.status(400).json({
          success: false,
          message: 'Signer and username do not match',
        });
      }
      if (!verifyECDSA('RADIKS_LOGIN', publicKey, signature)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature',
        });
      }
      try {
        await db.signUp(username, signature);
      } catch (error) {
        if (error.name !== 'conflict') {
          console.log(error);
          return res.status(400).json({
            success: false,
            message: 'Error when logging in',
          });
        }
      }
      console.log('Signature passed');
      // console.log(gaiaAddress);
      // console.log(username);
      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: error,
      });
    }
  });

  return router;
};

module.exports = setupAuthController;
