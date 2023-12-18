import React, { useState, useEffect } from 'react';
import { FaBell, FaBox, FaExclamation, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { useNavigate } from 'react-router-dom';
import SuppliedBreedsSingleUser from './breaders/SuppliedBreedsSingleUser';
import { useSupplies } from '../../src/SuppliesContext';

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
    
      const { setSuppliesData } = useSupplies();

      const baseUrl = BASE_URL;
      const navigate = useNavigate()
      const [profile, setProfile] = useState([]);
      const accessToken = Cookies.get('accessToken');
      const [user, setUser] = useState({});
      const [localSuppliesData, setLocalSuppliesData] = useState(null);

      useEffect(() => {
        const refreshAccessToken = async () => {
          try {
            console.log('fetching token refresh ... ')
      
            const refreshToken = Cookies.get('refreshToken'); // Replace with your actual cookie name
        
            const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
              refresh: refreshToken,
            });
        
            const newAccessToken = response.data.access;
            // Update the stored access token
            Cookies.set('accessToken', newAccessToken);
            // Optional: You can also update the user data using the new access token
            await fetchUserData();
          } catch (error) {
            console.error('Error refreshing access token:', error);
            // Handle the error, e.g., redirect to login page
          }
        };
        
      
        const fetchUserData = async () => {
          try {
            const accessToken = Cookies.get('accessToken');
        
            if (accessToken) {
              const response = await axios.get(`${baseUrl}/auth/user/`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
        
              const userProfile = response.data;
              setProfile(userProfile);
            }
          } catch (error) {
            // Check if the error indicates an expired access token
            if (error.response && error.response.status === 401) {
              // Attempt to refresh the access token
              await refreshAccessToken();
            } else {
              console.error('Error fetching user data:', error);
            }
          }
        };
     
         fetchUserData();
       }, [accessToken]);
     
       const handleBreadSuppliesStatus = async () => {
         try {
           const response = await axios.get(`${baseUrl}/api/breader-trade/${user.pk}`, {
             headers: {
               Authorization: `Bearer ${accessToken}`,
             },
           });
       
           // Use the context function to update global state
           setSuppliesData(response.data);
       
           navigate('/supplied-breeds');
         } catch (error) {
           console.error('Error fetching supplies data:', error);
         }
       };
     
       // Use useEffect to navigate after suppliesData is updated
       useEffect(() => {
         if (localSuppliesData) {
           // Navigate to the supplies page
           navigate('/supplied-breeds');
         }
       }, [localSuppliesData, navigate]);
   

    return (
        <>
            <div className='main-container' style={{minHeight:'85vh'}}>
                <h2 className='text-center mb-4' >Supplier Dashboard</h2>
                <div>
                    {/* Flash message */}
                    <div style={{ marginBottom: '40px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
                      <button className='mx-1 bg-dark text-white mb-3' style={{ /* your button styles */ }}>
                        <FaBox className='mr-2' /> Supply to XYZ Abbattoir
                      </button>
                    </a>
                    <button
            className='mx-1'
            style={{
               backgroundColor: 'white',
               color: '#333',
               textAlign: 'left',
               display: 'inline-block',
               marginBottom: '10px',
               padding: '15px',
               width: '25%',
               borderRadius: '10px',
               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            onClick={handleBreadSuppliesStatus}
         >
            <FaBox className='mr-2' /> Bread supplies status
         </button>

                    {/* Track Payments */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '50%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
            {localSuppliesData && <SuppliedBreedsSingleUser suppliesData={localSuppliesData} />}

        </>
    );
}

export default Supplier;
