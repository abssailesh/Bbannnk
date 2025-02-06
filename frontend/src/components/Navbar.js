import React from 'react';
import { Link } from 'react-router-dom'; 
import { logout } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout: authLogout } = useAuth(); // ✅ Get `logout` from useAuth

  const handleLogout = () => {
    logout(); // Clears token
    authLogout(); // Updates state
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Brillian Bank</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
