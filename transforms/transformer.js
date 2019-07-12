class Transformer {
  constructor(fileInfo, api, config) {
    this.fileInfo = fileInfo;
    this.api = api;
    this.config = config;
  }
  get j() {
    return this.api.jscodeshift;
  }
  get root() {
    if (!this._root) this._root = this.j(this.fileInfo.source);
    return this._root;
  }
  get program() {
    return this.root.find(this.j.Program).get(0);
  }
  report(...info) {
    /**
     * In jscodeshift built-in unit test utility, `report` is not provided as part of `api`.
     * Check `runInlineTest` in `src/testUtils.js` for details.
     * As a workaround, output things to stdout using `console.log` for unit test.
     */
    if (process.env.NODE_ENV === 'test') {
      console.log(...info);
    } else {
      /* istanbul ignore next */
      this.api.report(...info);
    } 
  }
  insertBeforeRelativeImport(statement) {
    const { body } = this.program.node;
    let insertIndex = 0;
    while (body[insertIndex].type === 'ImportDeclaration') {
      if (body[insertIndex].source.value[0] === '.') break;
      insertIndex += 1;
    }
    body.splice(
      insertIndex,
      0,
      statement,
    );
    return;
  }
  run() {
    console.error('Overwrite base method to implement own transform');
    return this.root.toSource();
  }
}

module.exports = Transformer;
