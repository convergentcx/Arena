import React from 'react';
import classes from './NavigationItems.module.css'
import { NavLink } from 'react-router-dom';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <li className={classes.NavigationItem}>
            <NavLink
                to='/about'>
            HOW IT WORKS
            </NavLink>
            <NavLink
                to='/'>
            BROWSE
            </NavLink>
            <NavLink
                to='/dashboard'>
            MY PERSONAL ECONOMY
            </NavLink>
            <NavLink
                to='/'>
            CHAT
            </NavLink>
            <NavLink
                to='/'>
            SIGN IN
            </NavLink>
        </li>
    </ul>
)

export default navigationItems;