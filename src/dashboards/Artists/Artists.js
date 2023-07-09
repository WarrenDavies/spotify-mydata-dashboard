import React, { useState, useEffect, useMemo } from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import * as d3 from 'd3';
import ReactDropdown from 'react-dropdown';
import './artists.scss';
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';
import {convertMsToLargestTimeUnit, convertMsToHours, convertMsToHoursNumber} from '../../utils/DateAndTime';
import * as dashboardUtils from '../../utils/Dashboards';

export default function Artists(props) {

    const pageTitle = "Artists";

    const headlineStats = [
        {
            header: 'Total artists',
            stat: props.stats.highLevel.uniqueArtists
        },
        {
            header: 'Average hrs per artist',
            stat: convertMsToHoursNumber(props.stats.highLevel.totalListeningTimeMs / props.stats.highLevel.uniqueArtists).toFixed(2)
        },
        {
            header: 'Average listens per artist',
            stat: (props.listensUploaded / props.stats.highLevel.uniqueArtists).toFixed(2)
        },
        {
            header: 'Average tracks per artist',
            stat: (props.stats.highLevel.uniqueTracks / props.stats.highLevel.uniqueArtists).toFixed(2)
        },
    ]


    const topArtists = useMemo(() => {
        const hrsPlayed = props.stats.artists
            .sort((a, b) => {
                return b.hrsPlayed - a.hrsPlayed;
            })
            .slice(0, 29);

        const uniqueListens = props.stats.artists
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
    }, [props.stats.artists])

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)', chartTitle: 'most time on one day' },
        { value: 'uniqueListens', label: 'Number of listens', chartTitle: 'most listens on one day'}
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label;
    const chartTitle = dropDownAttributes.find(x => x.value === barChartMeasure).chartTitle;

    const topArtistChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.artistName,
        d3Format: d3.format(""),
        xAxisTickFormat: n => topArtistChart.d3Format(n),
    }
    topArtistChart.innerHeight = topArtistChart.height - topArtistChart.margin.top - topArtistChart.margin.bottom - 100;
    topArtistChart.innerWidth = topArtistChart.width - topArtistChart.margin.left - topArtistChart.margin.right;

    const bingedArtistsChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.artistName,
        d3Format: d3.format(""),
        xAxisTickFormat: n => bingedArtistsChart.d3Format(n),
    }
    bingedArtistsChart.innerHeight = bingedArtistsChart.height - bingedArtistsChart.margin.top - bingedArtistsChart.margin.bottom - 100;
    bingedArtistsChart.innerWidth = bingedArtistsChart.width - bingedArtistsChart.margin.left - bingedArtistsChart.margin.right;


    const columns = useMemo(() => [
        {
            Header: 'All artist data',
            columns: [
                {
                    Header: "ArtistName",
                    accessor: 'artistName',
                    Cell: ({ value }) => {
                        return (
                            <Link to={'/artist/' + encodeURIComponent(value)}>{value}</Link>
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
                    accessor: 'lastListen',
                }
            ]
        }
    ], [props.data])

    const [artistData, updateArtistData] = useState(props.stats.artists);

    if (props.data.length == 0) {
        return dashboardUtils.getPlaceholder(pageTitle);
    }

    return (
        <div className="Artists">
            This is the artists page.
            
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
                <div className='inline-chart'>
                <h2 className='chart-title'>Top Artists</h2>
                    <BarChartHorizontalCategorical
                        width={topArtistChart.width}
                        height={topArtistChart.height}
                        innerHeight={topArtistChart.innerHeight}
                        innerWidth={topArtistChart.innerWidth}
                        margin={topArtistChart.margin}
                        data={topArtists[barChartMeasure]}
                        xValue={topArtistChart.xValue}
                        yValue={topArtistChart.yValue}
                        xAxisLabelOffset={topArtistChart.xAxisLabelOffset}
                        xAxisTickFormat={topArtistChart.xAxisTickFormat}
                        urlPrefix={'artist/'}
                    />
                </div>
                <div className='inline-chart'>
                <h2 className='chart-title'>Binged Artists - {chartTitle}</h2>
                    <BarChartHorizontalCategorical
                        width={bingedArtistsChart.width}
                        height={bingedArtistsChart.height}
                        innerHeight={bingedArtistsChart.innerHeight}
                        innerWidth={bingedArtistsChart.innerWidth}
                        margin={bingedArtistsChart.margin}
                        data={props.stats.bingedArtists[barChartMeasure]}
                        xValue={bingedArtistsChart.xValue}
                        yValue={bingedArtistsChart.yValue}
                        xAxisLabelOffset={bingedArtistsChart.xAxisLabelOffset}
                        xAxisTickFormat={bingedArtistsChart.xAxisTickFormat}
                        urlPrefix={'artist/'}
                    />
                </div>
            </div>
            <div class='table-container artists-table'>
                <Table
                    columns={columns}
                    data={props.stats.artists}
                    convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                    placeholder='Search for an artist'
                    search={true}
                />
            </div>
        </div>
    )
}