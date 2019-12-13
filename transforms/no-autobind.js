const BaseTransformer = require('./_transformer');
const AUTOBIND = 'autobind';
const AUTOBIND_IMPORT_PATH = 'core-decorators';

/**
 * 1. find all class definition with autobind decorator (on method or on class);
 * 2. find if autobind has been imported, if yes, remove it;
 * 3. if autobind is used to decorate class method, change it to arrow function;
 * 4. if autobind is used to decorate whole class, change all class methods to arrow functions
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
  isDecorator(decorator) {
    const { expression } = decorator;
    if (expression.type !== 'Identifier') return false;
    return expression.name === this.decoratorName;
  }
  hasAutobindDecorator(decorators) {
    if (!decorators) return false;
    return decorators.some((decorator) => {
      return this.isDecorator(decorator);
    });
  }
  hasAutobindAsDecoratorInClass(nodePath) {
    const node = nodePath.value;
    const { decorators } = node;
    return this.hasAutobindDecorator(decorators);
  }
  hasAutobindAsDecoratorInMethod(nodePath) {
    const node = nodePath.value;
    const members = node.body.body;
    return members.some((member) => {
      if (member.type !== 'ClassMethod') return;
      const { decorators } = member;
      const has = this.hasAutobindDecorator(decorators);
      return has;
    });
  }
  getAllClasses() {
    return this.root.find(this.j.ClassDeclaration)
      .filter(nodePath =>
        this.hasAutobindAsDecoratorInMethod(nodePath) ||
        this.hasAutobindAsDecoratorInClass(nodePath)
      );
  }
  removeAutobindImported() {
    const imports =
      this.root.find(this.j.ImportDeclaration, { source: { value: this.decoratorPath } });
    if (this.isDefault) {
      imports.forEach((nodePath) => {
        const node = nodePath.value;
        const shouldRemove = node.specifiers.some(specifier => {
          return specifier.type === 'ImportDefaultSpecifier';
        });
        if (!shouldRemove) return;
        if (node.specifiers.length === 1) this.j(nodePath).remove();
        this.j(nodePath).find(this.j.ImportDefaultSpecifier).remove();
      });
      return;
    }
    imports.forEach((nodePath) => {
        const node = nodePath.value;
        node.specifiers = node.specifiers.filter(specifier => {
          if (specifier.type !== 'ImportSpecifier') return true;
          if (specifier.imported.name === this.decoratorName) return false;
          return true;
        });
        if (node.specifiers.length === 0) this.j(nodePath).remove();
      });
  }
  changeClassMethodToArrowFunction(nodePath) {
    const node = nodePath.value;
    if (node.decorators) {
      node.decorators = node.decorators.filter(decorator => !this.isDecorator(decorator));
    }
    node.type = 'ClassProperty';
    const { async, returnType } = node;
    node.value = this.j.arrowFunctionExpression(
      node.params,
      node.body
    );
    node.value.async = async;
    node.value.returnType = returnType;
  }
  transformClassMethod(classNodePath) {
    const methods = this.j(classNodePath).find(this.j.ClassMethod)
      .filter((nodePath) => {
        const node = nodePath.value;
        const { decorators } = node;
        return this.hasAutobindDecorator(decorators);
      });
    methods.forEach((method) => {
      this.changeClassMethodToArrowFunction(method);
    });
  }
  transformClass(classNodePath) {
    const hasDecorator = this.hasAutobindAsDecoratorInClass(classNodePath);
    if (!hasDecorator) return;
    const node = classNodePath.value;
    node.decorators = node.decorators.filter(decorator => !this.isDecorator(decorator));
    this.j(classNodePath)
      .find(this.j.ClassMethod)
      .forEach((nodePath) => {
        this.changeClassMethodToArrowFunction(nodePath);
      });
  }
  run() {
    this.removeAutobindImported();
    const classes = this.getAllClasses();
    if (classes.size() === 0) return this.root.toSource();
    classes.forEach(nodePath => {
      this.transformClassMethod(nodePath);
      this.transformClass(nodePath);
    });
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
