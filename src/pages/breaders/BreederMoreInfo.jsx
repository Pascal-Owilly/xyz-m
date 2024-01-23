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


  
  return (
    <div className='main-container'>
        <h4>Breeds supplied on {breaderData.transaction_date}</h4>
      <div className='container-fluid mt-3' style={{ minHeight: '72vh' }}>

     
        <div className="table-responsive p-3" style={{background:'white'}}>
          <table className="table table-striped">
          <thead className="thead-primary">
                    <tr>
                      <th className='text-secondary'>Bread Name</th>
                      <th className='text-secondary'>Number Supplied</th>
                      <th className='text-secondary'>Bread Weight</th>
                      <th className='text-secondary'>Price</th>
                      <th className='text-secondary'>Phone Number</th>
                      <th className='text-secondary'>Market</th>
                      <th className='text-secondary'>Community</th>
                      <th className='text-secondary'>Vaccinated</th>
                      <th className='text-secondary'>Head of Family</th>
                    </tr>
                  </thead>
                  <tbody style={{ background: 'white' }}>
                    <tr>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breed}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breeds_supplied}</td>
                      <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.goat_weight} Kg</td>
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
