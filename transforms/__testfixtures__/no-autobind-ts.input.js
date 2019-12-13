import React from 'react';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';

interface Props {
  value: string;
}

class A extends React.Component<Props> {
  @observable
  @autobind
  onClick(params: number, ...rest: string[]): boolean {
    console.log('clicked!');
  }
  @observable
  @autobind
  async asyncFunc(param: number = 1): Promise<null[]> {
    console.log('async func');
  }
  render() {
    return null;
  }
}

export { A };
