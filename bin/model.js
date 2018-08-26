const yargs = require('yargs');
const fs = require('fs-extra');

const model = yargs
  .usage('$0 <cmd> [args]')
  .command('generate:model', 'Generate a model file', {
    name: {
      type: 'string',
      describe: "Your model's name",
    },
    attributes: {
      type: 'array',
      describe: 'A space-separated list of your attributes. Example: --attributes name:string',
    },
  },
  async (argv) => {
    // console.log(argv);
    const { name, attributes } = argv;
    console.log('name', name);
    const attrs = {};
    attributes.forEach((attr) => {
      const [attrName, type] = attr.split(':');
      attrs[attrName] = { name: attrName, type };
    });
    const json = {
      name,
      attributes: attrs,
    };
    console.log(json);
    await fs.outputJson(`./models/${name}.json`, json, { spaces: 2 });
    console.log('done');
  })
  .help()
  .argv;

module.exports = {
  model,
};
