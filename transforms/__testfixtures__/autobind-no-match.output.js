import React from 'react';

function output(line) {
  console.log(line);
}

const ComponentA = (props) => <div />;

class ComponentB extends React.Component {
  componentDidMount() {
    output('component did mount');
  }
  render() {
    return <div />;
  }
}

export { ComponentA, ComponentB };
