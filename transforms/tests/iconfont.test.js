const { defineTest, defineInlineTest } = require('jscodeshift/dist/testUtils');
const testConfig = {
  importPath: 'path/to/component/icon',
  iconName: 'CustomIcon',
};

[
  'iconfont',
  'iconfont-empty-className',
  'iconfont-no-match',
  'iconfont-already-imported',
  'iconfont-name-used',
].forEach((testCase) => {
  defineTest(__dirname, 'iconfont', testConfig, testCase);
});

defineTest(__dirname, 'iconfont', testConfig, 'iconfont-type');
