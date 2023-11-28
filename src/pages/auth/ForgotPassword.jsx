import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from './AuthService'; // Import your authService

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.requestPasswordReset(email);

      // Handle the response and show a confirmation message to the user
      setMessage(response.data.detail); // Assuming the message key in the response

    } catch (error) {
      // Handle errors, e.g., if the email is not found or not verified
      setMessage(error.response.data.detail); // Assuming the message key in the response
    }
  };

  return (
    <div style={{ height: '', display: '', alignItems: 'center', justifyContent: 'center',  color:'#999999' }}>
        <div className='main-container'>
      <div className='container'>
        <div className='row'>
        <div className='col-md-2' ></div>

          <div className='col-md-6 bg-white p-4 mb-3' >
            <h3 className='text-secondary'>Forgot Password</h3>
            <p  className='text-secondary'>Enter your email to reset your password.</p>

            <form onSubmit={handleSubmit} >
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
              <button type="submit" onClick={handleSubmit} className="btn what-card-btn text-secondary" style={{color:'#999999',  boxShadow: '0px 12px 12px -11px rgba(0, 0, 0, 0.1)',
}}>
                Reset Password
              </button>
            </form>
            
           <span  style={{color:'#999999', fontFamily:'cursive', fontSize:'18px', fontWeight:'700'}}>  {message && <p><hr />{message}</p>}</span>
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