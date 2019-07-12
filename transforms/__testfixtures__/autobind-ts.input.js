import React from 'react';
import { debounce } from 'some-decorators';
import { observable } from 'mobx-react';

@debounce(100)
@observable
class A extends React.Component {
  onClick = (input: string): void => {
    console.log('clicked!');
  };
  state: string | null = null;
  timer: number | undefined;
  render() {
    return null;
  }
}

export default A;
