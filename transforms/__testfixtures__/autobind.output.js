import React from 'react';
import { debounce } from 'some-decorators';
import { observable } from 'mobx-react';

import { autobind } from "core-decorators";

@debounce(100)
@observable
@autobind
class A extends React.Component {
  onClick() {
    console.log('clicked!');
  }
  state = null;
  timer;
  render() {
    return null;
  }
}

export default A;
