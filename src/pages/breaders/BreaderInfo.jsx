import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../auth/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Breader.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BreaderInfo = () => {
  const navigate = useNavigate();
  const baseUrl = BASE_URL;
  const { breaderId } = useParams();
  const [breaderData, setBreaderData] = useState({});
  const [loading, setLoading] = useState(false); // Initialize loading state
  const accessToken = Cookies.get('accessToken');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      Cookies.set('accessToken', newAccessToken);
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing access token:', error);
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
        setUser(userProfile.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await refreshAccessToken();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    if (accessToken && baseUrl) {
      fetchUserData();
    }
  }, [accessToken, baseUrl]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/breader-trade/${breaderId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBreaderData(response.data);
        console.log('info', response.data.breeder_market);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (breaderId) {
      fetchData();
    }
  }, [accessToken, breaderId]);

  const handleMakePayment = async () => {
    try {
      setLoading(true);
  
      const response = await axios.post(`${baseUrl}/api/abattoir-payments-to-breeder/${breaderData.id}/process_payment_and_notify_breeder/`, {
        // Additional data if needed
      });
  
      if (response.status === 200) {
        console.log('Payment successful');
        navigate('/breeder-payment');
        // Additional actions for a successful payment
      } else {
        // Payment failed
        alert('Payment failed');
        // Additional actions for a failed payment
      }
  
    } catch (error) {
      console.error('Error initiating payment:', error);
  
      if (error.response) {
        // The request was made, but the server responded with a status code that falls out of the range of 2xx
        alert(`Error: ${error.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('Network error. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('An unexpected error occurred. Please try again later.');
      }
  
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='main-container'>
        <a href = 'https://api.intellima.tech/admin/transaction/abattoirpaymenttobreader/'>
      <button className='btn btn-sm btn-primary' style={{ float: 'right', marginRight: '10px', borderRadius: '5px' }}>Super Admin</button>
      </a>
      <div className='container-fluid' style={{ minHeight: '72vh' }}>

      <hr />
        <div className='buttons'>
        <button
          className='mb-2'
          style={{ backgroundColor: 'goldenrod', borderRadius: '30px', fontSize: '14px' }}
          onClick={handleMakePayment}
          disabled={breaderData.is_paid || loading} // Disable the button if is_paid or loading is true
        >
          {loading ? 'Initiating Payment...' : `Make Payment to ${breaderData.breeder_head_of_family}'s family`}
        </button>
        </div>
     
        <div className="table-responsive">
          <table className="table table-striped">
          <thead className="thead-dark">
                    <tr>
                      <th>Bread Name</th>
                      <th>Number Supplied</th>
                      <th>Bread Weight</th>
                      <th>Date Supplied</th>
                      <th>Price</th>
                      <th>Phone Number</th>
                      <th>Market</th>
                      <th>Community</th>
                      <th>Vaccinated</th>
                      <th>Head of Family</th>
                    </tr>
                  </thead>
                  <tbody style={{ background: 'white' }}>
                    <tr>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breed}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breeds_supplied}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.goat_weight} Kg</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.transaction_date}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.price}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.phone_number}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breeder_community}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breeder_market}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.vaccinated ? 'Yes' : 'No'}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breeder_head_of_family}</td>
                    </tr>
                  </tbody>          </table>
        </div>
      </div>
    </div>
  );
};

export default BreaderInfo;
