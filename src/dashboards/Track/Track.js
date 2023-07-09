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
import * as dashboardUtils from '../../utils/Dashboards';

export default function Track(props) {

    

    const { trackName, artistName } = useParams();

    const pageTitle = trackName + ' by ' + artistName;


    const trackStats = props.stats.tracks.find(
        e => (e.trackName == trackName) && (e.artistName == artistName)
    );
    const totalListeningTime = props.convertMsToLargestTimeUnit(trackStats.msPlayed);
    const uniqueListens = trackStats.uniqueListens;
    const trackDateData = props.data.filter(
        (i) => {return (i.trackName == trackName) && (i.artistName == artistName)}
    );

    // msPlayed/listens dropdown
    const dropDownAttributes = [
        { value: 'hrsPlayed', label: 'Listening time (hours)' },
        { value: 'uniqueListens', label: 'Number of listens' }
    ];
    const initialBarChartMeasure = 'hrsPlayed';
    const [barChartMeasure, setBarChartMeasure] = useState(initialBarChartMeasure);
    const barChartMeasureLabel = dropDownAttributes.find(x => x.value === barChartMeasure).label

    function deepCloneArray(arrayToClone) {
        return arrayToClone.map( x => { return {...x}} )
    }

    function getThisArtistData(artistDateData) {
        console.log('updating track data');
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
            'trackDateStats': artistDateStats, 
            'hourData': hourData, 
            'dayData': dayData, 
            'monthData': monthData
        }
    }

    const trackIndex = props.stats.tracks.findIndex(e => (e['artistName'] == artistName) && (e['trackName'] == trackName));

    props.stats.tracks[trackIndex].trackPageStats = useMemo(
        () => getThisArtistData(trackDateData),
        [props.data]
    );

    
    const thisTrackStats = props.stats.tracks[trackIndex].trackPageStats;

    const uniqueTracksArray = (trackDateData
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
        // {
        //     header: 'Total listening time',
        //     stat: totalListeningTime
        // },
        // {
        //     header: 'Total unique Listens',
        //     stat: uniqueListens
        // },
        // {
        //     header: 'Tracks listened to',
        //     stat: uniqueTracks
        // },
        // {
        //     header: 'Average listens per track',
        //     stat: averageListensPerTrack
        // },
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
        d3Format: d3.format(""),
        xAxisTickFormat: n => timeChart.d3Format(n),
        xAxisTickLimiter: 9,
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
        xAxisTicks: 6,
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
        xAxisTicks: 6,
    }
    monthChart.innerHeight = monthChart.height - monthChart.margin.top - monthChart.margin.bottom - 50;
    monthChart.innerWidth = monthChart.width - monthChart.margin.left - monthChart.margin.right;
    
    if (props.data.length == 0) {
        return dashboardUtils.getPlaceholder(pageTitle);
    }

    return (
        <div>

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

            <div id="bar-chart-container">
                <BarChart 
                    id="time-bar-chart"
                    width={timeChart.width}
                    height={timeChart.height}
                    innerHeight={timeChart.innerHeight}
                    innerWidth={timeChart.innerWidth}
                    margin={timeChart.margin}
                    data={thisTrackStats.trackDateStats}
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
                        data={props.stats.tracks[trackIndex].trackPageStats.monthData}
                        xValue={monthChart.xValue}
                        yValue={monthChart.yValue}
                        xAxisLabel={monthChart.xAxisLabel}
                        xAxisLabelOffset={monthChart.xAxisLabelOffset}
                        xAxisOffset={monthChart.xAxisOffset}
                        xAxisTickFormat={monthChart.xAxisTickFormat}
                        xAxisTicks={monthChart.xAxisTicks}
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
                        data={props.stats.tracks[trackIndex].trackPageStats.dayData}
                        xValue={dayChart.xValue}
                        yValue={dayChart.yValue}
                        xAxisLabel={dayChart.xAxisLabel}
                        xAxisLabelOffset={dayChart.xAxisLabelOffset}
                        xAxisOffset={dayChart.xAxisOffset}
                        xAxisTickFormat={dayChart.xAxisTickFormat}
                        xAxisTicks={dayChart.xAxisTicks}
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
                    data={props.stats.tracks[trackIndex].trackPageStats.hourData}
                    xValue={hourChart.xValue}
                    yValue={hourChart.yValue}
                    xAxisLabel={hourChart.xAxisLabel}
                    xAxisLabelOffset={hourChart.xAxisLabelOffset}
                    xAxisOffset={hourChart.xAxisOffset}
                    xAxisTickFormat={hourChart.xAxisTickFormat}
                    xAxisTickLimiter={hourChart.xAxisTickLimiter}
                />
            </div>
        </div>
    )
}