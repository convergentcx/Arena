import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => (
    <div>
        <Backdrop clicked={props.modalClosed}/>
        <div className={classes.Modal}>
            <button type="button" onClick={props.modalClosed}>
                Close
            </button>
            {props.children}
        </div>
    </div>

);

export default modal;
