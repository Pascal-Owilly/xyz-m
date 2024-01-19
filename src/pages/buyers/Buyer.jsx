import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyerDash = () => {
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
  const navigate = useNavigate()
  const [profile, setProfile] = useState([]);
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState({});
  const [buyerInvoices, setBuyerInvoices] = useState([]);
  const accessToken = Cookies.get('accessToken');

  const refreshAccessToken = async () => {
    try {
      console.log('Fetching token refresh...');
  
      const refreshToken = Cookies.get('refreshToken'); // Replace with your actual cookie name
  
      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
  
      const newAccessToken = response.data.access;
      // Update the stored access token
      Cookies.set('accessToken', newAccessToken);
      // Optional: You can also update the user data using the new access token
      await fetchUserData(newAccessToken);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle the error, e.g., redirect to the login page
    }
  };
  
  const fetchUserData = async (accessToken) => {
    try {
      // if (!accessToken) {
      //   navigate('/buyer');
      //   return;
      // }
  
      const response = await axios.get(`${baseUrl}/auth/buyers/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userProfile = response.data;
      setProfile(userProfile);
      console.log(userProfile)
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData(authToken);

        // If user data is available, extract the user ID and check if they are a buyer
        if (profile.id) {
          const response = await axios.get(`${baseUrl}/auth/user/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = response.data;
          console.log('user date', userData)
          if (userData.is_buyer) {
            // If the user is a buyer, fetch and set buyer invoices
            const buyerInvoicesResponse = await axios.get(`${baseUrl}/api/buyers/${userData.id}/invoices/`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            setBuyerInvoices(buyerInvoicesResponse.data);
            console.log(buyerInvoicesResponse.data)
          } else {
            // If the user is not a buyer, you can handle it here (e.g., display a message)
            console.log('User is not a buyer');
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, [authToken, baseUrl, profile.id, accessToken]);

  return (
    <>
      <div className='main-container' style={{minHeight:'85vh'}}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <h5 className='mx-2'>Buyer Dashboard</h5>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              
              <li className="nav-item">
                <Link className="nav-link" to="/">Letter of credit</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/invoice_tracking">Invoice tracking</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Banking transactions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Paid off deals</Link>
              </li>
            </ul>
          </div>
        </nav>


        <div>
          

         
        </div>
      </div>
    </>
  );
}

export default BuyerDash;
