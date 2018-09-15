const fs = require('fs-extra');
const mongoose = require('mongoose');
const BlockstackUser = require('./blockstack-user');

const typeStringToClass = type => ({
  string: String,
  date: Date,
  array: Array,
  boolean: Boolean,
  number: Number,
}[type]);

const readModels = async (schemasFolder) => {
  const modelDirs = await fs.readdir(schemasFolder);
  const models = {};
  const readAllFiles = modelDirs.map(file => new Promise(async (resolve) => {
    const { name, ...options } = await fs.readJson(`${schemasFolder}/${file}`);
    models[name] = options;
    resolve(models);
  }));
  await Promise.all(readAllFiles);
  return models;
};

const getMongooseModels = (models) => {
  const mongooseModels = {
    BlockstackUser,
  };
  Object.keys(models).forEach((modelName) => {
    const convertedAttrs = {
      uuid: String,
      filePath: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlockstackUser',
      },
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

const fetchModels = async (schemasFolder) => {
  const models = getMongooseModels(await readModels(schemasFolder));
  return models;
};

module.exports = fetchModels;
