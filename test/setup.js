const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.test'),
});
const getDB = require('./db');
const { COLLECTION } = require('../app/lib/constants');

jest.mock(
  '../app/lib/validator',
  () =>
    class FakeValidator {
      validate() {
        return this;
      }
    }
);

jest.mock('request-promise', () => options => {
  const { models } = require('./mocks'); // eslint-disable-line
  const { uri } = options;
  return Promise.resolve(models[uri]);
});

beforeEach(async done => {
  const db = await getDB();
  try {
    await db.collection(COLLECTION).drop();
  } catch (error) {
    // collection doesn't exist
    // console.error(error);
  }
  done();
});
