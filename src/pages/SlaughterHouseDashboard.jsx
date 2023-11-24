import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiCurrencyDollar } from 'react-icons/hi';
import Cookies from 'js-cookie';
import axios from 'axios';

const Home = () => {
  const Greetings = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting;

    if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return greeting;
  };

  const baseUrl = 'http://127.0.0.1:8000';
  const [profile, setProfile] = useState([]);
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      // Do something with the token if needed
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/authentication/user/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <>
      <div className='main-container'>
        <h2 className='text-center'> Slaughterhouse Dashboard</h2>

        <div>
          {/* Flash message */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <p className='text-center'>
              {`${Greetings()}, `}
              <span style={{ textTransform: 'capitalize' }}>{user.username}!</span>
            </p>
          </div>

          {/* Notifications */}
          <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <HiBell size={20} color='white' />
          </div>

          {/* Status for received goat supplies */}
          <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <HiCube className='mr-2' /> Manage goats slaughtered and processed
          </button>

          {/* Alerts for pending actions in the abattoir */}
          <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <HiCurrencyDollar className='mr-2' /> Carcass Tracking
            weighing and segregating export/non-export parts
          </button>

        </div>
      </div>
    </>
  );
};

export default Home;
