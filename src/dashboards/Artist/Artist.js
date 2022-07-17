import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'

export default function Artist(props) {

    const { artistName } = useParams();

    const artistStats = props.stats.artists.find(e => e.artistName == artistName);
    const totalListeningTime = props.convertMsToLargestTimeUnit(artistStats.msPlayed);
    const uniqueListens = artistStats.uniqueListens;

    const artistData = props.stats.tracks.filter(
        i => i.artistName == artistName
    );

    const uniqueTracksArray = artistData.map(
        (i) => {
          return i.trackName
        }
    ).filter(
        (item, index, arr) => {
            return arr.indexOf(item) == index
        }
    );

    const uniqueTracks = uniqueTracksArray.length;

    const averageListensPerTrack = parseFloat(uniqueListens / uniqueTracks).toFixed(2);


    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
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
        <div>

            This is the artist page for {artistName}
            <br/><br/>
            {JSON.stringify(artistStats)}

            <br/><br/>
            Total listening time = {totalListeningTime}
            <br/><br/>
            Number of listens = {uniqueListens}
            <br/><br/>
            Number of tracks listened to = {uniqueTracks}
            <br/><br/>
            Average Listens per Track = {averageListensPerTrack}
            <br/><br/>
            <Table
                columns={columns}
                data={artistData}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder={'Search for a track'}
                search={true}
            />
            <br/><br/>
            {JSON.stringify(artistData)}
            <br/><br/>
            {JSON.stringify(props.data)}
            <br/><br/>
            {JSON.stringify(props.stats)}
        </div>
    )
}