// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DomainPage from './pages/DomainPage';
import RecordsPage from './pages/RecordPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Perform authentication logic
    // For example, if authentication is successful, setIsAuthenticated(true)
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Perform logout logic
    // For example, clear authentication token from local storage
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage  />} // Pass onLogin as a prop
          />
          {/* Render DomainPage if user is authenticated, otherwise redirect to login */}
          <Route
            path="/"
            element={
               
                <DomainPage />
             
            }
          />
          {/* Additional routes can be added here */}
          <Route path="/records//hostedzone/:zoneId" element={<RecordsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
