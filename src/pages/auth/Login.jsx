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
  const [flashMessage, setFlashMessage] = useState(null); // Initialize with null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const login = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const authToken = await authService.login(loginData);
      setIsLoggedIn(true);
      Cookies.set('authToken', authToken, { expires: 10, sameSite: 'None', secure: true });

      window.location.reload();

      // Reload the page after successful login
      setFlashMessage({ message: `Welcome back ${loginData.username} !`, type: 'success' });


    } catch (error) {
      // Handle login error
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        setErrorMessages({ invalidCredentials: "Invalid username or password" });
      } else {
        console.error('Login failed:', error);
        setFlashMessage({ message: "That didn't go well!", type: 'error' });

      }
    }
  };

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null); // Remove the flash message after 2 seconds
      }, 3000); 
  
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }

    // Redirect to another page if the user is already logged in
    if (isLoggedIn) {
      navigate('/'); // Replace '/dashboard' with your desired route
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    login();
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className='container-fluid' style={{ backgroundColor: '#fff' }}>
      <div className='row' style={{ height: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className='col-md-4'></div>
        <div className='col-md-4'>
          <form className='what-card-btn-login p-4' onSubmit={handleLoginSubmit}
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
              <label className="mt-1 text-secondary" htmlFor="username">Username</label>
              <input
                type="text"
                style={{ background: '#d9d9d9' }}
                className="form-control"
                id="username"
                name="username"
                value={loginData.username}
                placeholder="Enter username"
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
                <p style={{ color: 'red', fontSize:'12px'}}>{errorMessages.invalidCredentials}</p>
              )}
            </div>

            <button
                type='submit'
                className='btn btn-sm btn-outline-primary text-secondary mt-1'
                style={{ background: '#fff', width:'100%' }}
              >
              Login
            </button>
            <hr />
            <p className='mb-2 text-secondary'>
              Don't have an account? <Link to='/signup'>Signup</Link>
            </p>
            <p className='mb-2 text-secondary'>
              <Link to='/forgot-password'>Forgot your password?</Link>
            </p>
          </form>
        </div>
          <div className='col-md-4'></div>
        </div>
        <>
  {flashMessage && (
    <div className="flash-message text-secondary" style={{backgroundColor:'transparent',  fontWeight:'normal'}}>
      {flashMessage.message}
    </div>
  )}
  </>
    </div>

  );
};

export default LoginTest;