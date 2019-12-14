const { defineTest } = require('jscodeshift/dist/testUtils');

[
  'no-autobind',
  'no-autobind-lift-properties-ts',
  'no-autobind-no-match',
  'no-autobind-ts',
  'no-autobind-class',
  'no-autobind-class-ts'
].forEach((testCase) => {
  defineTest(__dirname, 'no-autobind', null, testCase);
});

const config = {
  decoratorName: 'bind',
  decoratorPath: 'my-decorators',
  isDefault: true
};
defineTest(__dirname, 'no-autobind', config, 'no-autobind-config');
