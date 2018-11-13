import React from 'react';
import classes  from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = () => (
    <header className={classes.Toolbar}>
        <div>Logo</div>
        <nav>
            <NavigationItems/>
        </nav>
    </header>
)

export default toolbar;