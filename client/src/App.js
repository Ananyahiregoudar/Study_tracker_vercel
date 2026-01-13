import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import RecordManagement from './components/RecordManagement';
import StudyTimetable from './components/StudyTimetable';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check for "timer up" simulation
    // In a real app, this could be a background service or a socket event
    const checkTimers = setInterval(() => {
      // Simulate a notification every 5 minutes for demonstration
      // If we had a specific timer active, we'd check it here
    }, 60000);

    return () => clearInterval(checkTimers);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleRecordAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Study record added!');

    // Simulate study time notification after 5 seconds for demonstration
    toast.info('Study session started! We will notify you when it\'s over.', { autoClose: 3000 });
    setTimeout(() => {
      toast.warn('⏰ Time is up! Take a break.', {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Try browser notification if permitted
      if (Notification.permission === "granted") {
        new Notification("StudyTracker: Time's up!", { body: "Your study session is over. Take a break!" });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }, 5000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <ToastContainer theme="dark" />

        <main className="App-main">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

            <Route path="/" element={
              user ? (
                <div className="home-view">
                  <Dashboard key={refreshTrigger} />
                </div>
              ) : <Navigate to="/login" />
            } />

            <Route path="/records" element={
              user ? (
                <RecordManagement onRecordAdded={handleRecordAdded} refreshTrigger={refreshTrigger} />
              ) : <Navigate to="/login" />
            } />

            <Route path="/timetable" element={
              user ? (
                <div className="timetable-view">
                  <StudyTimetable />
                </div>
              ) : <Navigate to="/login" />
            } />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>Study Management System &copy; 2026</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
