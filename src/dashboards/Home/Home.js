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


    const timeChart = {
        width: 960,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xValue: d => d.dateOfListen,
        yValue: d => d[barChartMeasure],
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => timeChart.d3Format(n),
    }
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 100;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;

    const topArtistChart = {
        width: 960,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xValue: d => d[barChartMeasure],
        yValue: d => d.artistName,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => topArtistChart.d3Format(n),
    }
    topArtistChart.innerHeight = topArtistChart.height - topArtistChart.margin.top - topArtistChart.margin.bottom - 100;
    topArtistChart.innerWidth = topArtistChart.width - topArtistChart.margin.left - topArtistChart.margin.right;

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



    const topTracksChart = {
        width: 960,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xValue: d => d[barChartMeasure],
        yValue: d => d.trackName,
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => topTracksChart.d3Format(n),
    }
    topTracksChart.innerHeight = topTracksChart.height - topTracksChart.margin.top - topTracksChart.margin.bottom - 100;
    topTracksChart.innerWidth = topTracksChart.width - topTracksChart.margin.left - topTracksChart.margin.right;

    const topTracks = useMemo(() => {
        const hrsPlayed = props.stats.tracks
            .sort((a, b) => {
                return b.hrsPlayed - a.hrsPlayed;
            })
            .slice(0, 19);

        const uniqueListens = props.stats.tracks
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
    }, [props.stats.tracks])
    console.log(topTracks);
    console.log(props.stats.tracks);


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
            
            <h1>Top Tracks</h1>

            <BarChartHorizontalCategorical
                width={topTracksChart.width}
                height={topTracksChart.height}
                innerHeight={topTracksChart.innerHeight}
                innerWidth={topTracksChart.innerWidth}
                margin={topTracksChart.margin}
                data={topTracks[barChartMeasure]}
                xValue={topTracksChart.xValue}
                yValue={topTracksChart.yValue}
                xAxisLabelOffset={topTracksChart.xAxisLabelOffset}
                xAxisTickFormat={topTracksChart.xAxisTickFormat}
            />

        </div>
    )
}