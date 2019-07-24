import { makeECPrivateKey, getPublicKeyFromPrivate } from 'blockstack/lib/keys';
import { signECDSA } from 'blockstack/lib/encryption';
import { Db } from 'mongodb';
import uuid from 'uuid/v4';
import constants from '../src/lib/constants';

export default class Signer {
  public _id: string;
  public privateKey: string;
  public publicKey: string;

  constructor(privateKey?: string) {
    this.privateKey = privateKey || makeECPrivateKey();
    this.publicKey = getPublicKeyFromPrivate(this.privateKey);
    this._id = uuid();
  }

  save(db: Db) {
    const { _id, privateKey, publicKey } = this;
    return db.collection(constants.COLLECTION).insertOne({
      _id,
      privateKey,
      publicKey,
      radiksType: 'SigningKey',
    });
  }

  sign(doc: any) {
    const now = new Date().getTime();
    doc.updatedAt = now;
    doc.signingKeyId = doc.signingKeyId || this._id;
    const message = `${doc._id}-${doc.updatedAt}`;
    const { signature } = signECDSA(this.privateKey, message);
    doc.radiksSignature = signature;
    return doc;
  }
}
