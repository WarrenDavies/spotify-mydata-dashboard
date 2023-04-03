import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import * as dateAndTime from '../../utils/DateAndTime';
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';

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


    const dayChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 100 },
        xAxisLabelOffset: 50,
        xAxisLabel: '',
        xValue: d => d.hrsPlayed,
        yValue: d => d.name,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => dayChart.d3Format(n),
    }
    dayChart.innerHeight = dayChart.height - dayChart.margin.top - dayChart.margin.bottom - 100;
    dayChart.innerWidth = dayChart.width - dayChart.margin.left - dayChart.margin.right;

    const hourChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 100 },
        xAxisLabelOffset: 50,
        xAxisLabel: '',
        xValue: d => d.hrsPlayed,
        yValue: d => d.name,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => hourChart.d3Format(n),
    }
    hourChart.innerHeight = hourChart.height - hourChart.margin.top - hourChart.margin.bottom - 100;
    hourChart.innerWidth = hourChart.width - hourChart.margin.left - hourChart.margin.right;





    const columns = useMemo(() => [
        {
            Header: 'Top stats for each day',
            columns: [
                {
                    Header: "Date",
                    accessor: 'dateOfListen',
                    Cell: ({ value }) => {
                        return (
                            <Link to={'/time/' + value}>{value}</Link>
                        )
                    },
                    size: 200,
                    title: "Date",
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
                    Header: "Top Artist listening time",
                    accessor: 'topArtist.msPlayed',
                    Cell: ({ value }) => {
                        let returnValue = ''
                        if (value) {
                            returnValue = dateAndTime.convertMsToLargestTimeUnit(value)     
                        }
                        return (
                            returnValue
                        )
                    }
                },
                {
                    Header: "Top Artist listens",
                    accessor: 'topArtist.uniqueListens',
                    Cell: ({ value }) => {
                        return (
                            value
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
                },
                {
                    Header: "Top Track listening time",
                    accessor: 'topTrack.msPlayed',
                    Cell: ({ value }) => {
                        let returnValue = ''
                        if (value) {
                            returnValue = dateAndTime.convertMsToLargestTimeUnit(value)     
                        }
                        return (
                            returnValue
                        )
                    }
                },
                {
                    Header: "Top Track listens",
                    accessor: 'topTrack.uniqueListens',
                    Cell: ({ value }) => {
                        return (
                            value
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
                width={timeChart.width}
                height={timeChart.height}
                innerHeight={timeChart.innerHeight}
                innerWidth={timeChart.innerWidth}
                margin={timeChart.margin}
                data={props.stats.time.dates}
                xValue={timeChart.xValue}
                yValue={timeChart.yValue}
                xAxisLabel={timeChart.xAxisLabel}
                xAxisLabelOffset={timeChart.xAxisLabelOffset}
                xAxisOffset={timeChart.xAxisOffset}
                xAxisTickFormat={timeChart.xAxisTickFormat}
            />

            <div className='chart-container'>
                <div className='inline-chart'>
                    <h2 className='chart-title'>On what days do you listen most?</h2>
                    <BarChartHorizontalCategorical
                        width={dayChart.width}
                        height={dayChart.height}
                        innerHeight={dayChart.innerHeight}
                        innerWidth={dayChart.innerWidth}
                        margin={dayChart.margin}
                        data={props.stats.time.days}
                        xValue={dayChart.xValue}
                        yValue={dayChart.yValue}
                        xAxisLabel={dayChart.xAxisLabel}
                        xAxisLabelOffset={dayChart.xAxisLabelOffset}
                        xAxisTickFormat={dayChart.xAxisTickFormat}
                        urlPrefix='artist/'
                        urlSuffix=''
                    />
                </div>
                <div className='inline-chart'>
                    <h2 className='chart-title'>When in the day do you listen?</h2>
                    <BarChartHorizontalCategorical
                        width={hourChart.width}
                        height={hourChart.height}
                        innerHeight={hourChart.innerHeight}
                        innerWidth={hourChart.innerWidth}
                        margin={hourChart.margin}
                        data={props.stats.time.hours}
                        xValue={hourChart.xValue}
                        yValue={hourChart.yValue}
                        xAxisLabel={hourChart.xAxisLabel}
                        xAxisLabelOffset={hourChart.xAxisLabelOffset}
                        xAxisTickFormat={hourChart.xAxisTickFormat}
                        urlPrefix='artist/'
                        urlSuffix=''
                    />
                </div>
            </div>

            <Table
                columns={columns}
                data={props.stats.time.dates}
                convertMsToLargestTimeUnit={dateAndTime.convertMsToLargestTimeUnit}
                placeholder="Search for a date"
            />
        </div>
    )
}