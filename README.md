# some-codemod

This repository contains codemod script(s) for use with [JSCodeshift](https://github.com/facebook/jscodeshift) and a command line tool to trigger refactor by selecting specific codemod to run.

## Installation & Usage

To install the tool, run:

```bash
npm install -g some-codemod
```

After installation, you can run the following command to select codemod to refactor your code:

```bash
refactor
```

Above example shows global installation. In production, it's recommended to use local installation instead. In this way, it's recommended to use npm-scripts to run `refactor`, as it will help find the correct location of command line tool.

## Built-in Codemods

### iconfont

This codemod will transform `<i className="iconfont icon-xxx" />` to `<Icon type="xxx" />` and import `Icon` component to file if not imported already.

This codemod will be useful when migrating iconfont to SVG. Following illustrates a series of possible steps:

1. Create a React component that will render iconfont, example:

```typescript
const Icon: React.FC<{ type: string }> = props => {
  const { className, type, ...rest } = props;
  return (
    <i className={classnames('iconfont', `icon-${props.type}`, className)} {...rest} />
  );
};
```

2. Run this codemod to transform all usages of iconfont, use component above instead.
3. Refactor component above to use SVG instead.

Options required:

+ `iconName`: The name of component that will be used, such as `Icon`
+ `importPath`: The path of component, which will be used to insert import statement (only if component not imported already)

### autobind

This codemod will transform class definition to use `autobind` decorator instead of using class property for `this` bind. Example:

Input the following class definition:

```javascript
class Component extends React.Component {
  onClick = () => { };
  render() {
    return null;
  }
}
```

Transform result will be:

```javascript
import { autobind } from 'core-decorators';

@autobind
class Component extends React.Component {
  onClick() { }
  render() {
    return null;
  }
}
```

Possible configs for this codemod are:

+ decoratorName: Name of decorator, default is `autobind`
+ decoratorPath: Path of decorator library, default is `core-decorators`
+ isDefault: Whether should use default import for decorator, default is `false`
