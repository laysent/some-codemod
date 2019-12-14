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
    super();
    this.count = 0;
  }
  @observable
  onClick = (params: number, ...rest: string[]): boolean => {
    this.asyncFunc();
    return false;
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
    return [null];
  };
  render = () => {
    return null;
  };
}

@observer
class MethodDecorated extends React.Component<Props> {
  private count: number;
  constructor() {
    super();
    this.count = 0;
  }
  @observable
  onClick = (params: number, ...rest: string[]): boolean => {
    this.asyncFunc();
    return false;
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
    return [null];
  };
  render() {
    return null;
  }
}

export { ClassDecorated, MethodDecorated };
