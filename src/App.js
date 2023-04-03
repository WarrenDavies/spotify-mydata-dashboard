import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter}
        from 'react-router-dom';
import './App.scss';
import './variables.scss';
import './globals.scss';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './dashboards/Home/Home'
import Time from './dashboards/Time/Time'
import Artists from './dashboards/Artists/Artists'
import Artist from './dashboards/Artist/Artist'
import Tracks from './dashboards/Tracks/Tracks'
import Track from './dashboards/Track/Track'
import DatePage from './dashboards/Time/DatePage'
import {min, max} from 'd3'
import {convertMsToLargestTimeUnit, convertMsToHours, convertMsToHoursNumber} from './utils/DateAndTime'


function App(props) {

    const [data, setData] = useState(props.data);
    const [listensUploaded, setListensUploaded] = useState(props.listensUploaded);
    const [stats, setStats] = useState(props.stats);

    function checkIfRecordExists(existingListen, newListen) {
        if (
            existingListen.endTime == newListen.endTime &&
            existingListen.artistName == newListen.artistName &&
            existingListen.trackName == newListen.trackName &&
            existingListen.msPlayed == newListen.msPlayed 
        ) {
            return true;
        }

    }

    function addData(newData) {
        let uniqueData = [];
     
        newData.forEach((i, j) => {

            let recordPresent = false;
            
            for (let k = 0; k < data.length; k++) {
                if (checkIfRecordExists(data[k], i)) {
                    recordPresent = true;
                    break;
                }
            }

            if (!recordPresent) {
                uniqueData.push(i);
            }
        });

        let combinedData = [...data, ...uniqueData];
        setData(combinedData);
        setListensUploaded(combinedData.length);
        updateStats(uniqueData, combinedData);
    }

    function getArrayItemIndex(array, listen, key) {
        return array.findIndex(e => e[key] == listen[key]);
    }

    function getTrackArrayItemIndex(array, listen, trackKey, artistKey) {
        return array.findIndex(e => (e[trackKey] == listen[trackKey]) && (e[artistKey] == listen[artistKey]));
    }

    function getTopTenArtistsBySingleDayPlays(listeningHistory, measure) {
        const artistsToPlaysMap = new Map();
        
        // Create a map of artists to the maximum number of plays on a single day
        // for (const { artistName, endTime } of listeningHistory) {
        //   const date = new Date(endTime).toISOString().substring(0, 10);

        //   const playsOnDate = artistsToPlaysMap.get(artistName) || new Map();
        //   const plays = playsOnDate.get(date) || 0;
      
        //   playsOnDate.set(date, plays + 1);
        //   artistsToPlaysMap.set(artistName, playsOnDate);
        // }
      
        listeningHistory.forEach((j) => {
            const date = new Date(j.endTime).toISOString().substring(0, 10);

            const playsOnDate = artistsToPlaysMap.get(j[measure]) || new Map();
            const plays = playsOnDate.get(date) || 0;
        
            playsOnDate.set(date, plays + 1);
            artistsToPlaysMap.set(j[measure], playsOnDate);
        });

        // Sort the artists by the maximum number of plays on a single day
        const sortedArtists = Array.from(artistsToPlaysMap.entries()).sort(([artistA, playsOnDateA], [artistB, playsOnDateB]) => {
          const maxPlaysOnSingleDayA = Math.max(...Array.from(playsOnDateA.values()));
          const maxPlaysOnSingleDayB = Math.max(...Array.from(playsOnDateB.values()));
          return maxPlaysOnSingleDayB - maxPlaysOnSingleDayA;
        });

        // Get the top ten artists by the maximum number of plays on a single day
        const topTenArtists = sortedArtists.slice(0, 30).map((artist) => {
            const maxPlays = Math.max(...artist[1].values());
            const maxDate = Array.from(artist[1].entries()).find(([date, plays]) => plays === maxPlays)[0];

            return (
                {
                    artistName: artist[0],
                    maxPlays, maxPlays,
                    date: maxDate
                
                }

            )
        });
      
        return topTenArtists;
    }

    function getHighLevelStatsThisDay(dateData) {
            
        if (dateData.listens.length == 0) {
            dateData.topTrack = {};
            dateData.topTrack.trackAndArtistName = '';

            return dateData
        }

        /// duplication from App here. need to pull these in from one place
        let artistStatsThisDay = [];
        let trackStatsThisDay = [];
        // let listeningTimeThisDay = 0;
        // let uniqueListensThisDay = 0;

        dateData.listens.forEach((i) => {
            let artistArrayIndex = artistStatsThisDay.findIndex(e => e['artistName'] == i['artistName']);

            if (artistArrayIndex === -1) {
                    artistStatsThisDay.push ({
                            artistName: i.artistName,
                            msPlayed: i.msPlayed,
                            uniqueListens: 1
                    });

            } else {
                    artistStatsThisDay[artistArrayIndex].msPlayed += i.msPlayed;
                    artistStatsThisDay[artistArrayIndex].uniqueListens += 1;
            }

            let trackArrayIndex = trackStatsThisDay.findIndex(e => e['trackName'] == i['trackName']);

            if (trackArrayIndex === -1) {
                    trackStatsThisDay.push ({
                            trackName: i.trackName,
                            artistName: i.artistName,
                            msPlayed: i.msPlayed,
                            uniqueListens: 1
                    });

            } else {
                    trackStatsThisDay[trackArrayIndex].msPlayed += i.msPlayed;
                    trackStatsThisDay[trackArrayIndex].uniqueListens += 1;
            }
        });

        const artistStatsThisDaySorted = artistStatsThisDay.sort( (a, b) => {
                return b.msPlayed - a.msPlayed;
        })

        const trackStatsThisDaySorted = trackStatsThisDay.sort( (a, b) => {
                return b.msPlayed - a.msPlayed;
        })

        dateData.artistStatsThisDay = artistStatsThisDaySorted;
        dateData.trackStatsThisDay = trackStatsThisDaySorted;
        dateData.topArtist = artistStatsThisDaySorted[0];
        dateData.topTrack = trackStatsThisDaySorted[0];
        dateData.topTrack.trackAndArtistName = trackStatsThisDaySorted[0].trackName + ' (' + trackStatsThisDaySorted[0].artistName + ')';

        return dateData
    }


    function updateStats(newData, combinedData) {
        let newStats = stats;

        let newTotalListeningTime = newStats.highLevel.totalListeningTimeMs;

        const newDataMaxDate = new Date(max(newData, d => d.endTime));
        const newDataMinDate = new Date(min(newData, d => d.endTime));

        let dateList = []
        let currentDate = newDataMinDate
        let stopDate = newDataMaxDate
        while (currentDate <= stopDate) {
            dateList.push(currentDate);
            let nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
            currentDate = nextDate;
        }

        dateList.forEach((i) => {
            
            let dateOfListen = i.toISOString().substring(0, 10);
            let dateArrayIndex = newStats.time.dates.findIndex(e => e['dateOfListen'] === dateOfListen);
                        
            if (dateArrayIndex === -1) {
                newStats.time.dates.push ({
                    dateOfListen: dateOfListen,
                    msPlayed: 0,
                    hrsPlayed: 0,
                    uniqueListens: 0,
                    listens: [],
                });
            }
        })
        // console.log(newStats.time.dates);

        newData.forEach((i) => {
            newTotalListeningTime += i.msPlayed;

            // Artists
            //////////
            let artistArrayIndex = getArrayItemIndex(newStats.artists, i, 'artistName')
            if (artistArrayIndex === -1) {
                newStats.artists.push ({
                    artistName: i.artistName,
                    msPlayed: i.msPlayed,
                    firstListen: i.endTime,
                    lastListen: i.endTime,
                    uniqueListens: 1
                });
            } else {
                newStats.artists[artistArrayIndex].msPlayed += i.msPlayed;
                newStats.artists[artistArrayIndex].uniqueListens += 1;
                newStats.artists[artistArrayIndex].firstListen = newStats.artists[artistArrayIndex].firstListen < i.endTime ? newStats.artists[artistArrayIndex].firstListen : i.endTime;

                newStats.artists[artistArrayIndex].lastListen = newStats.artists[artistArrayIndex].lastListen > i.endTime ? newStats.artists[artistArrayIndex].lastListen : i.endTime;
            }

            // Dates
            ////////
            let dateOfListen = i.endTime.substring(0, 10);
            let dateArrayIndex = newStats.time.dates.findIndex(e => e['dateOfListen'] === dateOfListen);
                        
            if (dateArrayIndex === -1) {
                newStats.time.dates.push ({
                    dateOfListen: dateOfListen,
                    msPlayed: i.msPlayed,
                    uniqueListens: 1,
                    listens: []
                });
            } else {
                newStats.time.dates[dateArrayIndex].msPlayed += i.msPlayed;
                newStats.time.dates[dateArrayIndex].uniqueListens += 1;
                // newStats.time.dates.listens.push(i);
            }
            
            
            let hourOfListen = i.endTime.substring(11, 13);
            let hourArrayIndex = newStats.time.hours.findIndex(e => e['hourOfListen'] === hourOfListen);
            newStats.time.hours[hourArrayIndex].msPlayed += i.msPlayed;

            // Tracks
            /////////
            /// to do - get indices, return as array
            let trackArrayIndex = getTrackArrayItemIndex(newStats.tracks, i, 'trackName', 'artistName');

            // let trackArrayIndex = getArrayItemIndex(newStats.tracks, i, 'trackName');
            
            if (trackArrayIndex === -1) {
                newStats.tracks.push ({
                    artistName: i.artistName,
                    trackName: i.trackName,
                    msPlayed: i.msPlayed,
                    firstListen: i.endTime,
                    uniqueListens: 1
                });
            } else {
                // to do - if indices.length = 1, update the stats
                // else, check for artist name match and get the array index of the right one first
                // then update stats
                newStats.tracks[trackArrayIndex].msPlayed += i.msPlayed;
                newStats.tracks[trackArrayIndex].uniqueListens += 1;
                newStats.tracks[trackArrayIndex].firstListen = newStats.tracks[trackArrayIndex].firstListen < i.endTime ? newStats.tracks[trackArrayIndex].firstListen : i.endTime;
                
                newStats.tracks[trackArrayIndex].lastListen = newStats.tracks[artistArrayIndex].lastListen > i.endTime ? newStats.tracks[trackArrayIndex].lastListen : i.endTime;
            }


            // Days
            ////////
            let dayOfListen = new Date(i.endTime).getDay();

            newStats.time.days[dayOfListen].msPlayed += i.msPlayed;
            newStats.time.days[dayOfListen].uniqueListens += 1;

        });

        newStats.time.dates.forEach( (j, i) => {
            j.listens = combinedData.filter(
                i => i.endTime.substring(0, 10) == j.dateOfListen
            )
            j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
            j = getHighLevelStatsThisDay(j);
        })

        newStats.time.days.forEach( (j, i) => {
            j.hrsPlayed = convertMsToHoursNumber(j.msPlayed);
        })

        newStats.artists.forEach( (j) => {
            j.hrsPlayed = +(convertMsToHoursNumber(j.msPlayed).toFixed(2));
        })

        newStats.tracks.forEach( (j) => {
            j.hrsPlayed = +(convertMsToHoursNumber(j.msPlayed).toFixed(2));
        })

        newStats.time.hours.forEach( (j) => {
            j.hrsPlayed = +(convertMsToHoursNumber(j.msPlayed).toFixed(2));
        })
        
        newStats.highLevel.totalListeningTimeMs += newTotalListeningTime;
        newStats.highLevel.totalListeningTimeString = convertMsToLargestTimeUnit(newTotalListeningTime);

        newStats.highLevel.uniqueArtists = stats.artists.length;
        newStats.highLevel.uniqueTracks = stats.tracks.length;
        newStats.highLevel.maxDate = new Date(max(combinedData, d => d.endTime));
        newStats.highLevel.minDate = new Date(min(combinedData, d => d.endTime));

        newStats.highLevel.daysInPeriod = (newStats.highLevel.maxDate - newStats.highLevel.minDate);

        newStats.bingedTracks = getTopTenArtistsBySingleDayPlays(combinedData, 'trackName');
        console.log('binged tracks');
        console.log(newStats.bingedArtists);

        newStats.bingedArtists = getTopTenArtistsBySingleDayPlays(combinedData, 'artistName');
        console.log('binged artists');
        console.log(newStats.bingedArtists);

        setStats(newStats);
    }


    return (
        
        <div className="App">

            <Header 
                addData={addData}
            />
            <div className='container'>
                <div className='dashboard'>
                    <Routes>
                        
                        <Route 
                            exact path='/' 
                            exact element={
                                <Home 
                                    data={data} 
                                    stats={props.stats}
                                />
                            } 
                        />

                        <Route 
                            exact path='/time' 
                            exact element={
                                <Time 
                                    data={data} 
                                    listensUploaded={listensUploaded} 
                                    stats={props.stats} 
                                />
                            } 
                        />

                        <Route 
                            exact path='/time/:dateOfListen' 
                            exact element={
                                <DatePage
                                    data={data} 
                                    stats={stats} 
                                    convertMsToHours={convertMsToHours}
                                    convertMsToLargestTimeUnit={convertMsToLargestTimeUnit}
                                />
                            } 
                        />

                        <Route 
                            path='/artists' 
                            element={
                                <Artists 
                                    data={data} 
                                    stats={props.stats}
                                    convertMsToHours={convertMsToHours}
                                    convertMsToLargestTimeUnit={convertMsToLargestTimeUnit}
                                />
                            } 
                        />

                        <Route
                            path="/artist/:artistName"
                            element = {
                                <Artist
                                    data={data}
                                    stats={stats}
                                    convertMsToLargestTimeUnit={convertMsToLargestTimeUnit}
                                />
                            }
                        />

                        <Route 
                            path='/tracks' 
                            element={
                                <Tracks
                                    data={data} 
                                    stats={props.stats}
                                    convertMsToHours={convertMsToHours}
                                    convertMsToLargestTimeUnit={convertMsToLargestTimeUnit}
                                />
                            } 
                        />

                        {/*different artists might have a track of the same name. Probs need to update this to be /track/:artistName/:trackName */}
                        <Route
                            path="/track/:trackName/:artistName"
                                element = {
                                        <Track
                                            data={data}
                                            stats={stats}
                                            convertMsToLargestTimeUnit={convertMsToLargestTimeUnit}
                                        />
                                }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
