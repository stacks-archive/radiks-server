import faker from 'faker';
import getDB from './db';
import constants from '../src/lib/constants';

const userGroupId = faker.random.uuid();

interface MockModel {
  _id: string;
  updatedAt?: number;
  createdAt?: number;
  signingKeyId?: string;
  [key: string]: any;
}

interface Models {
  [key: string]: MockModel;
}

const models: Models = {
  test1: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    info: faker.helpers.createCard(),
    _id: faker.random.uuid(),
  },
  hank: {
    name: 'hank stoever',
    age: 120,
    _id: faker.random.uuid(),
  },
  myla: {
    name: 'Myla',
    age: 4.5,
    _id: faker.random.uuid(),
  },
  notUpdatable: {
    updatable: false,
    _id: faker.random.uuid(),
  },
  userGroup: {
    radiksType: 'UserGroup',
    _id: userGroupId,
  },
  withGroup: {
    _id: faker.random.uuid(),
    userGroupId,
  },
  user: {
    username: 'hankstoever.id',
    signingKeyId: 'personal',
    _id: faker.random.uuid(),
  },
};

const saveAll = async () => {
  const db = await getDB();
  const data = Object.values(models);
  await db.collection(constants.COLLECTION).insertMany(data);
};

export { models, saveAll };
