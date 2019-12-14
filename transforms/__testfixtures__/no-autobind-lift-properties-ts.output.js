import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

interface Props {
  value: string;
}

@observer
class ClassDecorated extends React.Component<Props> {
  private count: number;
  constructor() {
    count = 0;
  }
  @observable
  onClick = (params: number, ...rest: string[]): boolean => {
    this.asyncFunc();
  };
  onDblClick = (): void => {
    // do nothing
  };
  reference = {
    onClick: this.onClick,
    onDblClick: this.onDblClick,
    getter: this.getter,
  };
  forGetter = (): void => { };
  get getter() {
    return this.forGetter;
  }
  @observable
  asyncFunc = async (param: number = 1): Promise<null[]> => {
    console.log('async func');
  };
  render = () => {
    return null;
  };
}

@observer
class MethodDecorated extends React.Component<Props> {
  private count: number;
  constructor() {
    count = 0;
  }
  @observable
  onClick = (params: number, ...rest: string[]): boolean => {
    this.asyncFunc();
  };
  onDblClick = (): void => {
    // do nothing
  };
  reference = {
    onClick: this.onClick,
    onDblClick: this.onDblClick,
    getter: this.getter,
  };
  forGetter = (): void => { };
  get getter() {
    return this.forGetter;
  }
  @observable
  asyncFunc = async (param: number = 1): Promise<null[]> => {
    console.log('async func');
  };
  render() {
    return null;
  }
}

export { ClassDecorated, MethodDecorated };
