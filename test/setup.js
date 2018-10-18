const getDB = require('./db');

jest.mock('request-promise', () => (options) => {
  const { models } = require('./mocks');
  const { uri } = options;
  // console.log(options);
  return Promise.resolve(models[uri]);
});

beforeEach(async (done) => {
  const db = await getDB();
  try {
    await db.drop();
  } catch (error) { }
  done();
});
