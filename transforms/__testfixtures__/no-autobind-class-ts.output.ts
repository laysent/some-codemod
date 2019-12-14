import React from 'react';
import { observable } from 'mobx';

interface Props {
  value: string;
}

@observable
class A extends React.Component<Props> {
  onClick = (params: number, ...rest: string[]): boolean => {
    console.log('clicked!');
    return false;
  };
  asyncFunc = async (param: number = 1): Promise<null[]> => {
    console.log('async func');
    return [null];
  };
  render = () => {
    return null;
  };
}

export { A };
