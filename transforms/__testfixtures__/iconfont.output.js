import React from 'react';
import { Select } from 'antd';
import List from 'react-virtualized';
import CustomIcon from "path/to/component/icon";
import './style.css';

const Element = () => (
  <div className="example">
    <Select>
      <Select.Option key="" value="">All</Select.Option>
    </Select>
    <List />
    <CustomIcon
      style={{ color: 'red' }}
      className="pre-class post-class"
      aria-label="icon"
      type="type" />
    <i aria-label="other-component-example" className={false} />
  </div>
);

export default Element;
