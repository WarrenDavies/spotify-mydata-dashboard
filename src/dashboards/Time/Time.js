import React from 'react';

export default function Time(props) {
    return (
        <div className='Time'>
            Time dashboard<br/>
            Listens Uploaded = {props.listensUploaded}<br/>
            Days listened on = {props.stats.time.dates.length}<br/>
            dates: {JSON.stringify(props.stats.time.dates)} <br/>
        </div>
    )
}