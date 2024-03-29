import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, BrowserRouter}
    from 'react-router-dom';

const DATA = [];
const LISTENS_UPLOADED = 0;

const hoursArray = []
for (let i = 0; i < 24; i++) {
  let hour = i.toString();
  if (hour.length == 1) {
  	hour = '0' + hour;
  }
  let hourObject = {
    "name": i,
    "msPlayed": 0,
    "uniqueListens": 0,
  }
  hourObject['hourOfListen'] = hour;
  hoursArray.push(hourObject);
}

const hourData = []
for (let i = 0; i < 24; i++) {
  hourData.push(
    {
        "hourName": i,
        "msPlayed": 0,
        "uniqueListens": 0,
    }
  );
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayData = [];
for (let i = 0; i < 7; i++) {
    dayData.push(
        {
            "name": dayNames[i],
            "msPlayed": 0,
            "uniqueListens": 0,
        }
    );
}

const monthNames = ["January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December"];
const monthData = [];
for (let i = 0; i < 12; i++) {
  monthData.push(
        {
            "name": monthNames[i],
            "msPlayed": 0,
            "uniqueListens": 0,
        }
    );
} 

const STATS = {
  highLevel: {
    totalListeningTimeMs: 0,
    totalListeningTimeString: 0,
    uniqueArtists: 0
  },
  time: {
    dates: [],
    hours: hoursArray,
    days: dayData,
    months: monthData,
  },
  artists: [],
  tracks: [],
  
};

const CURRENT_PAGE = 'Home';

const PAGES = {
  home: {
    path: '/',
    data: {
      listensProcessed: 0,
      totalListeningTime: 0
    }
  },
  time: {
    path: '/',
    data: {
      listensProcessed: 0,
      totalTimePerDate: {},
      totalTimePerDayOfWeek: {},
      totalTimePerHourOfDay: [],
    }
  },
  artists: {
    path: '/artists',
    data: {
      listensProcessed: 0,
      totalTimePerDate: {},
      totalTimePerDayOfWeek: {},
      totalTimePerHourOfDay: [],
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App 
        data={DATA}
        pages={PAGES}
        stats={STATS}
        current_page={CURRENT_PAGE}
        listensUploaded={LISTENS_UPLOADED}
      />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
