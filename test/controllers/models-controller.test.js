require('../setup');
const request = require('supertest');
const getApp = require('../test-server');
const { models, saveAll } = require('../mocks');

test('it can crawl a gaia url', async () => {
  const app = await getApp();

  const model = models.test1;

  let response = await request(app).post('/radiks/models/crawl').send({ gaiaURL: 'test1' });
  expect(response.body.success).toEqual(true);

  response = await request(app).get(`/radiks/models/${model.id}`);
  expect(response.body.name).toEqual(model.name);
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
