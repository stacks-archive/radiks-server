require('./setup');
const { models } = require('./mocks');
const getDB = require('./db');
const Signer = require('./signer');

const Validator = require.requireActual('../app/lib/validator');

test('it validates new models', async () => {
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  const model = {
    ...models.hank,
  };
  signer.sign(model);
  expect(model.signature).not.toBeFalsy();
  const validator = new Validator(db, model);
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
  await db.insertOne(model);
  let validator = new Validator(db, model);
  expect(await validator.validate()).toEqual(true);

  const secondSigner = new Signer();
  await secondSigner.save(db);
  secondSigner.sign(model);
  validator = new Validator(db, model);
  try {
    await validator.validate();
  } catch (error) {
    expect(error.message.indexOf('Invalid signature')).not.toEqual(-1);
  }
});

test('it allows changing the signing key if signed with previous signing key', async () => {
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  const model = {
    ...models.hank,
  };
  signer.sign(model);
  await db.insertOne(model);
  const secondSigner = new Signer();
  await secondSigner.save(db);
  model.signingKeyId = secondSigner._id;
  signer.sign(model);
  const validator = new Validator(db, model);
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
  await db.insertOne(model);
  signer.sign(model);
  const validator = new Validator(db, model);
  await expect(validator.validate()).rejects.toThrow('Tried to update a non-updatable model');
});

test('a model signing key must match the user group signing key', async () => {
  const model = {
    ...models.withGroup,
  };
  const group = {
    ...models.userGroup,
  };
  const signer = new Signer();
  const db = await getDB();
  await signer.save(db);
  await signer.sign(group);
  const groupValidator = new Validator(db, group);
  const modelValidator = new Validator(db, model);
  expect(await groupValidator.validate()).toEqual(true);
  signer.sign(model);
  expect(await modelValidator.validate()).toEqual(true);
  await db.insertMany([model, group]);
  const newSigner = new Signer();
  model.signingKeyId = newSigner._id;
  await newSigner.save(db);
  signer.sign(model);
  const newModelValidator = new Validator(db, model);
  await expect(newModelValidator.validate()).rejects.toThrow();
});

test('allows signing with new key if it matches the user group key', async () => {
  const model = {
    ...models.withGroup,
  };
  const group = {
    ...models.userGroup,
  };
  const oldSigner = new Signer();
  const db = await getDB();
  oldSigner.sign(group);
  oldSigner.sign(model);
  await db.insertMany([group, model]);
  const newSigner = new Signer();
  group.signingKeyId = newSigner._id;
  newSigner.sign(group);
  await db.save(group);
  model.signingKeyId = newSigner._id;
  newSigner.sign(model);
  await newSigner.save(db);
  const validator = new Validator(db, model);
  expect(await validator.validate()).toEqual(true);
});
