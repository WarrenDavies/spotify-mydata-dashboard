import React, {useState, useEffect} from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';

export default function Artists(props) {
    
    const [artistTable, updateArtistTable] = useState('test');

    const artistTableRows = props.stats.artists.map((i) => {
        return (
            <TableRow
                key={'artistTableRow' + nanoid()}
                artistName={i.artistName}
                listeningTime={i.msPlayed}
                uniqueListens={i.uniqueListens}
                firstListen={i.firstListen}
            />
        )
    });

    // const artistTableRows = props.stats.artists.map((i) => {
    //     return i.artistName
    // });

    function tabulateArtistStats(artistData) {
        let newArtistTable;

        newArtistTable = artistData.map((artist) =>{
            return (
                '<p>' + artist.artistName + '</p>'
            )
        });

        updateArtistTable(updateArtistTable, newArtistTable);
        
    }

    useEffect( () => {
        tabulateArtistStats(props.stats.artists);
    }, []);

    return (
        <div className="Artists">
            This is the artists page.
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
            {artistTable}
            <br/><br/>
            {JSON.stringify(props.stats.artists)}

        </div>
    )
}