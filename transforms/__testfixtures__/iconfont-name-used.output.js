import React from 'react';
import { CustomIcon } from 'another/path';
import CustomIcon_ from "path/to/component/icon";
import './style.css';

const Element = () => (
  <div className="example">
    <CustomIcon />
    <CustomIcon_ className="pre-class post-class" aria-label="icon" type="type" />
  </div>
);

export default Element;
