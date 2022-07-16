import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';

export default function Time(props) {

    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
                {
                    Header: "Date",
                    accessor: 'dateOfListen',
                    Cell: ({ value }) => {
                        return (
                            <Link to={'/time/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "Listening Time",
                    accessor: 'msPlayed',
                    Cell: ({ value }) => {
                        return (
                            props.convertMsToLargestTimeUnit(value)
                        )
                    }
                },
                {
                    Header: "Total Listens",
                    accessor: 'uniqueListens'
                },
                {
                    Header: "First Listen",
                    accessor: 'firstListen'
                }
            ]
        }
    ])

    return (
        <div className='Time'>
            Time dashboard<br/>
            Listens Uploaded = {props.listensUploaded}<br/>
            Days listened on = {props.stats.time.dates.length}<br/>

            <Table
                columns={columns}
                data={props.stats.time.dates}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder="Search for a date"
            />

            <br/><br/><br/><br/>
            hours: {JSON.stringify(props.stats.time.hours)} <br/><br/>
            dates: {JSON.stringify(props.stats.time.dates)} <br/>
        </div>
    )
}