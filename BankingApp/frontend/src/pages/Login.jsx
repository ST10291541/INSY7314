import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '', 
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.login || !formData.password) {
      setError('Please enter both login and password');
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/auth/login', {
        // Try email first, then username
        email: formData.login,
        username: formData.login,
        password: formData.password
      });

      // Save token and user data
      localStorage.setItem("token", response.data.token);
      //localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem('user', JSON.stringify({ 
        ...response.data.user, 
        token: response.data.token 
      }));
      
      // Redirect based on role
      if (response.data.user.role === 'employee' || response.data.user.role === 'admin') {
        navigate('/employee-portal');
      } else {
        navigate('/customer-portal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Bank Portal Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Email or Username *</label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="login-info">
          <p><strong>Customer:</strong> Use your username or email</p>
          <p><strong>Employee:</strong> Use your email address</p>
        </div>
      </div>
    </div>
  );
};

export default Login;