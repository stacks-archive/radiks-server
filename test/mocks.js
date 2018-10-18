const faker = require('faker');
const getDB = require('./db');

const models = {
  test1: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    info: faker.helpers.createCard(),
    id: faker.random.uuid(),
  },
  hank: {
    name: 'hank stoever',
    age: 120,
    id: faker.random.uuid(),
  },
  myla: {
    name: 'Myla',
    age: 4.5,
    id: faker.random.uuid(),
  },
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
