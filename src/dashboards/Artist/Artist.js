import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import {convertMsToLargestTimeUnit, convertMsToHours, convertMsToHoursNumber} from '../../utils/DateAndTime'

export default function Artist(props) {

    const { artistName } = useParams();

    const artistStats = props.stats.artists.find(e => e.artistName == artistName);
    const totalListeningTime = props.convertMsToLargestTimeUnit(artistStats.msPlayed);
    const uniqueListens = artistStats.uniqueListens;

    // another way to do this will be to add the listents to an array in .artists during updateStats.

    // should this be using data not tracks
    const artistTrackData = props.stats.tracks.filter(
        i => i.artistName == artistName
    );

    // should this be using data not tracks
    const artistDateData = props.data.filter(
        i => i.artistName == artistName
    );
    
    let artistDateStats = []
    artistDateData.forEach((i) => {
        
        // Dates
        ////////
        let dateOfListen = i.endTime.substring(0, 10);
        let dateArrayIndex = artistDateStats.findIndex(e => e['dateOfListen'] === dateOfListen);
                    
        if (dateArrayIndex === -1) {
            artistDateStats.push ({
                dateOfListen: dateOfListen,
                msPlayed: i.msPlayed,
                uniqueListens: 1,
                listens: []
            });
        } else {
            artistDateStats[dateArrayIndex].msPlayed += i.msPlayed;
            artistDateStats[dateArrayIndex].uniqueListens += 1;
            // newStats.time.dates.listens.push(i);
        }
    });
    artistDateStats.forEach( (j) => {
        j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
    })

    const uniqueTracksArray = artistTrackData.map(
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

    // bar chart

    const width = 1100;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20};
    const innerHeight = height - margin.top - margin.bottom - 100;
    const innerWidth = width - margin.left - margin.right;
    const xAxisLabelOffset = 50
    const xValue = d => d.dateOfListen;
    const yValue = d => d.hrsPlayed;
    const d3Format = d3.format(".2s")
    const xAxisTickFormat = n => d3Format(n)

    const timeChart = {
        width: 1400,
        height: 500,
        margin: { top: 20, right: 50, bottom: 20, left: 50 },
        xAxisOffset: 10,
        xAxisLabel: '',
        xAxisLabelOffset: 23,
        xValue: d => d.dateOfListen,
        yValue: d => d.hrsPlayed,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => timeChart.d3Format(n),
        xAxisTickLimiter: 8,
    }
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 50;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;    


    
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
                            <Link to={'/track/' + value + '/' + artistName}>{value}</Link>
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
                },
                {
                    Header: "Last Listen",
                    accessor: 'lastListen'
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


            
            <div id="bar-chart-container">
                <BarChart 
                    id="time-bar-chart"
                    width={timeChart.width}
                    height={timeChart.height}
                    innerHeight={timeChart.innerHeight}
                    innerWidth={timeChart.innerWidth}
                    margin={timeChart.margin}
                    data={artistDateStats}
                    xValue={timeChart.xValue}
                    yValue={timeChart.yValue}
                    xAxisLabel={timeChart.xAxisLabel}
                    xAxisLabelOffset={timeChart.xAxisLabelOffset}
                    xAxisOffset={timeChart.xAxisOffset}
                    xAxisTickFormat={timeChart.xAxisTickFormat}
                    xAxisTickLimiter={timeChart.xAxisTickLimiter}
                />
            </div>

            <br/><br/>

            <Table
                columns={columns}
                data={artistTrackData}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder={'Search for a track'}
                search={true}
            />
            <br/><br/>
            {JSON.stringify(artistTrackData)}
            <br/><br/>
            {JSON.stringify(props.data)}
            <br/><br/>
            {JSON.stringify(props.stats)}
        </div>
    )
}