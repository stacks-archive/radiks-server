import dotenv from 'dotenv';
import path from 'path';
import getDB from './db';
import constants from '../src/lib/constants';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
});

jest.mock('request-promise', () => options => {
  const { models, users } = require('./mocks'); // eslint-disable-line
  const { uri }: { uri: string } = options;
  if (uri.startsWith('https://core.blockstack.org/v1/users')) {
    return Promise.resolve(users[uri]);
  }
  return Promise.resolve(models[uri]);
});

beforeEach(async done => {
  const db = await getDB();
  try {
    await db.collection(constants.COLLECTION).drop();
  } catch (error) {
    // collection doesn't exist
    // console.error(error);
  }
  done();
});
