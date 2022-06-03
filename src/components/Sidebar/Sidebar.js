import React from 'react';
import './Sidebar.scss';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className='Sidebar'>
            <ul className='sidebar__links'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/time">Time</Link></li>
                <li><Link to="/artists">Artists</Link></li>
                <li><Link to="/tracks">Tracks</Link></li>
            </ul>
        </aside>
    )
}