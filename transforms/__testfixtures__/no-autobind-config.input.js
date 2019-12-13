import React from 'react';
import { observable } from 'mobx';
import bind from 'my-decorators';
import bind2, { shouldKeep } from 'my-decorators';
import { debounce } from 'some-decorators';

@debounce(100)
@bind
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

class B extends React.Component {
  @debounce(100)
  @bind
  onClick(params, ...rest) {
    console.log('clicked!');
  }
  @observable
  @bind
  async asyncFunc(param = 1) {
    console.log('async func');
  }
  render() {
    return null;
  }
}

export { A, B };
