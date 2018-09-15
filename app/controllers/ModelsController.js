const express = require('express');
const bodyParser = require('body-parser');
const BlockstackUser = require('../models/blockstack-user');

const makeModelsController = (models) => {
  const ModelsController = express.Router();
  ModelsController.use(bodyParser.json());

  Object.keys(models).forEach((modelName) => {
    const Model = models[modelName];
    ModelsController.get(`/${modelName}/schema`, (req, res) => {
      res.json(Model.schema.obj);
    });

    ModelsController.post(`/${modelName}`, async (req, res) => {
      const { attributes, username } = req.body;
      console.log(req.body);
      const user = await BlockstackUser.findOrCreateByUsername(username);
      const model = new Model({
        createdBy: user._id,
        ...attributes,
      });
      // console.log(model, user);
      await model.save();
      console.log(model.createdBy, user._id);
      res.json(model);
    });

    ModelsController.get(`/${modelName}`, async (req, res) => {
      const results = await Model.find().populate('createdBy').exec();
      console.log(results);
      res.json({ models: results });
    });

    ModelsController.get(`/${modelName}/:id`, async (req, res) => {
      const model = await Model.findOne({ uuid: req.params.id }).populate('createdBy').exec();
      res.json(model);
    });
  });

  return ModelsController;
};

module.exports = makeModelsController;
