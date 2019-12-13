import React from 'react';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';

interface Props {
  value: string;
}

@observable
@autobind
class A extends React.Component<Props> {
  onClick(params: number, ...rest: string[]): boolean {
    console.log('clicked!');
  }
  async asyncFunc(param: number = 1): Promise<null[]> {
    console.log('async func');
  }
  render() {
    return null;
  }
}

export { A };
