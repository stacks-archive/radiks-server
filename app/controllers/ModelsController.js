const express = require('express');

const makeModelsController = (models) => {
  const ModelsController = express.Router();
  Object.keys(models).forEach((modelName) => {
    const Model = models[modelName];
    ModelsController.get(`/${modelName}/schema`, (req, res) => {
      res.json(Model.schema.obj);
    });

    ModelsController.post(`/${modelName}`, async (req, res) => {
      const attrs = req.body;
      const model = new Model(attrs);
      console.log(model);
      await model.save();
      console.log(model);
      res.json(model);
    });

    ModelsController.get(`/${modelName}`, async (req, res) => {
      const results = await Model.find().exec();
      console.log(results);
      res.json({ models: results });
    });
  });

  return ModelsController;
};

module.exports = makeModelsController;
