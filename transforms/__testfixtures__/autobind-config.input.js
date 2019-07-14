import React from 'react';
import { debounce } from 'some-decorators';
import { observable } from 'mobx-react';
import { sthElse } from 'my-decorators';

@debounce(100)
@observable
class A extends React.Component {
  onClick = () => {
    console.log('clicked!');
  };
  state = null;
  render() {
    return null;
  }
}

export default A;
