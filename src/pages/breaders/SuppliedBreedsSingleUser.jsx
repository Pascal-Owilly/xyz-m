// Breader.js
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';


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
        // const response = await fetch(`${baseUrl}/api/user-supplied-breeds/`, {
          const response = await fetch(`${baseUrl}/api/breader-trade-id/`, {

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
      {breaderData && (
        <div>
          <h4 className='mb-4 ' style={{color:'#001b42'}}>Your Supply History</h4>
          <div className="row">
          {currentItems && currentItems.map((breader) => (
  <div key={breader.id} className="col-lg-12 mb-2">

      <div className="card  text-secondary" style={{ borderRadius: '10px', backgroundColor:'#fff' }}>
        <div className="card-body" style={{textTransform:'capitalize'}}>  
          <h5 className="card-title"></h5>
          <div className="row">
            <div className="col-md-3" style={{textTransform:'capitalize'}}>
            {breader.breeds_supplied} {breader.breed}
            </div>
            <div className="col-md-3">
              <strong>Supplied:</strong> {formatTimestamp(breader.created_at)}
            </div>
            <div className="col-md-3">
            
              <span className='mx'>{breader.isPaid ? 'Paid' : 'Payment Pending'}</span>

               </div>
            <div className="col-md-3">
            <Link to={`/breader-more-info/${breader.id}`} className="btn btn-light btn-sm">
                View Details
              </Link>
            </div>
          </div>
          {/* <div className="row mt-2">
            <div className="col-md-12">
              <p className="card-text" style={{ float: 'right', fontSize: '11px', fontWeight: '800', width: 'auto' }}>
              </p>
            </div>
          </div> */}
        </div>
      </div>
  </div>
))}



          </div>
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
    </div>
  );
};

export default Breader;
