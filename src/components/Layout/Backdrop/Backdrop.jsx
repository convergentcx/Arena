import React from 'react';
import classes from './Backdrop.module.css';

const backdrop = (props) => (
  <div className={classes.Backdrop} onClick={props.clicked}></div>
);

export default backdrop;