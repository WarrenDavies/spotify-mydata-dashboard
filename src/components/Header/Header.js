import React from 'react'
import './Header.scss'
import DataImportForm from '../DataImportForm/DataImportForm'

export default function Header (props) {
    return (
        <header className='Header'>
            <h1 className='Header__text'>Your Spotify Data</h1>
            <DataImportForm 
                addData={props.addData}
            />
        </header>
    )
}

