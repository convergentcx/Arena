import React from 'react';
import classes from './Layout.module.css';
import Toolbar from './Toolbar/Toolbar';

const layout = (props) => (
    <div>
        <Toolbar />
        <main className={classes.Content}>
            {props.children}
        </main>
    </div>
);

export default layout;
