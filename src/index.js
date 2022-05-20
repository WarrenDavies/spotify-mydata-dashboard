import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, BrowserRouter}
    from 'react-router-dom';

const DATA = [];
const LISTENS_UPLOADED = 0;

const STATS = {
  highLevel: {
    totalListeningTimeMs: 0,
    totalListeningTimeString: 0,
    uniqueArtists: 0
  },
  artists: [],
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
