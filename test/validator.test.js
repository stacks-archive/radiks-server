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
  // const doc = await db.findOne({ _id: models.hank._id });
  // expect(doc).not.toBeFalsy();
});

// test('it doesnt allow mismatched signingKeyId');

// test('it doesnt allow older updatedAt');
