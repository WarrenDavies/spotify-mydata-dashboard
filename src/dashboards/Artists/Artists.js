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


    // bar chart
    const width = 960;
    const height = 700;
    const margin = { top: 20, right: 20, bottom: 20, left: 230 };
    const innerHeight = height - margin.top - margin.bottom - 100;
    const innerWidth = width - margin.left - margin.right;
    const xAxisLabelOffset = 50
    const xValue = d => d[barChartMeasure];
    const yValue = d => d.artistName;
    const d3Format = d3.format(".2s")
    const xAxisTickFormat = n => d3Format(n)
 
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
    ])

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

            <BarChartHorizontalCategorical
                width={width}
                height={height}
                innerHeight={innerHeight}
                innerWidth={innerWidth}
                margin={margin}
                data={topArtists[barChartMeasure]}
                xValue={xValue}
                yValue={yValue}
                xAxisLabelOffset={xAxisLabelOffset}
                xAxisTickFormat={xAxisTickFormat}
            />

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