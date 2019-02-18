const faker = require('faker');
const getDB = require('./db');

const userGroupId = faker.random.uuid();

const models = {
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
  }
};

const saveAll = async () => {
  const db = await getDB();
  const data = Object.values(models);
  await db.insertMany(data);
};

module.exports = {
  models,
  saveAll,
};
