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
    

    setData([...data, ...uniqueData]);
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
            <Route exact path='/' exact element={<Home data={data} />} />
            <Route path='/time' element={<Time data={data} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
