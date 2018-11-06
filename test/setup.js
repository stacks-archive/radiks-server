const getDB = require('./db');

jest.mock('../app/lib/validator', () => class FakeValidator {
  validate() {
    return this;
  }
});

jest.mock('request-promise', () => (options) => {
  const { models } = require('./mocks'); // eslint-disable-line
  const { uri } = options;
  return Promise.resolve(models[uri]);
});

beforeEach(async (done) => {
  const db = await getDB();
  try {
    await db.drop();
  } catch (error) {
    // collection doesn't exist
  }
  done();
});
