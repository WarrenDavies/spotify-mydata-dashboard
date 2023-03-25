import React from 'react';
import './StatBox.scss';


export default function StatBox(props) {


    return (
        <div className="StatBox">
            <div className="StatBox__header">
                <h4>{props.header}</h4>
            </div>
            <div className="StatBox__stat">
                <p>{props.stat}</p>
            </div>
        </div>
    )
}