import faker from 'faker';
import getDB from './db';
import constants from '../src/lib/constants';

const userGroupId = faker.datatype.uuid();

const models = {
  test1: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    info: faker.helpers.createCard(),
    _id: faker.datatype.uuid(),
  },
  hank: {
    name: 'hank stoever',
    age: 120,
    _id: faker.datatype.uuid(),
  },
  myla: {
    name: 'Myla',
    age: 4.5,
    _id: faker.datatype.uuid(),
  },
  notUpdatable: {
    updatable: false,
    _id: faker.datatype.uuid(),
  },
  userGroup: {
    radiksType: 'UserGroup',
    _id: userGroupId,
  },
  withGroup: {
    _id: faker.datatype.uuid(),
    userGroupId,
  },
  user: {
    username: 'hankstoever.id',
    signingKeyId: 'personal',
    _id: faker.datatype.uuid(),
  },
};

const saveAll = async () => {
  const db = await getDB();
  const data = Object.values(models);
  await db.collection(constants.COLLECTION).insertMany(data);
};

export { models, saveAll };
