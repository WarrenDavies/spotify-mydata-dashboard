import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import * as dateAndTime from '../../utils/DateAndTime';
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import './time.scss'
import ReactDropdown from 'react-dropdown';

export default function Time(props) {

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
            stat: props.stats.highLevel.daysListenedOn
        },
        {
            header: 'Days in period',
            stat: props.stats.highLevel.daysInPeriod
        },
    ]

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)' },
        { value: 'uniqueListens', label: 'Number of listens' }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label

    // bar chart

    const timeChart = {
        width: 1400,
        height: 500,
        margin: { top: 20, right: 50, bottom: 20, left: 50 },
        xAxisOffset: 10,
        xAxisLabel: '',
        xAxisLabelOffset: 23,
        xValue: d => d.dateOfListen,
        yValue: d => d[barChartMeasure],
        d3Format: d3.format(""),
        xAxisTickFormat: n => timeChart.d3Format(n),
        xAxisTickLimiter: 8,
    }
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 50;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;


    const dayChart = {
        width: 600,
        height: 550,
        margin: { top: 20, right: 20, bottom: 20, left: 100 },
        xAxisOffset: 10,
        xAxisLabelOffset: 50,
        xAxisLabel: '',
        xValue: d => d[barChartMeasure],
        yValue: d => d.name,
        d3Format: d3.format(""),
        xAxisTickFormat: n => dayChart.d3Format(n),
        xAxisTickLimiter: 0,
    }
    dayChart.innerHeight = dayChart.height - dayChart.margin.top - dayChart.margin.bottom - 50;
    dayChart.innerWidth = dayChart.width - dayChart.margin.left - dayChart.margin.right;

    const hourChart = {
        width: 600,
        height: 550,
        margin: { top: 20, right: 20, bottom: 20, left: 40 },
        xAxisLabelOffset: 50,
        xAxisOffset: 10,
        xAxisLabel: '',
        xValue: d => d.name,
        yValue: d => d[barChartMeasure],
        d3Format: d3.format(""),
        xAxisTickFormat: n => hourChart.d3Format(n),
        xAxisTickLimiter: 0,
    }
    hourChart.innerHeight = hourChart.height - hourChart.margin.top - hourChart.margin.bottom - 50;
    hourChart.innerWidth = hourChart.width - hourChart.margin.left - hourChart.margin.right;

    const monthChart = {
        width: 500,
        height: 550,
        margin: { top: 20, right: 20, bottom: 20, left: 100 },
        xAxisLabelOffset: 50,
        xAxisOffset: 10,
        xAxisLabel: '',
        xValue: d => d[barChartMeasure],
        yValue: d => d.name,
        d3Format: d3.format(""),
        xAxisTickFormat: n => monthChart.d3Format(n),
        xAxisTickLimiter: 0,
    }
    monthChart.innerHeight = monthChart.height - monthChart.margin.top - monthChart.margin.bottom - 50;
    monthChart.innerWidth = monthChart.width - monthChart.margin.left - monthChart.margin.right;

    console.log(props.stats.time.hours);

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

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
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
                xAxisTickLimiter={timeChart.xAxisTickLimiter}
            />

            <div className='chart-container'>
                <div className='inline-chart'>
                    <h2 className='chart-title'>On what months do you listen most?</h2>
                    <BarChartHorizontalCategorical 
                        id="month-chart"
                        width={monthChart.width}
                        height={monthChart.height}
                        innerHeight={monthChart.innerHeight}
                        innerWidth={monthChart.innerWidth}
                        margin={monthChart.margin}
                        data={props.stats.time.months}
                        xValue={monthChart.xValue}
                        yValue={monthChart.yValue}
                        xAxisLabel={monthChart.xAxisLabel}
                        xAxisLabelOffset={monthChart.xAxisLabelOffset}
                        xAxisOffset={monthChart.xAxisOffset}
                        xAxisTickFormat={monthChart.xAxisTickFormat}
                        xAxisTickLimiter={monthChart.xAxisTickLimiter}
                        xAxisLabelLinks={false}
                        urlPrefix={false}
                    />
                </div>
                
                <div className='inline-chart'>
                    <h2 className='chart-title'>On what days do you listen most?</h2>
                    <BarChartHorizontalCategorical 
                        id="day-chart"
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
                        xAxisOffset={dayChart.xAxisOffset}
                        xAxisTickFormat={dayChart.xAxisTickFormat}
                        xAxisTickLimiter={dayChart.xAxisTickLimiter}
                    />
                </div>
            </div>

            <div className='chart-container-full-width'>
                <h2 className='chart-title'>When in the day do you listen?</h2>
                <BarChart
                    width={timeChart.width}
                    height={timeChart.height}
                    innerHeight={timeChart.innerHeight}
                    innerWidth={timeChart.innerWidth}
                    margin={timeChart.margin}
                    data={props.stats.time.hours}
                    xValue={hourChart.xValue}
                    yValue={hourChart.yValue}
                    xAxisLabel={hourChart.xAxisLabel}
                    xAxisLabelOffset={hourChart.xAxisLabelOffset}
                    xAxisOffset={hourChart.xAxisOffset}
                    xAxisTickFormat={hourChart.xAxisTickFormat}
                    xAxisTickLimiter={hourChart.xAxisTickLimiter}
                />
            </div>
            <div className='table-container time-table'>
                <Table
                    columns={columns}
                    data={props.stats.time.dates}
                    convertMsToLargestTimeUnit={dateAndTime.convertMsToLargestTimeUnit}
                    placeholder="Search for a date"
                />
            </div>
        </div>
    )
}