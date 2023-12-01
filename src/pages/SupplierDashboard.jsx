import React, { useState, useEffect } from 'react';
import { FaBell, FaBox, FaExclamation, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';
const Supplier = () => {
  const Greetings = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting;
  
    if (currentHour < 5) {
      greeting = 'Good night';
    } else if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
  
    return greeting;
  };  
    
      const baseUrl = BASE_URL;
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
                <h2 className='text-center mb-1'>Supplier Dashboard</h2>
<br /><br /><br />
                <div>
                    {/* Flash message */}
                    <div style={{ marginBottom: '40px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <p className='text-center'>
              {`${Greetings()}, `}
              <span style={{ textTransform: 'capitalize' }}>{user.username}!</span>
            </p>
          </div>

                    {/* Notifications */}
                    <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <FaBell size={20} color='white' />
                    </div>

                    {/* Goat supplies status */}
                    {/* Supply to XYZ Abattoir Button */}
                    <a href='/invoices'>
                      <button className='mx-1 bg-dark text-white' style={{ /* your button styles */ }}>
                        <FaBox className='mr-2' /> Supply to XYZ Abbattoir
                      </button>
                    </a>
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '25%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <FaBox className='mr-2' /> Goat supplies status
                    </button>

                    {/* Track Payments */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '25%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <FaMoneyBillWave className='mr-2' /> Track Payments
                    </button>

                    {/* Pending actions alerts */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <FaExclamation className='mr-2' /> Pending actions alerts
                    </button>

                    {/* Manage Supplies for supplied goats */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <FaBox className='mr-2' /> Manage Supplies for supplied goats.
                    </button>

                    {/* Overview of payment status */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', marginBottom: '10px', padding: '15px', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <FaChartLine className='mr-2' /> Overview of payment status
                    </button>
                </div>
            </div>
        </>
    );
}

export default Supplier;
