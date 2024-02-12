import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../auth/config';

const ActiveOrders = () => {

    const baseUrl = BASE_URL;
    const [profile, setProfile] = useState([]);
    // const [user, setUser] = useState(null);

    const [confirmingId, setConfirmingId] = useState(null);
    const [unconfirmingId, setUnconfirmingId] = useState(null);

  
    const accessToken = Cookies.get('accessToken');
    const [user, setUser] = useState(null); // Initialize with null or an empty object
   
  
  // State to store the fetched purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  // State to track loading state
  const [loading, setLoading] = useState(true);
  // State to track error state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        // Fetch all purchase orders from the API
        const response = await axios.get(`${baseUrl}/api/purchase-orders/`);
        // Set the response data to state
        setPurchaseOrders(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        setError(error); // Set error state if there's an error
        setLoading(false); // Set loading to false in case of error
      }
    };
    
    fetchPurchaseOrders(); // Call the fetch function when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render loading state while data is being fetched
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Render error message if there's an error
  }

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
  
  const toggleConfirmationStatus = async (orderId, currentStatus) => {
    try {
      if (!currentStatus) {
        setConfirmingId(orderId);
        const confirmed = window.confirm(`Are you sure you want to confirm this order?`);
        if (confirmed) {
          await axios.put(
            `${baseUrl}/api/purchase-orders/${orderId}/`,
            { confirmed: true },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          // Update the local state to reflect the change
          setPurchaseOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? { ...order, confirmed: true } : order
            )
          );
        }
        setConfirmingId(null);
      }
    } catch (error) {
      console.error('Error toggling confirmation status:', error);
      setConfirmingId(null);
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
      // Check if the error indicates an expired access token
      if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        await refreshAccessToken();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  return (
    <div className='main-container' style={{ background: '#F9FAFB', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', fontSize: '16px', color: '#333' }}>
    <h2 className='text-success' style={{ marginBottom: '20px' }}>Active Orders</h2>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Array.isArray(purchaseOrders) && purchaseOrders.map((order, index) => (
        // Check if the order is confirmed before rendering
        order.confirmed && (
          <div className='text-secondary' key={order.id} style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', marginBottom: '15px', padding: '15px' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Order Number: #{order.id}</div>
            
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>Date: {order.date}</div>
              <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>Price/Kg: {order.unit_price}</div>
  
              <div style={{ flex: '1 1 100%', marginBottom: '10px', fontWeight: 'bold' }}>Product Description: {order.product_description}</div>
              <div style={{ flex: '1 1 50%', marginBottom: '10px' }}>Quantity: {order.quantity}</div>
            </div>
          </div>
        )
      )).reverse()}
    </div>
  </div>
  
  );
};

export default ActiveOrders;
