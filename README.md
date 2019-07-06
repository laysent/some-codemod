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

Coming soon...
