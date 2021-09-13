import dotenv from 'dotenv';
import path from 'path';
import getDB from './db';
import constants from '../src/lib/constants';
import { getClient } from '../src/database/mongodb';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
});

jest.mock('request-promise', () => options => {
  const { models } = require('./mocks'); // eslint-disable-line
  const { uri } = options;
  return Promise.resolve(models[uri]);
});

beforeEach(async () => {
  const db = await getDB();
  try {
    await db.collection(constants.COLLECTION).drop();
  } catch (error) {
    // collection doesn't exist
    // console.error(error);
  }
});

afterAll(async () => {
  const client = await getClient();
  await client.close();
});
