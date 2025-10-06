import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = () => !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">International Bank</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {isLoggedIn() ? (
            <>
              {user.role === 'customer' && (
                <Link to="/customer-portal">My Portal</Link>
              )}
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link to="/employee-portal">Staff Portal</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout ({user.username || user.email})
              </button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; 2025 International Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;