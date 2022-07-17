import React, {useState, useEffect, useMemo} from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';

export default function Artists(props) {
    
    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
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

    const [artistData, updateArtistData] = useState(props.stats.artists);

    return (
        <div className="Artists">
            This is the artists page.

            <br/><br/>
            
            <Table
                columns={columns}
                data={props.stats.artists}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder='Search for an artist'
                search={true}
            />

        </div>
    )
}