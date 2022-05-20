import React from 'react';

export default function Time(props) {
    return (
        <div className='Time'>
            Time dashboard<br/>
            Listens Uploaded = {props.listensUploaded}

        </div>
    )
}