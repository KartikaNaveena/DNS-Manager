import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import DomainPage from './pages/DomainPage';
import RecordsPage from './pages/RecordPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage/>} />
          <Route
            path="/"
            element={
                <DomainPage />
            }
          />
          <Route path="/records//hostedzone/:zoneId" element={<RecordsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
