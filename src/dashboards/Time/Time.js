import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import * as dateAndTime from '../../utils/DateAndTime';
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';

export default function Time(props) {
    // Listens Uploaded = {props.listensUploaded}<br/>
    // Days listened on = {props.stats.time.dates.length}<br/>
    // From: {props.stats.highLevel.minDate.toDateString()}<br/>
    // To: {props.stats.highLevel.maxDate.toDateString()}<br/>
    // Days in period: {dateAndTime.convertMsToDays(props.stats.highLevel.daysInPeriod)}<br/>

    const headlineStats = [
        {
            header: 'Total listening time',
            stat: props.stats.highLevel.totalListeningTimeString
        },
        {
            header: 'Total unique Listens',
            stat: props.listensUploaded
        },
        {
            header: 'Days listened on',
            stat: props.stats.time.dates.length
        },
        {
            header: 'Days in period',
            stat: dateAndTime.convertMsToDays(props.stats.highLevel.daysInPeriod),
        },
    ]

    // bar chart

    const width = 1400;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 50};
    const innerHeight = height - margin.top - margin.bottom - 100;
    const innerWidth = width - margin.left - margin.right;
    const xAxisLabelOffset = 50
    const xValue = d => d.dateOfListen;
    const yValue = d => d.hrsPlayed;
    const d3Format = d3.format(".2s");
    const xAxisTickFormat = n => d3Format(n);

    const timeChart = {
        width: 1400,
        height: 600,
        margin: { top: 20, right: 50, bottom: 20, left: 50 },
        xAxisOffset: 10,
        xAxisLabel: 'Date',
        xAxisLabelOffset: 23,
        xValue: d => d.dateOfListen,
        yValue: d => d.hrsPlayed,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => timeChart.d3Format(n),
    }
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 100;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;


    const columns = useMemo(() => [
        {
            Header: 'Data',
            columns: [
                {
                    Header: "Date",
                    accessor: 'dateOfListen',
                    Cell: ({ value }) => {
                        return (
                            <Link to={'/time/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "Listening Time",
                    accessor: 'msPlayed',
                    Cell: ({ value }) => {
                        return (
                            dateAndTime.convertMsToLargestTimeUnit(value)
                        )
                    }
                },
                {
                    Header: "Total Listens",
                    accessor: 'uniqueListens'
                },
                {
                    Header: "Top Artist",
                    accessor: 'topArtist.artistName',
                    Cell: ({ value }) => {
                        return (
                            <Link to={'/artist/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "Top Track",
                    accessor: 'topTrack.trackAndArtistName',
                    Cell: ({ value }) => {
                        return (
                            <Link to={'/track/' + value}>{value}</Link>
                        )
                    }
                }
            ]
        }
    ])


    if (!props.data) {

        headlineStats.forEach((j) => {
            j.stat = 0;
        })

        return (
            <>
                Upload some data!
            </>
        )
    }

    return (
        
        <div className='Time'>
            
            Time dashboard<br/>


            <StatBoxContainer 
                statBoxes={headlineStats}
            />

            <BarChart 
                id="time-bar-chart"
                width={width}
                height={height}
                innerHeight={innerHeight}
                innerWidth={innerWidth}
                margin={margin}
                data={props.stats.time.dates}
                xValue={xValue}
                yValue={yValue}
                xAxisLabel={timeChart.xAxisLabel}
                xAxisLabelOffset={xAxisLabelOffset}
                xAxisOffset={timeChart.xAxisOffset}
                xAxisTickFormat={xAxisTickFormat}
            />

            <Table
                columns={columns}
                data={props.stats.time.dates}
                convertMsToLargestTimeUnit={dateAndTime.convertMsToLargestTimeUnit}
                placeholder="Search for a date"
            />

            <br/><br/><br/><br/>
            hours: {JSON.stringify(props.stats.time.hours)} <br/><br/>
            dates: {JSON.stringify(props.stats.time.dates)} <br/>
        </div>
    )
}