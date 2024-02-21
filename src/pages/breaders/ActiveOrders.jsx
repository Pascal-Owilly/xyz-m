import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../auth/config';

const ActiveOrders = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1);
  const [ordersPerPage] = useState(5);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/purchase-orders/`);
        setPurchaseOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        setError(error);
        setLoading(false);
      }
    };
    
    fetchPurchaseOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const refreshAccessToken = async () => {
    try {
      console.log('fetching token refresh ... ')

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
  
  const toggleConfirmationStatus = async (orderId, currentStatus) => {
    try {
      if (!currentStatus) {
        // Your code to toggle confirmation status
      }
    } catch (error) {
      console.error('Error toggling confirmation status:', error);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if(!accessToken){
        navigate('/')
      }
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
      if (error.response && error.response.status === 401) {
        await refreshAccessToken();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = purchaseOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className='main-container' style={{ background: '#F9FAFB', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', fontSize: '16px', color: '#333' }}>
      <h4 className='' style={{ marginBottom: '18px', color:'#001b40' }}>Active Orders</h4>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      {currentOrders.reverse().map((order, index) => (
          order.confirmed && (
            <table className='table table-striped table-responsive' key={order.id} style={{width:'100%'}}>
              <thead className='' style={{color:'#666666'}}>
                <tr>
                  <th style={{ fontWeight: 'bold', fontSize:'16px' }}>Order Number</th>
                  <th style={{ fontWeight: 'bold', fontSize:'16px' }}>Date</th>
                  <th style={{ fontWeight: 'bold', fontSize:'16px' }}>Price/Kg</th>
                  <th style={{ fontWeight: 'bold', fontSize:'16px' }}>Product Description</th>
                  <th style={{ fontWeight: 'bold', fontSize:'16px' }}>Quantity</th>
                </tr>
              </thead>
              <tbody style={{color:'#666666'}}>
                <tr>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.unit_price}</td>
                  <td>{order.product_description}</td>
                  <td>{order.quantity}</td>
                </tr>
              </tbody>
            </table>
          )
        ))}
      </div>
      {/* Pagination */}
      {/* Pagination */}
{/* Pagination */}
<nav>
  <ul className='pagination'>
    {Array.from({ length: Math.ceil(purchaseOrders.length / ordersPerPage) }, (_, i) => i + 1)
      .reverse()
      .map((pageNumber, index) => (
        <li key={index} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
          <button onClick={() => paginate(pageNumber)} className='page-link'>
            {pageNumber}
          </button>
        </li>
      ))}
  </ul>
</nav>


    </div>
  );
};

export default ActiveOrders;
