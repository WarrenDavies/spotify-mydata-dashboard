import './App.scss';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  return (
    <div className="App">
      <Header />
      <div className='container'>
        <Sidebar />
        <div className='dashboard'>
          
        </div>
      </div>
    </div>
  );
}

export default App;
