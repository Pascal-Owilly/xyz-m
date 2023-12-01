import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';

const SignUpForm = () => {
  const navigate = useNavigate();
  const baseUrl = BASE_URL;

  const [registrationData, setRegistrationData] = useState({
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  const [errorMessages, setErrorMessages] = useState({});

  const handleRegistrationChange = (e) => {
    setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });
  };

  const signUp = async (e) => {
    e.preventDefault();

    if (registrationData.password1 !== registrationData.password2) {
      setErrorMessages({ passwords: "Passwords don't match" });
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/authentication/register/`, registrationData);
      navigate('/login');
      // Handle successful sign-up here
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        setErrorMessages(errorData);
      } else {
        // Handle other types of errors (network, server, etc.)
        console.error('Error during sign-up:', error);
      }
    }
  };

  return (
    <div className='main-container'>

    <div className='' style={{ height: 'auto', backgroundColor: 'transparent',right:0 }}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-6' style={{ }}>
            <form
              className='card p-3 m-1 '
              style={{  
                width: '100%',
                borderRadius: '0',
                margin: 'auto',
                transition: 'top 0.3s ease-in-out',
                boxShadow: '0px 24px 36px -19px rgba(0, 0, 0, 0.09)'
                 }}              onSubmit={signUp}
            >
              <h4 className='text-secondary'>Sign Up</h4>
<hr />
              {/* Username input */}
              <div className='form-group'>
               <label htmlFor='username' className='text-secondary'>Username</label>
                <input
                  type='text'
                  className='form-control mb-1'
                  id='username'
                  name='username'
                  value={registrationData.username}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.username && (
                  <p style={{ color: 'red', fontSize:'12px' }}>{errorMessages.username[0]}</p>
                )}
              </div>

              {/* Email input */}
              <div className='form-group'>
                <label htmlFor='email' className='text-secondary'>Email</label>
                <input
                  type='email'
                  className='form-control mb-1'
                  id='email'
                  name='email'
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.email && (
                  <p style={{color: 'red', fontSize:'12px' }}>{errorMessages.email[0]}</p>
                )}
              </div>

              {/* Password input */}
              <div className='form-group'>
               <label htmlFor='password1' className='text-secondary'>Password</label>
                <input
                  type='password'
                  className='form-control mb-1'
                  id='password1'
                  name='password1'
                  value={registrationData.password1}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.password1 && (
                  <p style={{ color: 'red', fontSize:'12px'  }}>{errorMessages.password1[0]}</p>
                )}
              </div>

              {/* Confirm Password input */}
              <div className='form-group'>
                <label htmlFor='password2' className='text-secondary'>Confirm Password</label>
                <input
                  type='password'
                  className='form-control mb-1'
                  id='password2'
                  name='password2'
                  value={registrationData.password2}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.password2 && (
                  <p style={{ color: 'red', fontSize:'12px'  }}>{errorMessages.password2[0]}</p>
                )}
                {errorMessages.passwords && (
                  <p style={{ color: 'red', fontSize:'12px' }}>{errorMessages.passwords}</p>
                )}
              </div>

              <button
                type='submit'
                className='btn btn-sm btn-outline-secondary text-primary mt-1'
                style={{ background: '#fff' }}
              >
                Sign Up
              </button>

              <hr />
              <p>
                Already have an account? <Link to='/login'>Login</Link>
              </p>
            </form>
            </div>
          </div>
          <div className='col-md-4'></div>
        </div>
      </div>
   </div>
  );
};

export default SignUpForm;