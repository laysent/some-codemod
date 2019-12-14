const fs = require('fs');
const path = require('path');
const { defineTest } = require('jscodeshift/dist/testUtils');

module.exports = {
  defineTest(dirName, transformName, options, testFilePrefix, testOptions = {}) {
    const fixtures = path.resolve(dirName, '..', '__testfixtures__');
    let parser = 'babylon';
    if (testOptions && testOptions.parser) parser = testOptions.parser;
    else if (fs.existsSync(path.resolve(fixtures, testFilePrefix + '.input.ts'))) {
      parser = 'ts';
    } else if (fs.existsSync(path.resolve(fixtures, testFilePrefix + '.input.tsx'))) {
      parser = 'tsx';
    }
    defineTest(dirName, transformName, options, testFilePrefix, Object.assign(testOptions, { parser }));
  },
};
