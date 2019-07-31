import React from 'react';

import { autobind } from "core-decorators";

@autobind
class A extends React.Component {
  nextTick(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  render() {
    return null;
  }
}

export default A;
