import React, { useState, useEffect, useMemo } from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import * as d3 from 'd3';
import ReactDropdown from 'react-dropdown';
import './artists.scss';

export default function Artists(props) {




    const topArtists = useMemo(() => {
        const hrsPlayed = props.stats.artists
            .sort((a, b) => {
                return b.hrsPlayed - a.hrsPlayed;
            })
            .slice(0, 19);

        const uniqueListens = props.stats.artists
            .sort((a, b) => {
                return b.uniqueListens - a.uniqueListens;
            })
            .slice(0, 19);

        return (
            {
                "hrsPlayed": hrsPlayed,
                "uniqueListens": uniqueListens
            }
        )
    }, [props.stats.artists])

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)' },
        { value: 'uniqueListens', label: 'Number of listens' }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label

    const topArtistChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.artistName,
        d3Format: d3.format(".2s"),
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
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => bingedArtistsChart.d3Format(n),
    }
    bingedArtistsChart.innerHeight = bingedArtistsChart.height - bingedArtistsChart.margin.top - bingedArtistsChart.margin.bottom - 100;
    bingedArtistsChart.innerWidth = bingedArtistsChart.width - bingedArtistsChart.margin.left - bingedArtistsChart.margin.right;


    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
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
    ], [props.data])

    const [artistData, updateArtistData] = useState(props.stats.artists);

    return (
        <div className="Artists">
            This is the artists page.

            <br /><br />
            You listened to {props.stats.highLevel.uniqueArtists} artists.
            <br /><br />

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
            />
            <div className='chart-container'>
                <div className='inline-chart'>
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
            <Table
                columns={columns}
                data={props.stats.artists}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder='Search for an artist'
                search={true}
            />

        </div>
    )
}