const fs = require('fs-extra');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/radiks');

const typeStringToClass = type => ({
  string: String,
  date: Date,
  array: Array,
  boolean: Boolean,
  number: Number,
}[type]);

const readModels = async () => {
  const modelDirs = await fs.readdir('./models');
  const models = {};
  const readAllFiles = modelDirs.map(file => new Promise(async (resolve) => {
    const { name, ...options } = await fs.readJson(`./models/${file}`);
    models[name] = options;
    resolve(models);
  }));
  await Promise.all(readAllFiles);
  return models;
};

const getMongooseModels = (models) => {
  const mongooseModels = {};
  Object.keys(models).forEach((modelName) => {
    const convertedAttrs = {
      uuid: String,
      filePath: String,
    };
    Object.keys(models[modelName].attributes).forEach((name) => {
      const { type, decrypted } = models[modelName].attributes[name];
      const typeClass = decrypted ? typeStringToClass(type) : Object;
      convertedAttrs[name] = {
        type: typeClass,
        stringType: decrypted ? type : 'object',
        decrypted,
      };
    });
    const schema = new mongoose.Schema(convertedAttrs);
    mongooseModels[modelName] = mongoose.model(modelName, schema);
  });
  return mongooseModels;
};

const fetchModels = async () => {
  const models = getMongooseModels(await readModels());
  return models;
};

module.exports = fetchModels;
