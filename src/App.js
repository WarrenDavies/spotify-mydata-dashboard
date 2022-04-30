import React, { useState, useEffect } from 'react';
import './App.scss';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'

function App() {

  const [data, setData] = useState([]);

  function addData(newData) {
    setData([...data, newData]);

    console.log(data);
  }

  return (
    <div className="App">
      <Header 
        addData={addData}
      />
      <div className='container'>
        <Sidebar />
        <div className='dashboard'>
          data: {JSON.stringify(data, null, 2)}
        </div>
      </div>
    </div>
  );
}

export default App;
