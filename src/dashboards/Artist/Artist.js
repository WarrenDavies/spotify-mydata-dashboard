import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

export default function Artist(props) {

    const { artistName } = useParams();
    const artistStats = props.stats.artists.find(e => e.artistName == artistName);
    const totalListeningTime = props.convertMsToLargestTimeUnit(artistStats.msPlayed);
    const uniqueListens = artistStats.uniqueListens;

    return (
        <div>
            {console.log(artistName)}

            This is the artist page for {artistName}
            <br/><br/>
            {JSON.stringify(artistStats)}

            <br/><br/>
            Total listening time = {totalListeningTime}
            <br/><br/>
            Number of listens = {uniqueListens}
            <br/><br/>

            
        </div>
    )
}