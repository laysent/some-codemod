import React from 'react';
import { debounce } from 'some-decorators';
import { observable } from 'mobx-react';

import { autobind } from "core-decorators";

@debounce(100)
@observable
@autobind
class A extends React.Component {
  onClick(input: string): void {
    console.log('clicked!');
  }
  state: string | null = null;
  timer: number | undefined;
  render() {
    return null;
  }
}

export default A;
