import React from 'react';
import './StatBox.scss';


export default function StatBox(props) {


    return (
        <div class="StatBox">
            <div class="StatBox__header">
                <h4>{props.header}</h4>
            </div>
            <div class="StatBox__stat">
                <p>{props.stat}</p>
            </div>
        </div>
    )
}