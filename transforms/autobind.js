const BaseTransformer = require('./_transformer');
const AUTOBIND = 'autobind';
const AUTOBIND_IMPORT_PATH = 'core-decorators';

/**
 * 1. find all class definition without autobind decorator
 * 2. find if autobind has been imported, if not, import it first
 * 3. decorate class with autobind (last decorate)
 * 4. change arrow function to property
 */

class Transformer extends BaseTransformer {
  get decoratorName() {
    return this.config.decoratorName || AUTOBIND;
  }
  get decoratorPath() {
    return this.config.decoratorPath || AUTOBIND_IMPORT_PATH;
  }
  get isDefault() {
    return typeof this.config.isDefault === 'boolean' ? this.config.isDefault : false;
  }
  hasArrowFunctionAsProperty(nodePath) {
    const node = nodePath.value;
    const members = node.body.body;
    return members.some((member) => {
      if (member.type !== 'ClassProperty') return false;
      const { value, typeAnnotation } = member;
      if (!value) return false;
      const isArrowFunctionExpression = value.type === 'ArrowFunctionExpression';
      if (isArrowFunctionExpression && typeAnnotation) {
        this.report('unable to transform TypeScript arrow function with type annotation.');
        return false;
      }
      return isArrowFunctionExpression;
    });
  }
  hasNoAutobindAsDecorator(nodePath) {
    const node = nodePath.value;
    const { decorators } = node;
    return (decorators || []).every((decorator) => {
      const { expression } = decorator;
      if (expression.type !== 'Identifier') return true;
      return expression.name !== this.decoratorName;
    });
  }
  getAllClasses() {
    return this.root.find(this.j.ClassDeclaration)
      .filter(nodePath => this.hasArrowFunctionAsProperty(nodePath))
      .filter(nodePath => this.hasNoAutobindAsDecorator(nodePath));
  }
  hasAutobindImported() {
    const imports = this.root.find(this.j.ImportDeclaration, { source: { value: this.decoratorPath } })
      .filter((nodePath) => {
        const node = nodePath.value;
        const { specifiers } = node;
        return specifiers.some((specifier) => {
          if (specifier.type !== (this.isDefault ? 'ImportDefaultSpecifier' : 'ImportSpecifier')) {
            return false;
          }
          return specifier.imported.name === this.decoratorName;
        });
      });
    return imports.size() !== 0;
  }
  insertImportStatement() {
    const statement = this.j.importDeclaration(
      [
        (
          this.isDefault ? this.j.importDefaultSpecifier : this.j.importSpecifier
        )(this.j.identifier(this.decoratorName))
      ],
      this.j.stringLiteral(this.decoratorPath),
    );
    this.insertBeforeRelativeImport(statement);
  }
  mapDirectReturnArrowFunction(arrowFunction) {
    const returnValue = arrowFunction.body;
    const returnStatement = this.j.returnStatement(returnValue);
    const blockStatement = this.j.blockStatement([returnStatement]);
    const ret = this.j.functionExpression(
      arrowFunction.id,
      arrowFunction.params,
      blockStatement
    );
    ret.returnType = arrowFunction.returnType;
    return ret;
  }
  mapArrowFunction(arrowFunction) {
    arrowFunction.type = 'FunctionExpression';
    return arrowFunction;
  }
  transformClass(classNodePath) {
    const node = classNodePath.value;
    if (!node.decorators) node.decorators = [];
    node.decorators.push(
      this.j.decorator(this.j.identifier(this.decoratorName))
    );
    node.body.body.forEach(property => {
      if (property.type !== 'ClassProperty') return;
      if (!property.value) return;
      if (property.value.type !== 'ArrowFunctionExpression') return;
      if (property.value.body.type === 'BlockStatement') {
        property.value = this.mapArrowFunction(property.value);
      } else {
        property.value = this.mapDirectReturnArrowFunction(property.value);
      }
      property.type = 'ClassMethod';
    });
    return classNodePath;
  }
  run() {
    const classes = this.getAllClasses();
    if (classes.size() === 0) return this.root.toSource();
    if (!this.hasAutobindImported()) {
      this.insertImportStatement();
    }
    classes.map(nodePath => this.transformClass(nodePath));
    return this.root.toSource();
  }
}

function Transform(fileInfo, api, config) {
  const transformer = new Transformer(fileInfo, api, config);
  return transformer.run();
}

const configs = {
  decoratorName: AUTOBIND,
  decoratorPath: AUTOBIND_IMPORT_PATH,
  isDefault: false
};

module.exports = {
  default: Transform,
  configs,
  parser: /* istanbul ignore next */ process.env.NODE_ENV !== 'test' ? undefined : 'tsx'
};
