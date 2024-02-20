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
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: null,
    id_number: null,
    market: '',
    community: '',
    head_of_family: '',
    county: '',
    country: '',
    address: '',
    role: 'collateral_manager',

    user_type: 'collateral_manager', // Add user_type field
  });

  const [loading, setLoading] = useState(false);

  const [errorMessages, setErrorMessages] = useState({});

  const handleRegistrationChange = (e) => {
    setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });
  };

  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setErrorMessages({});

      // Set the role for the user
      const role = 'collateral_manager';

      // Add the role and user_type to the registration data
      const requestData = {
        ...registrationData,
        role: role,
      };

      // Make the API call to register the user
      const response = await axios.post(`${baseUrl}/api/register/`, requestData);
      const userId = response.data.user.id; // Obtain user ID from response
      // Create the buyer instance and assign the buyer role
      // await axios.post(`${baseUrl}/api/buyers/`, { user_id: userId });

      navigate('/buyer-register-success');
    } catch (error) {
      console.error('Error during sign-up:', error);
      setLoading(false);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        const serverErrors = error.response.data;

        if (serverErrors) {
          setErrorMessages(serverErrors);
        } else {
          setErrorMessages({ generic: 'An error occurred during sign-up. Please try again.' });
        }
      }
    }
  };

  return (
    <div className='main-container'>
      <div className='' style={{ height: 'auto', backgroundColor: 'transparent', right: 0 }}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-1'></div>
            <div className='col-md-10' style={{}}>
              <form
                className='card p-3 m-1'
                style={{
                  width: '100%',
                  borderRadius: '0',
                  margin: 'auto',
                  transition: 'top 0.3s ease-in-out',
                  boxShadow: '0px 24px 36px -19px rgba(0, 0, 0, 0.09)',
                }}
                onSubmit={signUp}
              >
                <h4 className='text-secondary'>Register Collateral Mnager</h4>
                <hr />
                <div className='form-row'>
                  <div className='form-group col-md-4'>
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
                  <div className='form-group col-md-4'>
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
                  <div className='form-group col-md-4'>
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
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.username}</p>
                    )}
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-4'>
                    <label htmlFor='email' className='text-secondary'>
                      Email
                    </label>
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
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.email}</p>
                    )}
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='country' className='text-secondary'>
                      County
                    </label>
                    <input
                      type='text'
                      className='form-control mb-1'
                      id='county'
                      name='county'
                      value={registrationData.county}
                      onChange={handleRegistrationChange}
                      required
                    />
                    {errorMessages.country && (
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.county}</p>
                    )}
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='address' className='text-secondary'>
                      Address
                    </label>
                    <input
                      type='address'
                      className='form-control mb-1'
                      id='address'
                      name='address'
                      value={registrationData.address}
                      onChange={handleRegistrationChange}
                      required
                    />
                    {errorMessages.address && (
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.address}</p>
                    )}
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='password' className='text-secondary'>
                      Password
                    </label>
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
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.password[0]}</p>
                    )}
                    {errorMessages.passwords && (
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.passwords}</p>
                    )}
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='password' className='text-secondary'>
                      Confirm Password
                    </label>
                    <input
                      type='password'
                      className='form-control mb-1'
                      id='confirm_password'
                      name='confirm_password'
                      value={registrationData.confirm_password}
                      onChange={handleRegistrationChange}
                      required
                    />
                    {errorMessages.confirm_password && (
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.confirm_password[0]}</p>
                    )}
                    {errorMessages.confirm_password && (
                      <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.confirm_password}</p>
                    )}
                  </div>
                </div>
                <button
                  type='submit'
                  className='btn btn-sm btn-outline-secondary text-primary mt-1'
                  style={{ background: '#fff' }}
                  disabled={loading} // Disable the button when loading
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <hr />
                <p>
                  Already have an account? <Link to='/login'>Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
