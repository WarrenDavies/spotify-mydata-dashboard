import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'
import * as d3 from 'd3';
import BarChart from '../../components/vis/BarChart/BarChart';
import BarChartHorizontalCategorical from '../../components/vis/BarChart/BarChartHorizontalCategorical';
import {convertMsToLargestTimeUnit, convertMsToHours, convertMsToHoursNumber, getEmptyTimeArrays} from '../../utils/DateAndTime'
import StatBoxContainer from '../../components/vis/StatBox/StatBoxContainer';
import ReactDropdown from 'react-dropdown';

export default function Artist(props) {

    const { artistName } = useParams();

    const artistStats = props.stats.artists.find(e => e.artistName == artistName);
    const totalListeningTime = props.convertMsToLargestTimeUnit(artistStats.msPlayed);
    const uniqueListens = artistStats.uniqueListens;

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)' },
        { value: 'uniqueListens', label: 'Number of listens' }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label
    // another way to do this will be to add the listents to an array in .artists during updateStats.

    // should this be using data not tracks
    const artistTrackData = props.stats.tracks.filter(
        i => i.artistName == artistName
    );

    // should this be using data not tracks
    const artistDateData = props.data.filter(i => i.artistName == artistName);
    console.log(props.dateList);

    function deepCloneArray(arrayToClone) {
        return arrayToClone.map( x => { return {...x}} )
    }

    function getThisArtistData(artistDateData) {
        console.log('updating artist data');
        // let artistDateStats = [...props.dateList];
        let artistDateStats = deepCloneArray(props.dateList)

        const [hours, days, months] = getEmptyTimeArrays();

        let hourData = deepCloneArray(hours);
        let dayData = deepCloneArray(days);
        let monthData = deepCloneArray(months);

        artistDateData.forEach((i) => {
        
            // Dates
            ////////
            let dateOfListen = i.endTime.substring(0, 10);
            let dateArrayIndex = artistDateStats.findIndex(e => e['dateOfListen'] === dateOfListen);
                        
            if (dateArrayIndex === -1) {
                artistDateStats.push ({
                    dateOfListen: dateOfListen,
                    msPlayed: i.msPlayed,
                    uniqueListens: 1,
                    listens: []
                });
            } else {
                artistDateStats[dateArrayIndex].msPlayed += i.msPlayed;
                artistDateStats[dateArrayIndex].uniqueListens += 1;
                // newStats.time.dates.listens.push(i);
            }
    
            // Days
            ////////
            let dayOfListen = new Date(i.endTime).getDay();
            dayData[dayOfListen].msPlayed += i.msPlayed;
            dayData[dayOfListen].uniqueListens += 1;
    
            // Months
            ////////
            let monthOfListen = new Date(i.endTime).getMonth();
            monthData[monthOfListen].msPlayed += i.msPlayed;
            monthData[monthOfListen].uniqueListens += 1;
    
            // Hours
            ////////
            let hourOfListen = i.endTime.substring(11, 13);
            let hourArrayIndex = hourData.findIndex(e => e['hourOfListen'] === hourOfListen);
            hourData[hourArrayIndex].msPlayed += i.msPlayed;
            hourData[hourArrayIndex].uniqueListens += 1;
    
        });

        artistDateStats.forEach( (j) => {
            j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
        })
        dayData.forEach( (j) => {
            j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
        })
        monthData.forEach( (j) => {
            j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
        })
        hourData.forEach( (j) => {
            j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
        })

        return {
            'artistDateStats': artistDateStats, 
            'hourData': hourData, 
            'dayData': dayData, 
            'monthData': monthData
        }
    }

    const artistIndex = props.stats.artists.findIndex(e => e['artistName'] == artistName);

    props.stats.artists[artistIndex].artistPageStats = useMemo(
        () => getThisArtistData(artistDateData),
        [props.data]
    );

    // if (!("artistDateStats" in props.stats.artists[artistIndex].artistPageStats)) {
    //     props.stats.artists[artistIndex].artistPageStats = getThisArtistData(artistDateData);
    // }
    
    const thisArtistStats = props.stats.artists[artistIndex].artistPageStats;

    console.log(artistIndex);
    console.log(artistName);
    console.log(props.stats.artists[artistIndex].artistPageStats);
    console.log(props.stats.artists);
    console.log(thisArtistStats);
    console.log(props.dateList);

    const uniqueTracksArray = (artistTrackData
        .map(
            (i) => {
                return i.trackName
            }
        )
        .filter(
            (item, index, arr) => {
                return arr.indexOf(item) == index
            }
        )
    );

    const uniqueTracks = uniqueTracksArray.length;

    const averageListensPerTrack = parseFloat(uniqueListens / uniqueTracks).toFixed(2);

    const headlineStats = [
        {
            header: 'Total listening time',
            stat: totalListeningTime
        },
        {
            header: 'Total unique Listens',
            stat: uniqueListens
        },
        {
            header: 'Tracks listened to',
            stat: uniqueTracks
        },
        {
            header: 'Average listens per track',
            stat: averageListensPerTrack
        },
    ]


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
        d3Format: d3.format(".2s"),
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
        d3Format: d3.format(".2s"),
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
        d3Format: d3.format(".2s"),
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
        d3Format: d3.format(".2s"),
        xAxisTickFormat: n => monthChart.d3Format(n),
        xAxisTickLimiter: 0,
    }
    monthChart.innerHeight = monthChart.height - monthChart.margin.top - monthChart.margin.bottom - 50;
    monthChart.innerWidth = monthChart.width - monthChart.margin.left - monthChart.margin.right;
    
    const columns = useMemo(() => [
        {
            Header: 'All tracks for ' + artistName,
            columns: [
                {
                    Header: "TrackName",
                    accessor: 'trackName',
                    Cell: ({ value }) => {
                        return (
                            // <a href={'/artist/' + value}>{value}</a>
                            <Link to={'/track/' + value + '/' + artistName}>{value}</Link>
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
                },
                {
                    Header: "Last Listen",
                    accessor: 'lastListen'
                }
            ]
        }
    ])

    return (
        <div>

            This is the artist page for {artistName}
            <br/><br/>

            <StatBoxContainer 
                statBoxes={headlineStats}
            />

            <ReactDropdown
                options={dropDownAttributes}
                onChange={option => setBarChartMeasure(option.value)}
                value={initialBarChartMeasure}
                dropdownLabel="Choose time or listens: "
            />

            <div id="bar-chart-container">
                <BarChart 
                    id="time-bar-chart"
                    width={timeChart.width}
                    height={timeChart.height}
                    innerHeight={timeChart.innerHeight}
                    innerWidth={timeChart.innerWidth}
                    margin={timeChart.margin}
                    data={thisArtistStats.artistDateStats}
                    allData={props.data}
                    xValue={timeChart.xValue}
                    yValue={timeChart.yValue}
                    xAxisLabel={timeChart.xAxisLabel}
                    xAxisLabelOffset={timeChart.xAxisLabelOffset}
                    xAxisOffset={timeChart.xAxisOffset}
                    xAxisTickFormat={timeChart.xAxisTickFormat}
                    xAxisTickLimiter={timeChart.xAxisTickLimiter}
                />
            </div>

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
                        data={props.stats.artists[artistIndex].artistPageStats.monthData}
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
                        data={props.stats.artists[artistIndex].artistPageStats.dayData}
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
                    data={props.stats.artists[artistIndex].artistPageStats.hourData}
                    xValue={hourChart.xValue}
                    yValue={hourChart.yValue}
                    xAxisLabel={hourChart.xAxisLabel}
                    xAxisLabelOffset={hourChart.xAxisLabelOffset}
                    xAxisOffset={hourChart.xAxisOffset}
                    xAxisTickFormat={hourChart.xAxisTickFormat}
                    xAxisTickLimiter={hourChart.xAxisTickLimiter}
                />
            </div>
            <div class='table-container artists-table'>
                <Table
                    columns={columns}
                    data={artistTrackData}
                    convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                    placeholder={'Search for a track'}
                    search={true}
                />
            </div>
        </div>
    )
}