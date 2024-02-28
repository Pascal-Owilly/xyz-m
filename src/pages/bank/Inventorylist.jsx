// Breader.js
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';


// timestamp
import { formatDistanceToNow } from 'date-fns';
import { parseISO } from 'date-fns';


const Breader = () => {
  const baseUrl = BASE_URL;
  const [breaderData, setBreaderData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed
  const accessToken = Cookies.get('accessToken');
  const [user, setUser] = useState(null); // Initialize with null or an empty object
  const [profile, setProfile] = useState([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = breaderData && breaderData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(breaderData?.length / itemsPerPage);

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
        console.log('breeder trade data', userProfile.user.community)

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
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/sellers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setBreaderData(Array.isArray(data) ? data : []);
        console.log('breeder data', breaderData)
        console.log('breeder data', response.data)

      } catch (error) {
        console.error('Error fetching data:', error);
        setBreaderData([]); // Set an empty array in case of an error
      }
    };

    fetchData();
}, [accessToken]);



  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatTimestamp = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="main-container" style={{minHeight:'80vh'}}>

{(!currentItems || currentItems.length === 0) ? (
    <div className="text-center mt-5">
      <HiExclamation size={40} color='#ccc' />
      <p className="mt-3">Hello, you dont have any products yet !</p>
    </div>
  ) : (
    <>
      {breaderData && (
        <div>
          <h5 className='mb-4 text-secondary'>List of supplied products </h5>
          <div className="table-responsive" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', color: '#666666' }}>
  <table className="table table-bordered">
    <thead>
      <tr>
        <th scope="col">Breed</th>
        <th scope="col">Trader</th>
        <th scope="col">Market</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      {currentItems && currentItems.map((breader) => (
        <tr key={breader.id}>
          <td>
            <Link
              to={`/breader-info/${breader.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {breader.breed}
            </Link>
          </td>
          <td>{breader.breeder_first_name} {breader.breeder_last_name} <br /> <strong>Supplied</strong> {formatTimestamp(breader.created_at)}</td>
          <td>{breader.breeder_market}</td>
          <td>
          <Link
              to={`/breader-info/${breader.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
            <span className='p-2' style={{ backgroundColor: breader.isPaid ? 'green' : '#001b40', color: 'white', padding: '5px', borderRadius: '30px', fontSize: '11px', fontWeight: '800' }}>
              View details
            </span>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<hr />

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className='bg-light text-primary mx-1'
                  key={page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )}
</div>

  );
};

export default Breader;
