import { makeECPrivateKey, getPublicKeyFromPrivate } from 'blockstack/lib/keys';
import { signECDSA } from 'blockstack/lib/encryption';
import uuid from 'uuid/v4';
import constants from '../src/lib/constants';

export default class Signer {
  private _id: string;
  private privateKey: string;
  private publicKey: string;

  constructor(privateKey?: string) {
    this.privateKey = privateKey || makeECPrivateKey();
    this.publicKey = getPublicKeyFromPrivate(this.privateKey);
    this._id = uuid();
  }

  save(db) {
    const { _id, privateKey, publicKey } = this;
    return db.collection(constants.COLLECTION).insertOne({
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
