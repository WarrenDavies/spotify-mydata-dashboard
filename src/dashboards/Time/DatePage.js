import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'
import { makePropGetter } from 'react-table';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart'
import ReactDropdown from 'react-dropdown';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import { convertMsToLargestTimeUnit, convertMsToHours, convertMsToHoursNumber, getEmptyTimeArrays } from '../../utils/DateAndTime'
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';

export default function DatePage(props) {

    const { dateOfListen } = useParams();

    const dateData = props.data.filter(
        i => i.endTime.substring(0, 10) == dateOfListen
    )

    const dropDownAttributes = [
        { 
            value: 'hrsPlayed', 
            label: 'Listening time (hours)',
            xAxisFormat: '.2f' 
        },
        { 
            value: 'uniqueListens', 
            label: 'Number of listens',
            xAxisFormat: ''
        }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label
    const topChartXAxisFormat = dropDownAttributes.find(x => x.value === barChartMeasure).xAxisFormat

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

        data.forEach((i) => {

            let hourOfThisListen = i.endTime.substring(11, 13);

            let hoursArrayIndex = hours.findIndex(e => e['hour'] == hourOfThisListen);

            hours[hoursArrayIndex].listeningTimeMs += i.msPlayed;
            hours[hoursArrayIndex].uniqueListens += 1;

        });

        hours.forEach((i) => {

            i.listeningTime = props.convertMsToLargestTimeUnit(i.listeningTimeMs);
            i.hrsPlayed = convertMsToHoursNumber(i.listeningTimeMs);
        });


        return hours

    }

    const newHourData = useMemo(() => getListeningTimePerHour(dateData))

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

    function getTopN(data, n) {
        const hrsPlayed = data
            .sort((a, b) => {
                return b.hrsPlayed - a.hrsPlayed;
            })
            .slice(0, n - 1);

        const uniqueListens = data
            .sort((a, b) => {
                return b.uniqueListens - a.uniqueListens;
            })
            .slice(0, n - 1);

        return (
            {
                "hrsPlayed": hrsPlayed,
                "uniqueListens": uniqueListens
            }
        )
    }

    const getHighLevelStatsThisDay = (dateData) => {

        /// duplication from App here. need to pull these in from one place
        let artistStatsThisDay = [];
        let trackStatsThisDay = [];
        let listeningTimeThisDay = 0;
        let uniqueListensThisDay = 0;

        dateData.forEach((i) => {
            let artistArrayIndex = artistStatsThisDay.findIndex(e => e['artistName'] == i['artistName']);
            if (artistArrayIndex === -1) {
                artistStatsThisDay.push({
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
                trackStatsThisDay.push({
                    trackName: i.trackName,
                    artistName: i.artistName,
                    msPlayed: i.msPlayed,
                    uniqueListens: 1
                });

            } else {
                trackStatsThisDay[trackArrayIndex].msPlayed += i.msPlayed;
                trackStatsThisDay[trackArrayIndex].uniqueListens += 1;
            }

            listeningTimeThisDay = listeningTimeThisDay + i.msPlayed;
            uniqueListensThisDay = uniqueListensThisDay + 1;
        });

        artistStatsThisDay.forEach( (i) => {
            i.hrsPlayed = convertMsToHoursNumber(i.msPlayed);
        });

        trackStatsThisDay.forEach( (i) => {
            i.hrsPlayed = convertMsToHoursNumber(i.msPlayed);
        });

        const artistStatsThisDaySorted = getTopN(artistStatsThisDay, 20)
        const trackStatsThisDaySorted = getTopN(trackStatsThisDay, 20)
        
        return {
            'artists': artistStatsThisDaySorted,
            'tracks': trackStatsThisDaySorted,
            'listeningTimeThisDay': props.convertMsToLargestTimeUnit(listeningTimeThisDay),
            'uniqueListensThisDay': uniqueListensThisDay,
            'totalArtists': artistStatsThisDay.length,
            'totalTracks': trackStatsThisDay.length,
        }
    }

    const highLevelStatsThisDay = useMemo(() => getHighLevelStatsThisDay(dateData))

    const headlineStats = [
        {
            header: 'Total listening time',
            stat: highLevelStatsThisDay.listeningTimeThisDay
        },
        {
            header: 'Total unique Listens',
            stat: highLevelStatsThisDay.uniqueListensThisDay
        },
        {
            header: 'Artists listened to',
            stat: highLevelStatsThisDay.totalArtists
        },
        {
            header: 'Tracks listened to',
            stat: highLevelStatsThisDay.totalTracks
        },
        {
            header: 'Avg tracks per artist',
            stat: (highLevelStatsThisDay.totalTracks / highLevelStatsThisDay.totalArtists).toFixed(1)
        },
    ]

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
                            <Link to={'/artist/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "TrackName",
                    accessor: 'trackName',
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
                }
            ]
        }
    ])
   

    const hourChart = {
        width: 1400,
        height: 500,
        margin: { top: 20, right: 20, bottom: 20, left: 40 },
        xAxisLabelOffset: 50,
        xAxisOffset: 10,
        xAxisLabel: '',
        xValue: d => d.hour,
        yValue: d => d[barChartMeasure],
        d3Format: d3.format(""),
        xAxisTickFormat: n => hourChart.d3Format(n),
        xAxisTickLimiter: 0,
    }
    hourChart.innerHeight = hourChart.height - hourChart.margin.top - hourChart.margin.bottom - 50;
    hourChart.innerWidth = hourChart.width - hourChart.margin.left - hourChart.margin.right;

    const topArtistChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.artistName,
        d3Format: d3.format(topChartXAxisFormat),
        xAxisTickFormat: n => topArtistChart.d3Format(n),
        xAxisTicks: 4,
    }
    topArtistChart.innerHeight = topArtistChart.height - topArtistChart.margin.top - topArtistChart.margin.bottom - 100;
    topArtistChart.innerWidth = topArtistChart.width - topArtistChart.margin.left - topArtistChart.margin.right;

    const topTracksChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.trackName,
        d3Format: d3.format(topChartXAxisFormat),
        xAxisTickFormat: n => topTracksChart.d3Format(n),
        xAxisTicks: 4,
    }
    topTracksChart.innerHeight = topTracksChart.height - topTracksChart.margin.top - topTracksChart.margin.bottom - 100;
    topTracksChart.innerWidth = topTracksChart.width - topTracksChart.margin.left - topTracksChart.margin.right;

    return (
        <div className="Date">
            This is the date page for {dateOfListen}
            <br /><br />
            <StatBoxContainer
                statBoxes={headlineStats}
            />

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
            />

            <div className='chart-container-full-width'>
                <h2 className='chart-title'>When did you listen?</h2>
                <BarChart
                    width={hourChart.width}
                    height={hourChart.height}
                    innerHeight={hourChart.innerHeight}
                    innerWidth={hourChart.innerWidth}
                    margin={hourChart.margin}
                    data={newHourData}
                    xValue={hourChart.xValue}
                    yValue={hourChart.yValue}
                    xAxisLabel={hourChart.xAxisLabel}
                    xAxisLabelOffset={hourChart.xAxisLabelOffset}
                    xAxisOffset={hourChart.xAxisOffset}
                    xAxisTickFormat={hourChart.xAxisTickFormat}
                    xAxisTickLimiter={hourChart.xAxisTickLimiter}
                />
            </div>

            <div className='chart-container'>
                <div className='inline-chart'>
                    <h2 className='chart-title'>Top Artists</h2>

                    <BarChartHorizontalCategorical
                        width={topArtistChart.width}
                        height={topArtistChart.height}
                        innerHeight={topArtistChart.innerHeight}
                        innerWidth={topArtistChart.innerWidth}
                        margin={topArtistChart.margin}
                        data={highLevelStatsThisDay.artists[barChartMeasure]}
                        xValue={topArtistChart.xValue}
                        yValue={topArtistChart.yValue}
                        xAxisLabel={topArtistChart.xAxisLabel}
                        xAxisLabelOffset={topArtistChart.xAxisLabelOffset}
                        xAxisTickFormat={topArtistChart.xAxisTickFormat}
                        xAxisTicks={topArtistChart.xAxisTicks}
                        urlPrefix='artist/'
                        urlSuffix=''
                    />
                </div>

                <div className='inline-chart'>
                    <h2 className='chart-title'>Top Tracks</h2>

                    <BarChartHorizontalCategorical
                        width={topTracksChart.width}
                        height={topTracksChart.height}
                        innerHeight={topTracksChart.innerHeight}
                        innerWidth={topTracksChart.innerWidth}
                        margin={topTracksChart.margin}
                        data={highLevelStatsThisDay.tracks[barChartMeasure]}
                        xValue={topTracksChart.xValue}
                        yValue={topTracksChart.yValue}
                        xAxisLabel={topTracksChart.xAxisLabel}
                        xAxisLabelOffset={topTracksChart.xAxisLabelOffset}
                        xAxisTickFormat={topTracksChart.xAxisTickFormat}
                        xAxisTicks={topTracksChart.xAxisTicks}
                        urlPrefix='track/'
                        urlSuffixLookup='artistName'
                    />
                </div>
            </div>
            <div className='table-container time-table'>
                <Table
                    columns={allListenscolumns}
                    data={dateData}
                    convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                    placeholder={'Search for a track'}
                    search={false}
                />
            </div>
        </div>
    )
}