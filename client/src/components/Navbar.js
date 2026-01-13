import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">🎓 StudyTracker</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/records">Records</Link>
                        <Link to="/timetable">Timetable</Link>
                        <span className="user-info">Hi, {user.username}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
