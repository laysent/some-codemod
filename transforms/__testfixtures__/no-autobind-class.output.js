import React from 'react';
import { observer } from 'mobx-react';

@observer
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

export { A };
