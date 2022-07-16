import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'

export default function Track(props) {

    const { trackName } = useParams();
    const trackStats = props.stats.tracks.find(e => e.trackName == trackName);
    const totalListeningTime = props.convertMsToLargestTimeUnit(trackStats.msPlayed);
    const uniqueListens = trackStats.uniqueListens;
    const trackData = props.data.filter(
        (i) => {return i.trackName == trackName}
    );

    return (
        <div>

            This is the track page for {trackName}
            <br/><br/>
            {JSON.stringify(trackStats)}

            <br/><br/>
            Total listening time = {totalListeningTime}
            <br/><br/>
            Number of listens = {uniqueListens}
            <br/><br/>
   
            <br/><br/>
            {JSON.stringify(trackStats)}
            <br/><br/>
            {JSON.stringify(trackData)}
            <br/><br/>
        </div>
    )
}