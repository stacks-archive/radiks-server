const { makeECPrivateKey, getPublicKeyFromPrivate } = require('blockstack/lib/keys');
const { signECDSA } = require('blockstack/lib/encryption');
const uuid = require('uuid/v4');

class Signer {
  constructor(privateKey) {
    this.privateKey = privateKey || makeECPrivateKey();
    this.publicKey = getPublicKeyFromPrivate(this.privateKey);
    this._id = uuid();
  }

  save(db) {
    const { _id, privateKey, publicKey } = this;
    return db.insertOne({
      _id,
      privateKey,
      publicKey,
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
