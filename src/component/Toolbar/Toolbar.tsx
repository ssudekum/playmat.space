import React from 'react';
import './Toolbar.css'

const Toolbar : React.FC<{}> = props =>
  <div className="toolbar">
    {props.children}
  </div>

export default Toolbar;