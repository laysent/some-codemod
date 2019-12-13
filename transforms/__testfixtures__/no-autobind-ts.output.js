import React from 'react';
import { observable } from 'mobx';

interface Props {
  value: string;
}

class A extends React.Component<Props> {
  @observable
  onClick = (params: number, ...rest: string[]): boolean => {
    console.log('clicked!');
  };
  @observable
  asyncFunc = async (param: number = 1): Promise<null[]> => {
    console.log('async func');
  };
  render() {
    return null;
  }
}

export { A };
