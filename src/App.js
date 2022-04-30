import React, { useState, useEffect } from 'react';
import './App.scss';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'

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
          data.length: {data.length} <br/><br/>
          data: {JSON.stringify(data)}
        </div>
      </div>
    </div>
  );
}

export default App;
