import React from 'react';

export default function Home(props) {
    return (
        <div className='Home'>
            The home page with high level stats. <br/>
            data.length: {props.data.length} <br/>
            data: {props.data} <br/>
        </div>
    )
}