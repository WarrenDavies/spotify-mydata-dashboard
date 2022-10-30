import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'
import { makePropGetter } from 'react-table';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart'

export default function DatePage(props) {

    const { dateOfListen } = useParams();

    const dateData = props.data.filter(
        i => i.endTime.substring(0, 10) == dateOfListen
    )
    
    function getListeningTimePerHour(data) {

        let hours = []

        for (let i = 0; i <= 24; i++) {

            let hour = i < 10 ? '0' + i : i.toString();

            hours.push({
                hour: hour,
                listeningTimeMs: 0,
                uniqueListens: 0
            })

        }
        
        data.forEach( (i) => {

            let hourOfThisListen = i.endTime.substring(11, 13);
            
            let hoursArrayIndex = hours.findIndex(e => e['hour'] == hourOfThisListen);
            
            hours[hoursArrayIndex].listeningTimeMs += i.msPlayed;
            hours[hoursArrayIndex].uniqueListens += 1;

        });
        
        hours.forEach( (i) => {

            i.listeningTime = props.convertMsToLargestTimeUnit(i.listeningTimeMs);

        });


        return hours

    }
    
    const newHourData = useMemo( () => getListeningTimePerHour(dateData))

    const hoursColumns = useMemo(() => [
        {
            Header: 'Listening time per hour',
            columns: [
                {
                    Header: "Hour",
                    accessor: 'endTime',
                    Cell: ({ value }) => {
                        return (
                            value.substring(10, 16)
                        )
                    }
                }
            ]
        }
    ])

    // this is duplicated. Need to pass in or import separately
    function getArrayItemIndex(array, listen, key) {
        return array.findIndex(e => e[key] == listen[key]);
    }

    const getHighLevelStatsThisDay = (dateData) => {
        
        /// duplication from App here. need to pull these in from one place
        let artistStatsThisDay = [];
        let trackStatsThisDay = [];

        dateData.forEach((i) => {
            let artistArrayIndex = artistStatsThisDay.findIndex(e => e['artistName'] == i['artistName']);
            // getArrayItemIndex(artistStatsThisDay.artists, i, 'artistName')
            if (artistArrayIndex === -1) {
                artistStatsThisDay.push ({
                    artistName: i.artistName,
                    msPlayed: i.msPlayed,
                    uniqueListens: 1
                });

            } else {
                artistStatsThisDay[artistArrayIndex].msPlayed += i.msPlayed;
                artistStatsThisDay[artistArrayIndex].uniqueListens += 1;
            }

            let trackArrayIndex = trackStatsThisDay.findIndex(e => e['trackName'] == i['trackName']);

            if (trackArrayIndex === -1) {
                trackStatsThisDay.push ({
                    trackName: i.trackName,
                    artistName: i.artistName,
                    msPlayed: i.msPlayed,
                    uniqueListens: 1
                });

            } else {
                trackStatsThisDay[trackArrayIndex].msPlayed += i.msPlayed;
                trackStatsThisDay[trackArrayIndex].uniqueListens += 1;
            }
        });

        const artistStatsThisDaySorted = artistStatsThisDay.sort( (a, b) => {
            return b.msPlayed - a.msPlayed;
        })

        const trackStatsThisDaySorted = trackStatsThisDay.sort( (a, b) => {
            return b.msPlayed - a.msPlayed;
        })

        return {
            'artists': artistStatsThisDaySorted, 
            'tracks': trackStatsThisDaySorted
        }
    }
    
    const highLevelStatsThisDay = useMemo( () => getHighLevelStatsThisDay(dateData))

    const allListenscolumns = useMemo(() => [
        {
            Header: 'All of your listens this day',
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

    const width = 960;
    const height = 700;
    const margin = { top: 20, right: 20, bottom: 20, left: 0};
    const innerHeight = height - margin.top - margin.bottom - 100;
    const innerWidth = width - margin.left - margin.right;
    const xAxisLabelOffset = 50
    const xValue = d => d.hour;
    const yValue = d => Math.round((d.listeningTimeMs / 60000) * 100) / 100;
    const d3Format = d3.format(".2s")
    const xAxisTickFormat = n => d3Format(n)

    const topArtists = highLevelStatsThisDay.artists.slice(0, 4).map( (j, i) => {
        return (j.artistName + ",")
    });
    const topTracks = highLevelStatsThisDay.tracks.slice(0, 4).map( (j, i) => {
        return (j.trackName + ' (' + j.artistName + ')' + ",")
    });

    return (
        
       <div className="Date">
            This is the date page for {dateOfListen}
            <br/><br/>

            data.length: {props.data.length}
            <br/><br/>

            new hour data: {JSON.stringify(newHourData)}
            <br/><br/>

            {'[' + props.data[0].endTime.substring(11, 13) + ']'}
            <br/><br/>

            {/* Top Artists on this Date: {highLevelStatsThisDay[0].artistName} */}
            Top Artists on this Date: {topArtists}
            <br/><br/>
            Top Tracks on this Date: {topTracks}
            <br/><br/>
            

            <BarChart 
                width={width}
                height={height}
                innerHeight={innerHeight}
                innerWidth={innerWidth}
                margin={margin}
                data={newHourData}
                xValue={xValue}
                yValue={yValue}
                xAxisLabelOffset={xAxisLabelOffset}
                xAxisTickFormat={xAxisTickFormat}
            />

            <Table
                columns={allListenscolumns}
                data={dateData}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder={'Search for a track'}
                search={false}
            />

            <br/><br/>
            
            {JSON.stringify(dateData)}

       </div> 
    )
}