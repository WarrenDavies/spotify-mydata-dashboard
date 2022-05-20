import React, { useState, useEffect } from 'react';

export default function Home(props) {

    const [listensProcessed, setListensProcessed] = useState(0)

    function processData(data) {
        // let listensUploaded;

        // if (listensProcessed != data.length) {
            
        //     listensUploaded = listensProcessed + data.length;
        //     setListensProcessed(listensUploaded);
        // }
    }

    useEffect(() => {
        processData(props.data);
    });
    
    return (
        
        <div className='Home'>
            The home page with high level stats. <br/>
            Total listening time: {props.stats.highLevel.totalListeningTimeString} <br/>

            data.length: {props.data.length} <br/>
            listensProcessed: {listensProcessed} <br/><br/>
            
            data: {JSON.stringify(props.data)} <br/>

        </div>
    )
}