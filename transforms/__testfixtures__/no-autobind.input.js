import React from 'react';
import { observable } from 'mobx';
import { autobind, debounce } from 'core-decorators';

class A extends React.Component {
  @observable
  @autobind
  onClick(params, ...rest) {
    console.log('clicked!');
  }
  @debounce(100)
  @autobind
  async asyncFunc(param = 1) {
    console.log('async func');
  }
  already = () => {
    console.log('aready arrow function.');
  };
  render() {
    return null;
  }
}

export { A };
