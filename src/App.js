import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter}
    from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './dashboards/Home/Home'
import Time from './dashboards/Time/Time'
import Artists from './dashboards/Artists/Artists'


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
    updateStats(uniqueData);
  }

  function getArrayItemIndex(array, listen, key) {
    return array.findIndex(e => e[key] == listen[key]);
  }

  function updateStats(newData) {
    let newStats = stats;

    let newTotalListeningTime = newStats.highLevel.totalListeningTimeMs;

    newData.forEach((i) => {
      newTotalListeningTime += i.msPlayed;

      let artistArrayIndex = getArrayItemIndex(newStats.artists, i, 'artistName')
      if (artistArrayIndex === -1) {
        newStats.artists.push ({
          artistName: i.artistName,
          msPlayed: i.msPlayed
        });
      } else {
        newStats.artists[artistArrayIndex].msPlayed += i.msPlayed;
      }

      let dateOfListen = i.endTime.substring(0, 10);
      let dateArrayIndex = newStats.time.dates.findIndex(e => e['dateOfListen'] === dateOfListen);

      if (dateArrayIndex === -1) {
        newStats.time.dates.push ({
          dateOfListen: dateOfListen,
          msPlayed: i.msPlayed
        });
      } else {
        newStats.time.dates[dateArrayIndex].msPlayed += i.msPlayed;
      }
      

      let hourOfListen = i.endTime.substring(11, 13);
      let hourArrayIndex = newStats.time.hours.findIndex(e => e['hourOfListen'] === hourOfListen);
      newStats.time.hours[hourArrayIndex].msPlayed += i.msPlayed;
    });


    newStats.highLevel.totalListeningTimeMs += newTotalListeningTime;
    newStats.highLevel.totalListeningTimeString = convertMsToLargestTimeUnit(newTotalListeningTime);

    newStats.highLevel.uniqueArtists = stats.artists.length;

    setStats(newStats);
  }



  function convertMsToLargestTimeUnit(millisec) {

    var seconds = (millisec / 1000).toFixed(1);

    var minutes = (millisec / (1000 * 60)).toFixed(1);

    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
  }






  return (
    
    <div className="App">

      <Header 
        addData={addData}
      />
      <div className='container'>
        <Sidebar />
        <div className='dashboard'>
          <Routes>
            <Route exact path='/' exact element={<Home data={data} stats={props.stats} />} />
            <Route path='/time' element={<Time data={data} listensUploaded={listensUploaded} stats={props.stats} />} />
            <Route path='/artists' 
            element={<Artists data={data} stats={props.stats}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
