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

Several CLI flag you can use:

+ `--folder` / `-f`: folder of source code where transform should be applied, default value is `./src`;
+ `--transforms` / `-t`: transforms to use, use comma to separate; if no transform is provided, CLI will ask to choose manually. Example: `-t iconfont,no-autobind`;
+ `--yes` / `-y`: use default config directly; if this flag is not provided, CLI will tries to find `.refactorrc` file locally for configured config; if still not found, CLI will ask to confirm config manually;
+ `--all`: apply all transforms in once;
+ `--verbose` / `-v`: same as jscodeshift verbose flag, show more information about the transform process, possible values are `0`, `1` and `2`, default value is `0`.

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

Known Issue:

+ When transforming class function property with type definition, it's type definition will be lost. Example

```typescript
class Component extends React.Component {
  SomeItem: React.FunctionComponent<{}> = (props) => <div {...props} />;
  render() {
    return null;
  }
}
```

If transformed, will result in:

```typescript
@autobind
class Component extends React.Component {
  SomeItem(props) {
    return <div {...props} />;
  }
  render() {
    return null;
  }
}
```

To keep the type definition, this scenario will be ignored and not transformed.

### no-autobind

Reverse version of `autobind` codemod. This codemod will transform class definition to remove usage of `autobind` decorator. Instead, it will change class method to arrow function for automatic this bind. Example:

Input the following class definition (with decorator on class method):

```javascript
import { autobind } from 'core-decorators';
class Component extends React.Component {
  @autobind
  onClick() { }
  render() {
    return null;
  }
}
```

Transform result will be:

```javascript
class Component extends React.Component {
  onClick = () => { };
  render() {
    return null;
  }
}
```

If decorator is on class, all methods inside will be switched to arrow function:

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

Transform result will be:

```javascript
class Component extends React.Component {
  onClick = () => { };
  render = () => {
    return null;
  }
}
```

Notice that `render` function is also transformed, though it might not be necessary for React Component.

Possible configs for this codemod are:

+ decoratorName: Name of decorator, default is `autobind`
+ decoratorPath: Path of decorator library, default is `core-decorators`
+ isDefault: Whether should use default import for decorator, default is `false`
