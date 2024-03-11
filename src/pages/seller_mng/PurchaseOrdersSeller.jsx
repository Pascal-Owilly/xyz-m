import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../auth/config';

const PurchaseOrders = () => {

    const baseUrl = BASE_URL;
    const [profile, setProfile] = useState([]);
    // const [user, setUser] = useState(null);
    const [confirmingId, setConfirmingId] = useState(null);
    const [unconfirmingId, setUnconfirmingId] = useState(null);
    const accessToken = Cookies.get('accessToken');
    const [user, setUser] = useState(null); 
     
  // State to store the fetched purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  // State to track loading state
  const [loading, setLoading] = useState(true);
  // State to track error state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/quotations/`);
        setPurchaseOrders(response.data);
        setLoading(false); 
        console.log('quotation list', response.data)
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        setError(error); 
        setLoading(false); 
      }
    };
    
    fetchPurchaseOrders(); 
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
  <h2 style={{color:'#001b40'}}>Purchase Orders</h2>
  <hr />
  <table className="table table-stripped p-3" style={{ background: 'white', color: '#999999', fontSize: '13px' }}>
    <thead className=" p-3">
      <tr className=" p-3">
        <th>Order Number</th>
        <th>Date</th>
        <th>Trader Name</th>
        <th>Buyer Address</th>
        <th>Buyer Contact</th>
        <th>Seller Address</th>
        <th>Seller Contact</th>
        <th>Shipping Address</th>
        <th>Confirmation</th>
        <th>Product Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Tax</th>
        <th>Total Amount</th>
        <th>Delivery Terms</th>
        <th>Special Instructions</th>
      </tr>
    </thead>
    <tbody className=" p-3">
    {Array.isArray(purchaseOrders) && purchaseOrders.slice().reverse().map(order => (
        <tr key={order.id}>
          <td>#{order.id}</td>
          <td>{order.date}</td>
          <td>{order.trader_name}</td>
          <td>{order.buyer_address}</td>
          <td>{order.buyer_contact}</td>
          <td>{order.seller_address}</td>
          <td>{order.seller_contact}</td>
          <td>{order.shipping_address}</td>
          <td>
          <button 
            className={order.confirmed ? 'btn-sm bg-success' : 'btn-sm'}
            onClick={() => toggleConfirmationStatus(order.id, order.confirmed)}
            disabled={confirmingId === order.id || unconfirmingId === order.id}
            style={{ fontSize: '13px', backgroundColor: order.confirmed ? '#708238' : '#23282d' }}
          >
            {confirmingId === order.id ? 'Confirming...' : (unconfirmingId === order.id ? 'Unconfirming...' : (order.confirmed ? 'Confirmed' : 'Unconfirmed'))}
          </button>
          </td>
          <td>{order.product_description}</td>
          <td>{order.quantity}</td>
          <td>{order.unit_price}</td>
          <td>{order.tax}</td>
          <td>{order.total_amount}</td>
          <td>{order.delivery_terms}</td>
          <td>{order.special_instructions}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default PurchaseOrders;
