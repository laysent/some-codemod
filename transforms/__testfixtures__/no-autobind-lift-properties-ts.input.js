import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

interface Props {
  value: string;
}

@observer
@autobind
class ClassDecorated extends React.Component<Props> {
  private count: number;
  constructor() {
    count = 0;
  }
  reference = {
    onClick: this.onClick,
    onDblClick: this.onDblClick,
    getter: this.getter,
  };
  get getter() {
    return this.forGetter;
  }
  @observable
  onClick(params: number, ...rest: string[]): boolean {
    this.asyncFunc();
  }
  @observable
  async asyncFunc(param: number = 1): Promise<null[]> {
    console.log('async func');
  }
  onDblClick(): void {
    // do nothing
  }
  forGetter(): void { }
  render() {
    return null;
  }
}

@observer
class MethodDecorated extends React.Component<Props> {
  private count: number;
  constructor() {
    count = 0;
  }
  reference = {
    onClick: this.onClick,
    onDblClick: this.onDblClick,
    getter: this.getter,
  };
  get getter() {
    return this.forGetter;
  }
  @observable
  @autobind
  onClick(params: number, ...rest: string[]): boolean {
    this.asyncFunc();
  }
  @observable
  @autobind
  async asyncFunc(param: number = 1): Promise<null[]> {
    console.log('async func');
  }
  @autobind
  onDblClick(): void {
    // do nothing
  }
  @autobind
  forGetter(): void { }
  render() {
    return null;
  }
}

export { ClassDecorated, MethodDecorated };
