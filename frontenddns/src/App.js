import React from 'react';
import Domains from './components/Domains';
import './App.css';

function App() {
  return (
   
    <div className="App">
       console.log('Fetched domains:');
      <Domains />
    </div>
  );
}

export default App;
