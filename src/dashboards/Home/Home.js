import React, {useState, useEffect, useMemo} from 'react';
import Table from '../../components/Table/Table';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import * as dateAndTime from '../../utils/DateAndTime';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';
import StatBox from '../../components/vis/StatBox/StatBox';
import ReactDropdown from 'react-dropdown';
import './home.scss'
import * as dashboardUtils from '../../utils/Dashboards';

export default function Home(props) {

    const pageTitle = "Home";

    const [listensProcessed, setListensProcessed] = useState(0)
    const [artistData, updateArtistData] = useState(props.stats.artists);

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)' },
        { value: 'uniqueListens', label: 'Number of listens' }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label

    const timeChart = {
        width: 1400,
        height: 600,
        margin: { top: 20, right: 50, bottom: 20, left: 50 },
        xAxisOffset: 10,
        xAxisLabel: 'Date',
        xAxisLabelOffset: 23,
        xValue: d => d.dateOfListen,
        yValue: d => d[barChartMeasure],
        d3Format: d3.format(""),
        xAxisTickFormat: n => timeChart.d3Format(n),
        xAxisTickLimiter: 8,
    }
    timeChart.innerHeight = timeChart.height - timeChart.margin.top - timeChart.margin.bottom - 100;
    timeChart.innerWidth = timeChart.width - timeChart.margin.left - timeChart.margin.right;

    
    const topArtistChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.artistName,
        d3Format: d3.format(""),
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
    }, [props.data])



    const topTracksChart = {
        width: 600,
        height: 700,
        margin: { top: 20, right: 20, bottom: 20, left: 230 },
        xAxisLabelOffset: 50,
        xAxisLabel: barChartMeasureLabel,
        xValue: d => d[barChartMeasure],
        yValue: d => d.trackName,
        d3Format: d3.format(""),
        xAxisTickFormat: n => topTracksChart.d3Format(n),
    }
    topTracksChart.innerHeight = topTracksChart.height - topTracksChart.margin.top - topTracksChart.margin.bottom - 100;
    topTracksChart.innerWidth = topTracksChart.width - topTracksChart.margin.left - topTracksChart.margin.right;

    const topTracks = useMemo( () => {
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
    }, [props.data])

    const headlineStats = [
        {
            header: 'Total listening time',
            stat: props.stats.highLevel.totalListeningTimeString
        },
        {
            header: 'Total artists',
            stat: props.stats.highLevel.uniqueArtists
        },
        {
            header: 'Total tracks',
            stat: props.stats.highLevel.uniqueTracks
        },
        {
            header: 'Average tracks per artist',
            stat: (props.stats.highLevel.uniqueTracks / props.stats.highLevel.uniqueArtists).toFixed(2)
        },
    ]

    if (props.data.length == 0) {
        return dashboardUtils.getPlaceholder(pageTitle);
    }

    return (
        
        <div className='Home'>
            
            <h2>{pageTitle}</h2>

            <StatBoxContainer 
                statBoxes={headlineStats}
            />

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
            />
            
            <h2 className='chart-title'>Listening History over Time</h2>

            {/* <div id="bar-chart-container"> */}
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
            {/* </div> */}

            <div className='chart-container'>
                <div className='inline-chart'>
                    <h2 className='chart-title'>Top Artists</h2>

                    <BarChartHorizontalCategorical
                        width={topArtistChart.width}
                        height={topArtistChart.height}
                        innerHeight={topArtistChart.innerHeight}
                        innerWidth={topArtistChart.innerWidth}
                        margin={topArtistChart.margin}
                        data={topArtists[barChartMeasure]}
                        xValue={topArtistChart.xValue}
                        yValue={topArtistChart.yValue}
                        xAxisLabel={topArtistChart.xAxisLabel}
                        xAxisLabelOffset={topArtistChart.xAxisLabelOffset}
                        xAxisTickFormat={topArtistChart.xAxisTickFormat}
                        urlPrefix='artist/'
                        urlSuffix=''
                    />
                </div>

                <div className='inline-chart'>
                    <h2 className='chart-title'>Top Tracks</h2>

                    <BarChartHorizontalCategorical
                        width={topTracksChart.width}
                        height={topTracksChart.height}
                        innerHeight={topTracksChart.innerHeight}
                        innerWidth={topTracksChart.innerWidth}
                        margin={topTracksChart.margin}
                        data={topTracks[barChartMeasure]}
                        xValue={topTracksChart.xValue}
                        yValue={topTracksChart.yValue}
                        xAxisLabel={topTracksChart.xAxisLabel}
                        xAxisLabelOffset={topTracksChart.xAxisLabelOffset}
                        xAxisTickFormat={topTracksChart.xAxisTickFormat}
                        urlPrefix='track/'
                        urlSuffixLookup='artistName'
                    />
                </div>
            </div>
        </div>
    )
}