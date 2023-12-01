import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthService from './AuthService';

function FlashMessage({ message, type }) {
  return (
    <div className={`flash-message ${type}`}>
      <p>{message}</p>
    </div>
  );
}

const LoginTest = () => {
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await AuthService.getCsrfToken();
      console.log('CSRF Token is indeed:', token); // Log the CSRF token
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  

  const login = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    try {
      const authToken = await AuthService.login(loginData, csrfToken);
      setIsLoggedIn(true);
      Cookies.set('authToken', authToken, { expires: 10, sameSite: 'None', secure: false });
  
      // Log the X-CSRFToken header
    const csrfHeader = axios.defaults.headers.common['X-CSRFToken'];
    console.log('X-CSRFToken Header:', csrfHeader);

      // window.location.reload();
  
      setFlashMessage({ message: `Welcome back ${loginData.first_name}!`, type: 'success' });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Login failed with status code:', error.response.status);
        console.error('Error details:', error.response);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. The request was made but no response was received.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
      }

      setFlashMessage({ message: 'Failed to login, please try again', type: 'error' });
    }
  };
  

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }

    if (isLoggedIn) {
      navigate('/supplier_dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await AuthService.login(loginData, csrfToken);
      setIsLoggedIn(true);
      Cookies.set('authToken', token, { expires: 10, sameSite: 'None', secure: false });

      // Log the X-CSRFToken header after successful login
      const csrfHeader = axios.defaults.headers.common['X-CSRFToken'];
      console.log('X-CSRFToken Header after login:', csrfHeader);

      setFlashMessage({ message: `Welcome back ${loginData.first_name}!`, type: 'success' });
    } catch (error) {
      // ... (existing error handling code remains unchanged)
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className='main-container'>
      <div className='' style={{ height: 'auto', backgroundColor: 'transparent', right: 0 }}>
        <div className='row m-auto' style={{ height: 'auto', backgroundColor: '', alignItems: 'center', justifyContent: 'center' }}>
          <div className='col-md-2'></div>
          <div className='col-md-6'>
            <form className='what-card-btn-login p-4 mb-3 bg-white' onSubmit={handleLoginSubmit}
              style={{
                width: '100%',
                borderRadius: '0',
                margin: 'auto',
                transition: 'top 0.3s ease-in-out',
                boxShadow: '0px 24px 36px -19px rgba(0, 0, 0, 0.09)'
              }}>
              <h3 className='text-secondary'>Login</h3>
              <hr style={{ color: '#d9d9d9' }} />
              <div className="form-group" style={{ color: '#d9d9d9', fontSize: '18px' }}>
                <label className="mt-1 text-secondary" htmlFor="email">Email</label>
                <input
                  type="text"
                  style={{ background: '#d9d9d9' }}
                  className="form-control"
                  id="email"
                  name="email"
                  value={loginData.email}
                  placeholder="Enter Email"
                  onChange={handleLoginChange}
                />
              </div>

              <div className="form-group" style={{ color: '#d9d9d9', fontSize: '18px' }}>
                <label className="mt-1 text-secondary" htmlFor="password">Password</label>
                <input
                  type="password"
                  style={{ background: '#d9d9d9' }}
                  placeholder="Enter password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                {errorMessages.invalidCredentials && (
                  <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.invalidCredentials}</p>
                )}
              </div>

              <button
                type='submit'
                className='btn btn-sm btn-outline-primary text-secondary mt-1'
                style={{ background: '#fff', width: '100%' }}
              >
                Login
              </button>
              <hr />
              <p className='mb-2 text-secondary'>
                Don't have an account? <Link to='/register'>Signup</Link>
              </p>
              <p className='mb-2 text-secondary'>
                <Link to='/password_reset'>Forgot your password?</Link>
              </p>
            </form>
          </div>
          <div className='col-md-4'></div>
        </div>
        <>
          {flashMessage && (
            <div className="flash-message text-secondary" style={{ backgroundColor: 'transparent', fontWeight: 'normal' }}>
              {flashMessage.message}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default LoginTest;
