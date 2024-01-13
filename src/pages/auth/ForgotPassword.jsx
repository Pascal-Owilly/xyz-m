// ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from './AuthService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.requestPasswordReset(email);
      setMessage(response.detail); // Assuming the message key in the response

    } catch (error) {
      setMessage(error.response.data.detail); // Assuming the message key in the response
    }
  };

  return (
    <div style={{ height: '', display: '', alignItems: 'center', justifyContent: 'center', color: '#999999' }}>
      <div className='main-container'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-6 bg-white p-4 mb-3'>
              <h3 className='text-secondary'>Forgot Password</h3>
              <p className='text-secondary'>Enter your email to reset your password.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className='text-secondary'>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <br />
                <button type="submit" className="btn what-card-btn text-secondary" style={{ color: '#999999', boxShadow: '0px 12px 12px -11px rgba(0, 0, 0, 0.1)' }}>
                  Reset Password
                </button>
              </form>

              <span className='text-success' style={{ color: 'blue', fontFamily: 'cursive', fontSize: '16px', fontWeight: '500' }}>
                {message && <p className='text-success'><hr />{message}</p>}
              </span>
              <hr />
              <p className='text-secondary'>
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </div>
            <div className='col-md-4'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
