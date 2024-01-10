import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from './AuthService';
import { checkUserRole } from './CheckUserRoleUtils';

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
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = await AuthService.login(loginData);
      setIsLoggedIn(true);
      Cookies.set('accessToken', accessToken, { expires: 10, sameSite: 'None', secure: true });

      const role = await checkUserRole();

      switch (role) {
        // ... (switch cases)

        default:
          navigate('/');
      }

      setFlashMessage({ message: `Welcome back ${loginData.username}!`, type: 'success' });
    } catch (error) {
      console.error('Login error:', error);
      setFlashMessage({ message: 'Invalid credentials. Try again.', type: 'error' });
    } finally {
      setLoading(false);
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
    const storedToken = Cookies.get('accessToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }

    if (isLoggedIn) {
      console.log('login success');
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = async (event) => {
    try {
      event.preventDefault();

      const accessToken = await AuthService.login(loginData);
      setIsLoggedIn(true);

      const role = await checkUserRole();

      switch (role) {
        case 'superuser':
          navigate('/admin_dashboard');
          break;
        case 'admin':
          navigate('/admin_dashboard');
          break;
        case 'Breeder':
          navigate('/supplier_dashboard');
          break;
        case 'buyer':
          navigate('/buyer_dashboard');
          break;
        case 'warehouse personnel':
          navigate('/warehouse');
          break;
        case 'inventory manager':
          navigate('/inventory');
          break;
        case 'Slaughterhouse Manager':
          navigate('/inventory');
          break;
        default:
          navigate('/');
      }

      window.location.reload();
      setFlashMessage({ message: `Welcome back ${loginData.username}!`, type: 'success' });
    } catch (error) {
      console.error('Login error:', error);
      setFlashMessage({ message: 'Invalid credentials. Try again.', type: 'error' });
      setLoading(false);

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
            <form
              className='what-card-btn-login p-4 mb-3 bg-white'
              onSubmit={handleLoginSubmit}
              style={{
                width: '100%',
                borderRadius: '0',
                margin: 'auto',
                transition: 'top 0.3s ease-in-out',
                boxShadow: '0px 24px 36px -19px rgba(0, 0, 0, 0.09)',
              }}
            >
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
                  <p style={{ color: 'red', fontSize: '12px' }}>{errorMessages.invalidCredentials}</p>
                )}
              </div>

              <button
                type='submit'
                className='btn btn-sm btn-outline-secondary text-primary mt-1'
                style={{ background: '#fff' }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <hr />
              {flashMessage && (
                <div className="flash-message text-danger" style={{ backgroundColor: 'transparent', fontWeight: 'normal' }}>
                  {flashMessage.message}
                  <hr />
                </div>
              )}

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
      </div>
    </div>
  );
};

export default LoginTest;
