import React, { useState, useEffect, useMemo } from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import * as d3 from 'd3';
import ReactDropdown from 'react-dropdown';
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';
import {convertMsToLargestTimeUnit, convertMsToHours, convertMsToHoursNumber} from '../../utils/DateAndTime';
import './tracks.scss'

export default function Tracks(props) {

    const headlineStats = [
        {
            header: 'Total tracks',
            stat: props.stats.highLevel.uniqueTracks
        },
        {
            header: 'Average hrs per track',
            stat: convertMsToHoursNumber(props.stats.highLevel.totalListeningTimeMs / props.stats.highLevel.uniqueTracks).toFixed(2)
        },
        {
            header: 'Average listens per track',
            stat: (props.listensUploaded / props.stats.highLevel.uniqueTracks).toFixed(2)
        },
    ]


    const topTracks = useMemo(() => {
        const hrsPlayed = props.stats.tracks
            .sort((a, b) => {
                return b.hrsPlayed - a.hrsPlayed;
            })
            .slice(0, 29);

        const uniqueListens = props.stats.tracks
            .sort((a, b) => {
                return b.uniqueListens - a.uniqueListens;
            })
            .slice(0, 29);

        return (
            {
                "hrsPlayed": hrsPlayed,
                "uniqueListens": uniqueListens
            }
        )
    }, [props.stats.tracks])

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)', chartTitle: 'most time on one day' },
        { value: 'uniqueListens', label: 'Number of listens', chartTitle: 'most listens on one day'}
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label;
    const chartTitle = dropDownAttributes.find(x => x.value === barChartMeasure).chartTitle;

    const topTrackChart = {
        width: 650,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 330 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.trackName,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => topTrackChart.d3Format(n),
    }
    topTrackChart.innerHeight = topTrackChart.height - topTrackChart.margin.top - topTrackChart.margin.bottom - 100;
    topTrackChart.innerWidth = topTrackChart.width - topTrackChart.margin.left - topTrackChart.margin.right;

    const bingedTracksChart = {
        width: 700,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 330 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.trackName,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => bingedTracksChart.d3Format(n),
    }
    bingedTracksChart.innerHeight = bingedTracksChart.height - bingedTracksChart.margin.top - bingedTracksChart.margin.bottom - 100;
    bingedTracksChart.innerWidth = bingedTracksChart.width - bingedTracksChart.margin.left - bingedTracksChart.margin.right;


    const columns = useMemo(() => [
        {
            Header: 'All tracks',
            columns: [
                {
                    Header: "Track Name",
                    accessor: 'trackName',
                    Cell: ({ row, value }) => {
                        return (
                            <Link to={'/track/' + value + '/' + row.original.artistName}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "Artist Name",
                    accessor: 'artistName',
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
                },
                {
                    Header: "Total Listens",
                    accessor: 'uniqueListens'
                },
                {
                    Header: "First Listen",
                    accessor: 'firstListen',
                },
                {
                    Header: "Last Listen",
                    accessor: 'lastListen',
                }

            ]
        }
    ], [props.data])

    const [trackData, updateTrackData] = useState(props.stats.tracks);

    return (
        <div className="Tracks">
            This is the tracks page. 
            
            <StatBoxContainer 
                statBoxes={headlineStats}
            />

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
            />
            <div className='chart-container'>
                <div className='inline-chart top-tracks'>
                <h2 className='chart-title'>Top Tracks</h2>
                    <BarChartHorizontalCategorical
                        width={topTrackChart.width}
                        height={topTrackChart.height}
                        innerHeight={topTrackChart.innerHeight}
                        innerWidth={topTrackChart.innerWidth}
                        margin={topTrackChart.margin}
                        data={topTracks[barChartMeasure]}
                        xValue={topTrackChart.xValue}
                        yValue={topTrackChart.yValue}
                        xAxisLabelOffset={topTrackChart.xAxisLabelOffset}
                        xAxisTickFormat={topTrackChart.xAxisTickFormat}
                        urlPrefix={'track/'}
                        urlSuffixLookup='artistName'
                    />
                </div>
                <div className='inline-chart binged-tracks'>
                <h2 className='chart-title'>Binged Tracks - {chartTitle}</h2>
                    <BarChartHorizontalCategorical
                        width={bingedTracksChart.width}
                        height={bingedTracksChart.height}
                        innerHeight={bingedTracksChart.innerHeight}
                        innerWidth={bingedTracksChart.innerWidth}
                        margin={bingedTracksChart.margin}
                        data={props.stats.bingedTracks[barChartMeasure]}
                        xValue={bingedTracksChart.xValue}
                        yValue={bingedTracksChart.yValue}
                        xAxisLabelOffset={bingedTracksChart.xAxisLabelOffset}
                        xAxisTickFormat={bingedTracksChart.xAxisTickFormat}
                        urlPrefix={'track/'}
                        urlSuffixLookup='artistName'
                    />
                </div>
            </div>
            <div className='table-container tracks'>
                <Table
                    columns={columns}
                    data={props.stats.tracks}
                    convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                    placeholder="Search for a track"
                    search={true}
                />
            </div>
        </div>
    )
}