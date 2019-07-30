import { getPublicKeyFromPrivate } from 'blockstack/lib/keys';
import './setup';
import { models } from './mocks';
import getDB from './db';
import Signer from './signer';
import constants from '../src/lib/constants';
import Validator from '../src/lib/validator';

test('it validates new models', async () => {
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  const model: any = {
    ...models.hank,
  };
  signer.sign(model);
  expect(model.radiksSignature).not.toBeFalsy();
  const validator = new Validator(db.collection(constants.COLLECTION), model);
  expect(await validator.validate()).toEqual(true);
  expect(validator.attrs).toEqual(model);
  expect(validator.previous).toBeNull();
});

test('it doesnt allow mismatched signingKeyId', async () => {
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  const model = {
    ...models.hank,
  };
  signer.sign(model);
  await db.collection(constants.COLLECTION).insertOne(model);
  let validator = new Validator(db.collection(constants.COLLECTION), model);
  expect(await validator.validate()).toEqual(true);

  const secondSigner = new Signer();
  await secondSigner.save(db);
  secondSigner.sign(model);
  validator = new Validator(db.collection(constants.COLLECTION), model);
  try {
    await validator.validate();
  } catch (error) {
    expect(error.message.indexOf('Invalid radiksSignature')).not.toEqual(-1);
  }
});

test('it allows changing the signing key if signed with previous signing key', async () => {
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  const model: any = {
    ...models.hank,
  };
  signer.sign(model);
  await db.collection(constants.COLLECTION).insertOne(model);
  const secondSigner = new Signer();
  await secondSigner.save(db);
  model.signingKeyId = secondSigner._id;
  signer.sign(model);
  const validator = new Validator(db.collection(constants.COLLECTION), model);
  expect(await validator.validate()).toEqual(true);
});

test('it doesnt allow older updatedAt', async () => {
  const model = {
    ...models.notUpdatable,
  };
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  signer.sign(model);
  await db.collection(constants.COLLECTION).insertOne(model);
  signer.sign(model);
  const validator = new Validator(db.collection(constants.COLLECTION), model);
  await expect(validator.validate()).rejects.toThrow(
    'Tried to update a non-updatable model'
  );
});

test('a model signing key must match the user group signing key', async () => {
  const model: any = {
    ...models.withGroup,
  };
  const group = {
    ...models.userGroup,
  };
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  await signer.sign(group);
  const groupValidator = new Validator(
    db.collection(constants.COLLECTION),
    group
  );
  const modelValidator = new Validator(
    db.collection(constants.COLLECTION),
    model
  );
  expect(await groupValidator.validate()).toEqual(true);
  signer.sign(model);
  expect(await modelValidator.validate()).toEqual(true);
  await db.collection(constants.COLLECTION).insertMany([model, group]);
  const newSigner = new Signer();
  model.signingKeyId = newSigner._id;
  await newSigner.save(db);
  signer.sign(model);
  const newModelValidator = new Validator(
    db.collection(constants.COLLECTION),
    model
  );
  await expect(newModelValidator.validate()).rejects.toThrow();
});

test('allows signing with new key if it matches the user group key', async () => {
  const model: any = {
    ...models.withGroup,
  };
  const group: any = {
    ...models.userGroup,
  };
  const oldSigner = new Signer();
  const db = await getDB();
  oldSigner.sign(group);
  oldSigner.sign(model);
  await db.collection(constants.COLLECTION).insertMany([group, model]);
  const newSigner = new Signer();
  group.signingKeyId = newSigner._id;
  newSigner.sign(group);
  await db.collection(constants.COLLECTION).save(group);
  model.signingKeyId = newSigner._id;
  newSigner.sign(model);
  await newSigner.save(db);
  const validator = new Validator(db.collection(constants.COLLECTION), model);
  expect(await validator.validate()).toEqual(true);
});

test('allows users to use personal signing key', async () => {
  const privateKey =
    '476055baaef9224ad0f9d082696a35b03f0a75100948d8b76ae1e859946297dd';
  const publicKey = getPublicKeyFromPrivate(privateKey);
  const user = {
    ...models.user,
    publicKey,
  };
  const signer = new Signer(privateKey);
  const db = await getDB();
  signer.sign(user);
  const validator = new Validator(db.collection(constants.COLLECTION), user);
  expect(await validator.validate()).toEqual(true);
});

test('throws if username included and gaia URL not found in profile', async () => {
  const model = {
    ...models.withUsername,
  };
  model.gaiaURL = `https://gaia.blockstack.org/hub/1Me8MbfjnNEeK5MWGokVM6BLy9UbBf7kTF/ModelName/${model._id}`;
  const signer = new Signer();
  const db = await getDB();
  signer.sign(model);
  await signer.save(db);
  await db.collection(constants.COLLECTION).insertOne(model);
  const validator = new Validator(
    db.collection(constants.COLLECTION),
    model,
    model.gaiaURL
  );
  await expect(validator.validate()).rejects.toThrow(
    'Username does not match provided Gaia URL'
  );
});

test('is valid if username included and gaia URL is found in profile', async () => {
  const model = {
    ...models.withUsername,
  };
  model.gaiaURL = `https://gaia.blockstack.org/hub/1Me8MbfjnNEeK5MWGokVM6BLy9UbBf7kTD/ModelName/${model._id}`;
  const signer = new Signer();
  const db = await getDB();
  signer.sign(model);
  await signer.save(db);
  await db.collection(constants.COLLECTION).insertOne(model);
  const validator = new Validator(
    db.collection(constants.COLLECTION),
    model,
    model.gaiaURL
  );
  expect(await validator.validate()).toEqual(true);
});
