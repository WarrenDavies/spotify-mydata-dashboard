import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'

export default function DatePage(props) {

    const { dateOfListen } = useParams();

    const dateData = props.data.filter(
        i => i.endTime.substring(0, 10) == dateOfListen
    )
    
    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
                {
                    Header: "Time",
                    accessor: 'endTime',
                    Cell: ({ value }) => {
                        return (
                            value.substring(10, 16)
                        )
                    }
                },
                {
                    Header: "ArtistName",
                    accessor: 'artistName',
                    Cell: ({ value }) => {
                        return (
                            // <a href={'/artist/' + value}>{value}</a>
                            <Link to={'/artist/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "TrackName",
                    accessor: 'trackName',
                    Cell: ({ value }) => {
                        return (
                            // <a href={'/artist/' + value}>{value}</a>
                            <Link to={'/track/' + value}>{value}</Link>
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
                }
            ]
        }
    ])


    return (
       <div className="Date">
           This is the date page for {dateOfListen}
           <Table
                columns={columns}
                data={dateData}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder={'Search for a track'}
                search={false}
            />

            <br/><br/>
            {/* {props.data[0].endTime.substring(0, 9)} */}
            {JSON.stringify(dateData)}

       </div> 
    )
}