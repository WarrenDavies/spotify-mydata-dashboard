import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter}
    from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './dashboards/Home/Home'
import Time from './dashboards/Time/Time'


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
    updateStats(combinedData);
  }

  function updateStats(data) {
    let newStats = stats;

    let newTotalListeningTime = 0
    data.forEach((i) => {
      newTotalListeningTime += i.msPlayed;
    });   
    
    newStats.highLevel.totalListeningTime = newTotalListeningTime;

    setStats(newStats)
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
            <Route path='/time' element={<Time data={data} listensUploaded={listensUploaded} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
