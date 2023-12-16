// SignUpForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';

const SignUpForm = () => {
  const navigate = useNavigate();
  const baseUrl = BASE_URL;

  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    id_number: null,
    market: '',
    community: '',
    head_of_family: false,
    country: '',
  });

  const [errorMessages, setErrorMessages] = useState({});

  const handleRegistrationChange = (e) => {
    setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });
  };

  const signUp = async (e) => {
    e.preventDefault();
  
    try {
      const url = new URL('api/register/', baseUrl); // Use new URL constructor
      const response = await axios.post(url.toString(), registrationData);
      navigate('/login');
      // Handle successful sign-up here
    } catch (error) {
      console.error('Error during sign-up:', error);
  
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
  
      setErrorMessages({ generic: 'An error occurred during sign-up. Please try again.' });
    }
  };
  
  

  return (
    <div className='main-container'>
      <div className='' style={{ height: 'auto', backgroundColor: 'transparent', right: 0 }}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-6' style={{}}>
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
<div className='form-group'>
                  <label htmlFor='first_name' className='text-secondary'>
                    First Name
                  </label>
                  <input
                    type='text'
                    className='form-control mb-1'
                    id='first_name'
                    name='first_name'
                    value={registrationData.first_name}
                    onChange={handleRegistrationChange}
                    required
                  />
                  {errorMessages.first_name && (
                    <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.first_name[0]}</p>
                  )}
                </div>
                <div className='form-group'>
                  <label htmlFor='last_name' className='text-secondary'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    className='form-control mb-1'
                    id='last_name'
                    name='last_name'
                    value={registrationData.last_name}
                    onChange={handleRegistrationChange}
                    required
                  />
                  {errorMessages.last_name && (
                    <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.last_name[0]}</p>
                  )}
                </div>

                <div className='form-group'>
                  <label htmlFor='username' className='text-secondary'>
                    Username
                  </label>
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
                    <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.username[0]}</p>
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

              {/* Email input */}
              <div className='form-group'>
                <label htmlFor='id_number' className='text-secondary'>Id Number</label>
                <input
                  type='id_number'
                  className='form-control mb-1'
                  id='id_number'
                  name='id_number'
                  value={registrationData.id_number}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.id_number && (
                  <p style={{color: 'red', fontSize:'12px' }}>{errorMessages.id_number[0]}</p>
                )}
              </div>

              <div className='form-group'>
               <label htmlFor='community' className='text-secondary'>Community</label>
                <input
                  type='text'
                  className='form-control mb-1'
                  id='community'
                  name='community'
                  value={registrationData.community}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.community && (
                  <p style={{ color: 'red', fontSize:'12px' }}>{errorMessages.community[0]}</p>
                )}
              </div>

              <div className='form-group'>
               <label htmlFor='market' className='text-secondary'>Market</label>
                <input
                  type='text'
                  className='form-control mb-1'
                  id='market'
                  name='market'
                  value={registrationData.market}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.market && (
                  <p style={{ color: 'red', fontSize:'12px' }}>{errorMessages.market[0]}</p>
                )}
              </div>

              <div className='form-group'>
               <label htmlFor='head_of_family' className='text-secondary'>Head of Family</label>
                <input
                  type='text'
                  className='form-control mb-1'
                  id='head_of_family'
                  name='head_of_family'
                  value={registrationData.head_of_family}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.head_of_family && (
                  <p style={{ color: 'red', fontSize:'12px' }}>{errorMessages.head_of_family[0]}</p>
                )}
              </div>

              {/* Password input */}
              <div className='form-group'>
               <label htmlFor='country' className='text-secondary'>Country</label>
                <input
                  type='country'
                  className='form-control mb-1'
                  id='country'
                  name='country'
                  value={registrationData.country}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.country && (
                  <p style={{ color: 'red', fontSize:'12px'  }}>{errorMessages.country[0]}</p>
                )}
              </div>

              {/* Confirm Password input */}
              <div className='form-group'>
                <label htmlFor='password' className='text-secondary'>Password</label>
                <input
                  type='password'
                  className='form-control mb-1'
                  id='password'
                  name='password'
                  value={registrationData.password}
                  onChange={handleRegistrationChange}
                  required
                />
                {errorMessages.password && (
                  <p style={{ color: 'red', fontSize:'12px'  }}>{errorMessages.password[0]}</p>
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
