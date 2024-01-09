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
      setLoading(true); // Set loading to true when initiating payment

      // Replace 'your-api-endpoint' with the actual API endpoint for payment initiation
      // const response = await axios.get(`${baseUrl}/api/abattoir-payments-to-breeder/${breaderData.id}/`, {

      const response = await axios.post(`${baseUrl}/api/abattoir-payments-to-breeder/${breaderData.id}/process_payment_and_notify_breeder/`, {
      });

      if (response.status === 200) {
        // Payment successful
        console.log('Payment successful');
        navigate('/breeder-payment')

        // You can perform any additional actions here
      } else {
        // Payment failed
        alert('Payment failed');
        // You can display an error message or perform any other actions
      }

    } catch (error) {
      console.error('Error initiating payment:', error.response.statusText);
      alert('You need to stage payment for this breeder before initiating payment ')
    } finally {
      setLoading(false); // Set loading back to false after payment attempt
    }
  };

  return (
    <div className='main-container'>
      <div className='container-fluid' style={{ minHeight: '72vh' }}>
        <button
          className='mb-2'
          style={{ backgroundColor: 'goldenrod', borderRadius: '30px', fontSize: '14px' }}
          onClick={handleMakePayment}
          disabled={breaderData.is_paid || loading} // Disable the button if is_paid or loading is true
        >
          {loading ? 'Initiating Payment...' : `Make Payment to ${breaderData.breeder_head_of_family}'s family`}
        </button>
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
