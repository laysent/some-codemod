import React from 'react';

class A extends React.Component {
  nextTick = (ms: number): Promise<void> => new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
  render() {
    return null;
  }
}

export default A;
