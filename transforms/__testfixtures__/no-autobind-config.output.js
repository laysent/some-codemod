import React from 'react';
import { observable } from 'mobx';
import { shouldKeep } from 'my-decorators';
import { debounce } from 'some-decorators';

@debounce(100)
class A extends React.Component {
  onClick = (params, ...rest) => {
    console.log('clicked!');
  };
  asyncFunc = async (param = 1) => {
    console.log('async func');
  };
  render = () => {
    return null;
  };
}

class B extends React.Component {
  @debounce(100)
  onClick = (params, ...rest) => {
    console.log('clicked!');
  };
  @observable
  asyncFunc = async (param = 1) => {
    console.log('async func');
  };
  render() {
    return null;
  }
}

export { A, B };
