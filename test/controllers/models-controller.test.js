require('../setup');
const request = require('supertest');
const { signECDSA } = require('blockstack/lib/encryption');
const {
  makeECPrivateKey,
} = require("blockstack/lib/keys");
const getApp = require('../test-server');
const { models, saveAll } = require('../mocks');
const Signer = require('../signer');
const getDB = require('../db');
const { COLLECTION } = require('../../app/lib/constants');

test('it can crawl a gaia url', async () => {
  const app = await getApp();

  const model = { ...models.test1 };

  let response = await request(app).post('/radiks/models/crawl').send({ gaiaURL: 'test1' });
  expect(response.body.success).toEqual(true);

  response = await request(app).get(`/radiks/models/${model._id}`);
  expect(response.body.name).toEqual(model.name);
});

test('it can save the same model twice', async () => {
  const app = await getApp();
  let response = await request(app).post('/radiks/models/crawl').send({ gaiaURL: 'test1' });
  expect(response.body.success).toEqual(true);
  response = await request(app).post('/radiks/models/crawl').send({ gaiaURL: 'test1' });
  expect(response.body.success).toEqual(true);
});

const getDocs = async (app, query) => {
  const req = request(app).get('/radiks/models/find').query(query);
  const response = await req;
  const { results } = response.body;
  return results;
};

test('it can query', async () => {
  const app = await getApp();
  await saveAll();

  const query = {
    name: {
      $regex: 'k sto',
    },
  };
  const [model] = await getDocs(app, query);
  expect(model.name).toEqual(models.hank.name);
});

test('it can query with options', async () => {
  const app = await getApp();
  await saveAll();
  const query = {
    name: {
      $exists: true,
    },
    limit: 1,
  };
  const results = await getDocs(app, query);
  expect(results.length).toEqual(1);
});

test('it includes pagination links', async () => {
  const app = await getApp();
  await saveAll();
  const response = await request(app).get('/radiks/models/find').query({ limit: 1 });
  expect(response.body.next).not.toBeFalsy();
  expect(response.body.last).not.toBeFalsy();
  expect(response.body.total).not.toBeFalsy();
});

test('it can delete a model', async () => {
  const app = await getApp();
  const model = { ...models.test1 };
  const signer = new Signer();
  signer.sign(model);
  const db = await getDB();
  const radiksData = db.collection(COLLECTION);
  await signer.save(db);
  await radiksData.insertOne(model);
  const { signature } = signECDSA(
    signer.privateKey,
    `${model._id}-${model.updatedAt}`
  );
  const response = await request(app).del(`/radiks/models/${model._id}`).query({ signature });
  expect(response.body.success).toEqual(true);
  const dbModel = await radiksData.findOne({ _id: model._id });
  expect(dbModel).toBeNull();
});

test('it cannot delete with an invalid signature', async () => {
  const app = await getApp();
  const model = { ...models.test1 };
  const signer = new Signer();
  signer.sign(model);
  const db = await getDB();
  const radiksData = db.collection(COLLECTION);
  await signer.save(db);
  await radiksData.insertOne(model);
  const { signature } = signECDSA(makeECPrivateKey(), `${model._id}-${model.updatedAt}`);
  const response = await request(app)
    .del(`/radiks/models/${model._id}`)
    .query({ signature });
  expect(response.body.success).toEqual(false);
  const dbModel = await radiksData.findOne({ _id: model._id });
  expect(dbModel).not.toBeNull();
});
