import React from 'react';
import './StatBoxContainer.scss';
import StatBox from './StatBox'

export default function StatBoxContainer(props) {

    return (
        <div className="StatBoxContainer">
            {props.statBoxes.map( (stat, i) => {
                return(
                    <StatBox 
                        key={stat.header + i}
                        header={stat.header}
                        stat={stat.stat}
                    />        
                )
            })}                   
        </div>
    )
}