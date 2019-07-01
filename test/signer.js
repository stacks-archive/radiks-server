const {
  makeECPrivateKey,
  getPublicKeyFromPrivate,
} = require('blockstack/lib/keys');
const { signECDSA } = require('blockstack/lib/encryption');
const uuid = require('uuid/v4');
const { COLLECTION } = require('../app/lib/constants');

class Signer {
  constructor(privateKey) {
    this.privateKey = privateKey || makeECPrivateKey();
    this.publicKey = getPublicKeyFromPrivate(this.privateKey);
    this._id = uuid();
  }

  save(db) {
    const { _id, privateKey, publicKey } = this;
    return db.collection(COLLECTION).insertOne({
      _id,
      privateKey,
      publicKey,
      radiksType: 'SigningKey',
    });
  }

  sign(doc) {
    const now = new Date().getTime();
    doc.updatedAt = now;
    doc.signingKeyId = doc.signingKeyId || this._id;
    const message = `${doc._id}-${doc.updatedAt}`;
    const { signature } = signECDSA(this.privateKey, message);
    doc.radiksSignature = signature;
    return doc;
  }
}

module.exports = Signer;
