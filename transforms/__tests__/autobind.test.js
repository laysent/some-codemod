const { defineTest } = require('jscodeshift/dist/testUtils');

[
  'autobind',
  'autobind-ts',
  'autobind-no-match',
  'autobind-directly-return',
  'autobind-already-imported',
].forEach((testCase) => {
  defineTest(__dirname, 'autobind', null, testCase);
});

const config = {
  decoratorName: 'bind',
  decoratorPath: 'my-decorators',
  isDefault: true
};
defineTest(__dirname, 'autobind', config, 'autobind-config')
