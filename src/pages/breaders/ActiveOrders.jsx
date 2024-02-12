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
    <div className='main-container'>
      <h2>Active Orders</h2>
      <ul>
      {Array.isArray(purchaseOrders) && purchaseOrders.map(order => (
  // Check if the order is confirmed before rendering
  order.confirmed && (
    <li key={order.id} className='mb-2 mt-1'>
      <div>Order Number: #{order.id}</div>
      <div>Date: {order.date}</div>
      <div>Trader Name: {order.trader_name}</div>
      <div>Buyer Address: {order.buyer_address}</div>
      <div>Buyer Contact: {order.buyer_contact}</div>
      <div>Seller Address: {order.seller_address}</div>
      <div>Seller Contact: {order.seller_contact}</div>
      <div>Shipping Address: {order.shipping_address}</div>
      <button 
        className={order.confirmed ? 'bg-success btn-sm' : 'bg-danger btn-sm'}
        onClick={() => toggleConfirmationStatus(order.id, order.confirmed)}
        disabled={confirmingId === order.id || unconfirmingId === order.id}
      >
        {confirmingId === order.id ? 'Confirming...' : (unconfirmingId === order.id ? 'Unconfirming...' : (order.confirmed ? 'Confirmed' : 'Unconfirmed'))}
      </button>
      <div>Product Description: {order.product_description}</div>
      <div>Quantity: {order.quantity}</div>
      <div>Unit Price: {order.unit_price}</div>
      <div>Tax: {order.tax}</div>
      <div>Total Amount: {order.total_amount}</div>
      <div>Delivery Terms: {order.delivery_terms}</div>
      <div>Special Instructions: {order.special_instructions}</div>
    </li>
  )
))}

      </ul>
    </div>
  );
};

export default ActiveOrders;
