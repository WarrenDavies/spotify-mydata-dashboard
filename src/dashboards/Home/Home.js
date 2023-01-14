import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import * as dateAndTime from '../../utils/DateAndTime';



export default function Home(props) {

    const [listensProcessed, setListensProcessed] = useState(0)

    const timeChart = {}
    timeChart.width = 960;
    timeChart.height = 700;
    timeChart.margin = { top: 20, right: 20, bottom: 20, left: 230};
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 100;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;
    timeChart.xAxisLabelOffset = 50
    timeChart.xValue = d => d.dateOfListen;
    timeChart.yValue = d => d.hrsPlayed;
    timeChart.d3Format = d3.format(".2s")
    timeChart.xAxisTickFormat = n => timeChart.d3Format(n)

    function processData(data) {
        // let listensUploaded;

        // if (listensProcessed != data.length) {
            
        //     listensUploaded = listensProcessed + data.length;
        //     setListensProcessed(listensUploaded);
        // }
    }

    useEffect(() => {
        processData(props.data);
    });
    
    return (
        
        <div className='Home'>
            The home page with high level stats. <br/>
            Total listening time: {props.stats.highLevel.totalListeningTimeString} <br/>
            Total artists listened to: {props.stats.highLevel.uniqueArtists}<br/>

            data.length: {props.data.length} <br/>
            listensProcessed: {listensProcessed} <br/><br/>
            
            <h1>Listening History over Time</h1>

            <BarChart 
                width={timeChart.width}
                height={timeChart.height}
                innerHeight={timeChart.innerHeight}
                innerWidth={timeChart.innerWidth}
                margin={timeChart.margin}
                data={props.stats.time.dates}
                xValue={timeChart.xValue}
                yValue={timeChart.yValue}
                xAxisLabelOffset={timeChart.xAxisLabelOffset}
                xAxisTickFormat={timeChart.xAxisTickFormat}
            />


            <h1>Top Artists</h1>



            data: {JSON.stringify(props.data)} <br/>
            
            


        </div>
    )
}