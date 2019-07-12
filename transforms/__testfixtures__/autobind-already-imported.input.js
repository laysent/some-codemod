import React from 'react';
import { autobind } from 'core-decorators';

@autobind
class A extends React.Component {
  onClick() {
    console.log('clicked!');
  };
  state = null;
  render() {
    return null;
  }
}

class B extends React.Component {
  onClick = () => {
    console.log('clicked!');
  };
  state = null;
  render() {
    return <A />
  }
}

export { A, B };
