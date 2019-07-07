import React from 'react';
import { Select } from 'antd';
import List from 'react-virtualized';
import './style.css';

const Element = () => (
  <div className="example">
    <Select>
      <Select.Option key="" value="">All</Select.Option>
    </Select>
    <List />
    <i style={{ color: 'red' }} className="pre-class iconfont icon-type post-class" aria-label="icon" />
    <i aria-label="other-component-example" className={false} />
  </div>
);

export default Element;
