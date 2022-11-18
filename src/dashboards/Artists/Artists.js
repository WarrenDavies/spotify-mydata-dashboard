import React, {useState, useEffect, useMemo} from 'react';
import TableRow from '../../components/TableRow/TableRow';
import { nanoid } from 'nanoid';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import * as d3 from 'd3';

export default function Artists(props) {
    
    const topArtists = useMemo(() => {
        return (
            props.stats.artists
                .sort( (a, b) => {
                    return b.msPlayed - a.msPlayed;
                })
                .slice(0, 19)
        )
    }, [props.stats.artists])


    // bar chart

    const width = 960;
    const height = 700;
    const margin = { top: 20, right: 20, bottom: 20, left: 230};
    const innerHeight = height - margin.top - margin.bottom - 100;
    const innerWidth = width - margin.left - margin.right;
    const xAxisLabelOffset = 50
    const xValue = d => d.msPlayed;
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
    console.log(props.stats.artists);
    return (
        <div className="Artists">
            This is the artists page.

            <br/><br/>
            You listened to {props.stats.highLevel.uniqueArtists} artists.
            <br/><br/>
            
            <BarChartHorizontalCategorical 
                width={width}
                height={height}
                innerHeight={innerHeight}
                innerWidth={innerWidth}
                margin={margin}
                data={topArtists}
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