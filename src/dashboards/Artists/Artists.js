import React, {useState, useEffect} from 'react';

export default function Artists(props) {
    
    const [artistTable, updateArtistTable] = useState('test');

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
                <tr>
                    <th>Artist</th>
                    <th>Listening Time</th>
                    <th>Listens</th>
                </tr>
                <tr>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                </tr>
            </table>
            {artistTable}
            <br/><br/>
            {JSON.stringify(props.stats.artists)}

        </div>
    )
}