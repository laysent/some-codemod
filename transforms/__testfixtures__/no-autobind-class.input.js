import React from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

@observer
@autobind
class A extends React.Component {
  onClick(params, ...rest) {
    console.log('clicked!');
  }
  async asyncFunc(param = 1) {
    console.log('async func');
  }
  render() {
    return null;
  }
}

export { A };
