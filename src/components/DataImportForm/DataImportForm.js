import React, { useState, useEffect } from 'react';
import './DataImportForm.scss'

export default function DataImportForm(props) {

    const [newData, setData] = useState(null);

    function fileToText(file, callback) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            callback(reader.result);
        };
    }

    function onFileChange(e) {
        e.preventDefault();
        fileToText(e.target.files[0], (text) => {
            setData(JSON.parse(text))
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (newData) {
            props.addData(newData);
        }
    }

    return (
        <form className='DataImportForm' onSubmit={handleSubmit}>
            <input type='file' onChange={onFileChange} />
            <button onClick={handleSubmit}>Click here to import your data!</button>
        </form>
    )
}