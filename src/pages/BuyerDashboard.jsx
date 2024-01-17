import React, { useState, useEffect } from 'react';
import { Card, Form, Button,Row , Col} from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');
const baseUrl = BASE_URL;
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [items,setItems] = useState([])
  const [purchaseOrderFormData, setPurchaseOrderFormData] = useState({
    status: 'pending',
    vendor_notification: '',
    buyer: currentUser ? currentUser.id : null, // Set the buyer field when initializing
    items: [],
  });

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

  useEffect(() => {
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
          setUsername(userProfile.user.first_name + " " + userProfile.user.last_name);
          setCurrentUser(userProfile.user); // Update the currentUser state
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
  
    fetchUserData();
  }, [baseUrl]);

  
  useEffect(() => {
    // Fetch items when the component mounts
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/items/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setItems(response.data);
        console.log('Items:', response.data); // Add this line
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    fetchItems();
  }, [accessToken]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const handlePurchaseOrderFormChange = (e) => {
    setPurchaseOrderFormData({
      ...purchaseOrderFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemCheckboxChange = (itemId) => {
    // Toggle the selection of the item
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleCreatePurchaseOrder = async () => {
    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
  
      // Log buyer information
      console.log('Buyer Info:', {
        buyerId: currentUser ? currentUser.id : null,
        buyerUsername: currentUser ? currentUser.username : null,
      });
  
      const response = await axios.post(`${BASE_URL}/api/purchase-orders/`, {
        ...purchaseOrderFormData,
        buyer: currentUser ? currentUser.id : null,
        items: selectedItems,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log('Purchase Order created:', response.data);
  
      // Redirect or show a success message
      navigate('/purchase-orders/' + response.data.id); // Adjust the route based on your setup
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };
  
  

  return (
    <div className='main-container' style={{ minHeight: '85vh' }}>
      <h4>Create Purchase Order</h4>

      <Card>
        <Card.Body>
          <Form>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={purchaseOrderFormData.status}
                onChange={handlePurchaseOrderFormChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formVendorNotification">
              <Form.Label>Vendor Notification</Form.Label>
              <Form.Control
                type="text"
                name="vendor_notification"
                value={purchaseOrderFormData.vendor_notification}
                onChange={handlePurchaseOrderFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formItems">
              <Form.Label>Items</Form.Label>
              {products.map((product) => (
                <Form.Check
                  key={product.id}
                  type="checkbox"
                  id={`checkbox-${product.id}`}
                  label={product.name}
                  value={product.id}
                  onChange={handleItemCheckboxChange}
                />
              ))}
            </Form.Group>
            <div>
    <h2>Items List</h2>
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleItemCheckboxChange(item.id)}
          />
          {`Product ${item.product} - Quantity: ${item.quantity}`}
        </li>
      ))}
    </ul>

    <Form.Group as={Row} controlId="formBuyer">
  <Form.Label column sm="2">
    Buyer
  </Form.Label>
  <Col sm="10">
    <Form.Control
      type="text"
      name="buyer"
      value={currentUser ? currentUser.username : ''}
      disabled
    />
  </Col>
</Form.Group>

    <Button variant="primary" type="button" onClick={handleCreatePurchaseOrder}>
      Create Purchase Order
    </Button>
  </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PurchaseOrderForm;
