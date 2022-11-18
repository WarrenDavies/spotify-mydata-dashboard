import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart'

export default function Time(props) {

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

    // bar chart

    const width = 960;
    const height = 700;
    const margin = { top: 20, right: 20, bottom: 20, left: 230};
    const innerHeight = height - margin.top - margin.bottom - 100;
    const innerWidth = width - margin.left - margin.right;
    const xAxisLabelOffset = 50
    const xValue = d => d.dateOfListen;
    const yValue = d => d.msPlayed;
    const d3Format = d3.format(".2s")
    const xAxisTickFormat = n => d3Format(n)


    return (
        
        <div className='Time'>
            
            Time dashboard<br/>
            Listens Uploaded = {props.listensUploaded}<br/>
            Days listened on = {props.stats.time.dates.length}<br/>
            From: {props.stats.highLevel.minDate}<br/>
            To: {props.stats.highLevel.maxDate}<br/>

            <BarChart 
                width={width}
                height={height}
                innerHeight={innerHeight}
                innerWidth={innerWidth}
                margin={margin}
                data={props.stats.time.dates}
                xValue={xValue}
                yValue={yValue}
                xAxisLabelOffset={xAxisLabelOffset}
                xAxisTickFormat={xAxisTickFormat}
            />

            <Table
                columns={columns}
                data={props.stats.time.dates}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder="Search for a date"
            />

            <br/><br/><br/><br/>
            hours: {JSON.stringify(props.stats.time.hours)} <br/><br/>
            dates: {JSON.stringify(props.stats.time.dates)} <br/>
        </div>
    )
}