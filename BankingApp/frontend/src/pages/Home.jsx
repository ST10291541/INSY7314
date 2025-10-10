import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Check if a user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to International Bank</h1>
        <p>Secure international payments made simple</p>
        
        <div className="cta-buttons">
          {/* Only show buttons if no user is logged in */}
          {!user && (
            <>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
                Open Account
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Our Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>International Payments</h3>
            <p>Send money worldwide with competitive exchange rates</p>
          </div>
          <div className="feature-card">
            <h3>Secure Transactions</h3>
            <p>Bank-level security for all your financial transactions</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Access</h3>
            <p>Manage your payments anytime, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
