import React from 'react';
import { observable } from 'mobx';
import { debounce } from 'core-decorators';

class A extends React.Component {
  @observable
  onClick = (params, ...rest) => {
    console.log('clicked!');
  };
  @debounce(100)
  asyncFunc = async (param = 1) => {
    console.log('async func');
  };
  already = () => {
    console.log('aready arrow function.');
  };
  render() {
    return null;
  }
}

export { A };
