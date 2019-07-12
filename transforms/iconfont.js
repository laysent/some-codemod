const BaseTransformer = require('./transformer');
const PREFIX = 'icon-';
/**
 * 1. find if <i className="iconfont"></i>, no => end; yes => continue
 * 2. find if path/to/icon has been imported, yes => 3; no => 4
 * 3. find name of imported icon, save it; => 5
 * 4. import icon from path/to/icon, use provided name; fail if name has been used (locally in scope); => 5
 * 5. use IconName to refactor
 */

class Transformer extends BaseTransformer {
  getAllIconfontUsages() {
    return this.root.findJSXElements('i')
      .filter(this.j.filters.JSXElement.hasAttributes({
        className: (input) => /(?:^| )iconfont(?:$| )/.test(input),
      }));
  }
  getImportByConfigPath() {
    const path = this.config.importPath;
    return this.root.find(this.j.ImportDeclaration, { source: { value: path } })
      .find(this.j.ImportDefaultSpecifier);
  }
  getImportVariableName() {
    const importNodes = this.getImportByConfigPath();
    let name = null;
    importNodes.forEach(node => {
      name = node.value.local.name;
    });
    return name;
  }
  getUniqGloablName(initialName) {
    let name = initialName;
    while (this.program.scope.lookup(name)) {
      name = name + '_';
    }
    return name;
  }
  insertImportStatement() {
    const { importPath } = this.config;
    const iconName = this.getUniqGloablName(this.config.iconName);

    const statement = this.j.importDeclaration(
      [this.j.importDefaultSpecifier(this.j.identifier(iconName))],
      this.j.stringLiteral(importPath),
    );
    this.insertBeforeRelativeImport(statement);

    return iconName;
  }
  transformComponentName(component, name) {
    const { openingElement } = component.value;
    const definition = component.scope.lookup(name);
    // istanbul ignore next
    if (definition && !definition.isGlobal) {
      this.report(`${name} has been used locally, rename required.`);
      // rename local
      // const rename = definition.declareTemporary();
      // this.j(definition.node)
      //   .find(this.j.VariableDeclarator, { id: { name } })
      //   .renameTo(rename.name);
    }
    openingElement.name.name = name;
  }
  transformComponentProps(component) {
    const { openingElement } = component.value;
    let type;
    openingElement.attributes = openingElement.attributes.filter((attribute) => {
      if (!this.j.JSXAttribute.check(attribute)) return true;
      const propName = attribute.name.name;
      if (propName === 'type') {
        this.report('has type defined, will be replaced.');
        return false;
      }
      if (propName !== 'className') return true;
      /**
       * Notice: className is ensured to be 'string',
       * otherwise this component won't be picked up by `this.getAllIconfontUsages`
       */
      const className = attribute.value.value;
      const classList = className.split(' ');
      const restClassName = classList
        .filter(c => c !== 'iconfont' && c.indexOf(PREFIX) !== 0)
        .join(' ');
      type = classList.filter(c => c.indexOf(PREFIX) === 0).map(c => c.substr(PREFIX.length))[0];
      
      if (restClassName) {
        attribute.value.value = restClassName;
        return true;
      }
      return false;
    });
    openingElement.attributes.push(this.j.jsxAttribute(this.j.jsxIdentifier('type'), this.j.literal(type)));
    return;
  }
  transformIcon(component, name) {
    this.transformComponentName(component, name);
    this.transformComponentProps(component);
    return component;
  }
  run() {
    const matches = this.getAllIconfontUsages();
    if (matches.size() === 0) return this.fileInfo.source;

    let name = this.getImportVariableName();
    if (!name) {
      name = this.insertImportStatement();
    }

    matches.map((match) => this.transformIcon(match, name), this.j.JSXElement);

    return this.root.toSource();
  }
}

function Transform(fileInfo, api, config) {
  const transformer = new Transformer(fileInfo, api, config);
  return transformer.run();
}

const configs = {
  iconName: 'Icon',
  importPath: undefined,
};

module.exports = { default: Transform, configs };
