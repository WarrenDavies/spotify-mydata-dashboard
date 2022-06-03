import React, {useState, useEffect, useMemo} from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';

export default function Artists(props) {
    
    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
                {
                    Header: "ArtistName",
                    accessor: 'artistName'
                },
                {
                    Header: "Listening Time",
                    accessor: 'msPlayed'
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

    const artistTableRows = artistData.map((i) => {
        return (
            <TableRow
                key={'artistTableRow' + nanoid()}
                artistName={i.artistName}
                listeningTime={props.convertMsToLargestTimeUnit(i.msPlayed)}
                uniqueListens={i.uniqueListens}
                firstListen={i.firstListen}
            />
        )
    });

    return (
        <div className="Artists">
            This is the artists page.

            <br/><br/>
            
            <Table
                columns={columns}
                data={props.stats.artists}
            />

            <br/><br/>
            <table>
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Listening Time</th>
                        <th>Listens</th>
                        <th>First Listen</th>
                    </tr>
                </thead>
                <tbody>
                    {artistTableRows}
                </tbody>
                
            </table>
            {/* {artistTable} */}
            <br/><br/>
            {JSON.stringify(props.stats.artists)}

        </div>
    )
}