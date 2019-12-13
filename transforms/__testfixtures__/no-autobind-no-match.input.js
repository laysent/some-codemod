import React from 'react';
import { observable } from 'mobx';
import { autobind2, debounce } from 'core-decorators';

class A extends React.Component {
  @observable
  @autobind2
  onClick(params, ...rest) {
    console.log('clicked!');
  }
  @debounce(100)
  @autobind2
  async asyncFunc(param = 1) {
    console.log('async func');
  }
  render() {
    return null;
  }
}

export { A };
