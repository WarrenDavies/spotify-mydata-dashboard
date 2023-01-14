import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import * as dateAndTime from '../../utils/DateAndTime';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import ReactDropdown from 'react-dropdown';


export default function Home(props) {

    const [listensProcessed, setListensProcessed] = useState(0)
    const [artistData, updateArtistData] = useState(props.stats.artists);

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)' },
        { value: 'uniqueListens', label: 'Number of listens' }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);


    const timeChart = {}
    timeChart.width = 960;
    timeChart.height = 700;
    timeChart.margin = { top: 20, right: 20, bottom: 20, left: 230};
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 100;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;
    timeChart.xAxisLabelOffset = 50
    timeChart.xValue = d => d.dateOfListen;
    timeChart.yValue = d => d[barChartMeasure];
    timeChart.d3Format = d3.format(".2s")
    timeChart.xAxisTickFormat = n => timeChart.d3Format(n)

    const topArtistChart = {}
    topArtistChart.width = 960;
    topArtistChart.height = 700;
    topArtistChart.margin = { top: 20, right: 20, bottom: 20, left: 230 };
    topArtistChart.innerHeight = topArtistChart.height - topArtistChart.margin.top - topArtistChart.margin.bottom - 100;
    topArtistChart.innerWidth = topArtistChart.width - topArtistChart.margin.left - topArtistChart.margin.right;
    topArtistChart.xAxisLabelOffset = 50
    topArtistChart.xValue = d => d[barChartMeasure];
    topArtistChart.yValue = d => d.artistName;
    topArtistChart.d3Format = d3.format(".2s")
    topArtistChart.xAxisTickFormat = n => topArtistChart.d3Format(n)

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
    
    if (!props.data) {
        return (
            <>
                Upload some data!
            </>
        )
    }

    return (
        
        <div className='Home'>
            The home page with high level stats. <br/>
            Total listening time: {props.stats.highLevel.totalListeningTimeString} <br/>
            Total artists listened to: {props.stats.highLevel.uniqueArtists}<br/>

            data.length: {props.data.length} <br/>
            listensProcessed: {listensProcessed} <br/><br/>

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
            />
            
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
            />

            data: {JSON.stringify(props.data)} <br/>
            
            


        </div>
    )
}