#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const glob = require('glob');
const Runner = require('jscodeshift/src/Runner');
const argv = require('yargs')
  .option('folder', {
    alias: 'f',
    default: './src'
  })
  .option('transforms', {
    alias: 't',
    default: '',
  })
  .option('yes', {
    alias: 'y',
    default: true
  })
  .boolean('all')
  .argv;

const folder = path.resolve(__filename, '..', 'transforms');
const files = fs.readdirSync(folder)
  .filter(filename => filename.endsWith('js'))
  .filter(filename => !filename.startsWith('_'));
const choices = files.map(file => ({
  title: path.parse(file).name,
  value: path.resolve(__filename, '../transforms', file),
}));

function getConfigs(filename) {
  const { configs } = require(filename);
  const configNames = Object.keys(configs);
  const configPath = path.resolve(process.cwd(), '.refactorrc');
  if (fs.existsSync(configPath)) {
    return new Promise((resolve, reject) => {
      fs.readFile(configPath, 'utf8', (error, content) => {
        if (error) return reject(error);
        try {
          const json = JSON.parse(content);
          const { name } = path.parse(filename);
          return resolve(Object.assign({}, configs, json[name]));
        } catch (e) {
          return reject(e);
        }
      });
    });
  }
  if (argv.yes) {
    return Promise.resolve(configs);
  }
  return new Promise((resolve) => {
    if (configNames.length === 0) return resolve({});
    prompts(configNames.map(name => ({
      type: typeof configs[name] === 'boolean' ? 'confirm' : 'text',
      name,
      message: `value of ${name}`,
      initial: configs[name],
      validate(value) {
        if (value === '' || value === undefined) return `${name} is required!`;
        return true;
      },
    }))).then(resolve);
  });
}

function execute(filename) {
  return getConfigs(filename).then((configs) => {
    const files = glob.sync(path.resolve(process.cwd(), argv.folder, './*'));
    Runner.run(
      filename,
      files,
      {
        extensions: 'js,jsx,ts,tsx',
        parser: 'tsx',
        ...configs
      }
    );
  });
}

if (argv.all) {
  choices.forEach((choice) => {
    const transformer = choice.value;
    execute(transformer);
  });
} else if (argv.transforms) {
  const allTransforms = argv.transforms.split(',');
  const used = choices.filter(ch => allTransforms.some(t => ch.title === t));
  used.forEach((choice) => {
    const transformer = choice.value;
    execute(transformer);
  });
} else if (choices.length === 1) {
  const transformer = choices[0].value;
  console.warn('[NOTICE]: Only one transformer detected, use directly. Transformer: ', transformer);
  console.log(transformer);
  console.log('\n');
  execute(transformer);
} else {
  prompts([
    {
      type: 'select',
      name: 'transformer',
      message: 'select transformer that you would like to apply',
      choices,
    },
  ]).then(({ transformer }) => {
    execute(transformer);
  });
}
