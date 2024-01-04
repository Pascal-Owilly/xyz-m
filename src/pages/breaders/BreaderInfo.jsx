import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../auth/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Breader.css';
import { Modal } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BreaderInfo = () => {

const navigate = useNavigate()
const baseUrl = BASE_URL;
const { breaderId } = useParams();
const [breaderData, setBreaderData] = useState({});
const [loading, setLoading] = useState(true);
const accessToken = Cookies.get('accessToken');
const [isModalOpen, setIsModalOpen] = useState(false);
const [user, setUser] = useState(null); // Initialize with null or an empty object
const [profile, setProfile] = useState([]);


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
    setUser(userProfile.user); 

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

useEffect(() => {
  if (accessToken && baseUrl) {
    fetchUserData();
  }
}, [accessToken, baseUrl]);


const openModal = () => {
  setIsModalOpen(true);
};



useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/auth/user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, [accessToken]);


const handlePaypalPayment = () => {
  // Implement PayPal payment logic
};

const handleEquityPayment = () => {
  // Implement Equity Bank payment logic
};

const handleCooperativePayment = () => {
  // Implement Cooperative Bank payment logic
};

const handleKCBPayment = () => {
  // Implement KCB Bank payment logic
};

const handleIMPayment = () => {
  // Implement I & M Bank payment logic
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
        console.log('info', response.data.breeder_market)
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


  return (
    <div className='main-container'>
      <div className='container-fluid' style={{minHeight:'72vh'}}>
        <div className='row mt-2'>
          <div className="col-md-12">
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h2>Payment status &nbsp;
                <span className='' style={{float: 'right', backgroundColor: breaderData.isPaid ? 'green' : 'blue', color:'white', padding:'5px', borderRadius:'30px', fontSize:'11px', fontWeight:'800', width:'auto' }}>
                 <span className='mx-2'>
                 {breaderData.is_paid ? 'Paid': 'Pending'}
                 </span>
                 </span>
                 </h2>
                 <button
  className='mb-2'
  style={{ backgroundColor: 'goldenrod', borderRadius: '30px', fontSize:'14px' }}
  onClick={() => {
    if (breaderData && breaderData.breeder_head_of_family) {
      navigate('/breeder-payment', { state: { breaderData } });
    } else {
      // Handle the case where breaderData or breeder_head_of_family is null
      console.error('Error: breaderData or breeder_head_of_family is null');
    }
  }}
>
  Make Payment to {breaderData.breeder_head_of_family}'s family
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default BreaderInfo;
