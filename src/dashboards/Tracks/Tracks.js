import React, {useState, useEffect, useMemo} from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';

export default function Tracks(props) {
    
    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
                {
                    Header: "Track Name",
                    accessor: 'trackName',
                    Cell: ({ row, value }) => {
                        return (
                            <Link to={'/track/' + value + '/' + row.original.artistName}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "Artist Name",
                    accessor: 'artistName',
                    Cell: ({ value }) => {
                        return (
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

    const [trackData, updateTrackData] = useState(props.stats.tracks);

    return (
        <div className="Tracks">
            This is the tracks page.

            <br/><br/>
            
            You listened to {props.stats.tracks.length} tracks.


            <br/><br/>
            
            <Table
                columns={columns}
                data={props.stats.tracks}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder="Search for a track"
                search={true}
            />

        </div>
    )
}