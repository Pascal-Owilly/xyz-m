import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { checkUserRole } from './auth/CheckUserRoleUtils';

const WarehouseDashboard = () => {
  const Greetings = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting;
  
    if (currentHour < 5) {
      greeting = 'Good night';
    } else if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
  
    return greeting;
  };  

  const baseUrl = BASE_URL;
  const accessToken = Cookies.get('accessToken');
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [allUsers, setAllUsers] = useState([]); // Add state for all users
  const [profile, setProfile] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [username, setUsername] = useState('');

  // Filter user roles
  // Filter users based on role
  // const filteredUsers = users.filter((user) => {
  //   // Replace 'buyer' with the actual role name for buyers
  //   return user.role === 'buyer';
  // });

  const toggleInvoiceForm = () => {
    setShowInvoiceForm(!showInvoiceForm);
  };

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
        setUsername(userProfile.user.first_name); // Set the username
        // console.log('user profile', userProfile.user.first_name)
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
    console.log('Buyers:', buyers);
  
    // rest of the code...
  }, [buyers, accessToken, baseUrl]);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const role = await checkUserRole();
  
        // rest of the code...
      } catch (error) {
        // Handle errors...
      }
    };
  
    fetchBuyers();
  }, [accessToken, baseUrl]);
  

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/all-profiles/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (Array.isArray(response.data)) {
          // Filter users with the "buyer" role
          const buyerUsers = response.data.filter((user) => user.user.role === 'buyer');
          setBuyers(buyerUsers);
          setAllUsers(response.data);
        } else if (response.data && response.data.user) {
          // If the response is an object with a 'user' property, treat it as a single user
          const buyerUsers = [response.data].filter((user) => user.user.role === 'buyer');
          setBuyers(buyerUsers);
          setAllUsers([response.data]);
          console.log('all profiles:', allUsers);
        } else {
          console.error('Invalid response data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle errors...
      }
    };
  
    fetchAllUsers();
  }, [accessToken]);
  
 
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        // Define headers
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };

        // Fetch data from the provided endpoints with headers
        const [breaderTrade, breederTotals, slaughteredData, partTotalsCount, breedSales, breedCut] = await Promise.all([
          axios.get(`${baseUrl}/api/breader-trade/`, { headers }),
          axios.get(`${baseUrl}/api/breeder_totals/`, { headers }),
          axios.get(`${baseUrl}/api/slaughtered-list/`, { headers }),
          axios.get(`${baseUrl}/api/part_totals_count/`, { headers }),
          axios.get(`${baseUrl}/api/inventory-breed-sales/`, { headers }),
          axios.get(`${baseUrl}/api/breed-cut/`, { headers }),
        ]);
  

        // Group breederTotals data by breed
        const breedTotalsMap = breederTotals.data.reduce((acc, item) => {
          const breed = item.breed.toLowerCase();
          acc[breed] = (acc[breed] || 0) + item.total_breed_supply;
          return acc;
        }, {});

        // Group breedCut data by breed and part name
        const breedPartsMap = breedCut.data.reduce((acc, item) => {
          const breed = item.breed.toLowerCase();
          const partName = item.part_name.toLowerCase();
          const saleType = item.sale_type.toLowerCase();
          if (!acc[breed]) {
            acc[breed] = {};
          }
          if (!acc[breed][partName]) {
            acc[breed][partName] = [];
          }
          acc[breed][partName].push({ quantity: item.quantity, saleType });
          return acc;
        }, {});

        // Process the data as needed and update the state
        setInventoryData({
          totalBreeds: Object.values(breedTotalsMap).reduce((acc, total) => acc + total, 0) || 0,
          totalSlaughtered: slaughteredData.data.length || 0,
          inWarehouse: breaderTrade.data.length || 0,
          quantitySupplied: breedSales.data.reduce((acc, item) => acc + item.quantity, 0) || 0,
          breedTotals: breedTotalsMap,
          breedPartsInWarehouse: breedPartsMap,
        });
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, [accessToken, baseUrl]);


  const [inventoryBreedData, setInventoryBreedData] = useState({
    partName: 'ribs',
    saleType: 'export_cut',
    status: 'in_the_warehouse',
    quantity: 20,
  });

  const handleInventoryInputChange = (e) => {
    // Ensure that e and e.target are defined
    if (e && e.target) {
      // Ensure that e.target.name is defined
      const propertyName = e.target.name;
      if (propertyName) {
        setInventoryBreedData({
          ...inventoryBreedData,
          [propertyName]: e.target.value,
        });
      } else {
        console.error("Event target name is undefined:", e);
      }
    } else {
      console.error("Event or event target is undefined:", e);
    }
  };
  

  const handleInventorySubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the current inventory data
      const currentInventoryResponse = await axios.get(`${baseUrl}/api/inventory-breed-sales/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Get the existing inventory item for the submitted partName
      const existingInventoryItem = currentInventoryResponse.data.find(
        (item) => item.partName === inventoryBreedData.partName
      );

      if (existingInventoryItem) {
        // Calculate the new quantity in inventory after the sale
        const newQuantity = existingInventoryItem.quantity - inventoryBreedData.quantity;

        // Submit the updated data back to the server
        const updatedInventoryResponse = await axios.post(
          `${baseUrl}/api/inventory-breed-sales/`,
          {
            ...existingInventoryItem,
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Token ${accessToken}`,
            },
          }
        );

        console.log('Updated Inventory response:', updatedInventoryResponse.data);

        // Clear the form fields after successful submission
        setInventoryBreedData({
          partName: 'ribs',
          saleType: 'export_cut',
          status: 'in_the_warehouse',
          quantity: 20, // Set the default quantity or you can set it to null
        });
      }
    } catch (error) {
      console.error('Error making sale and updating inventory:', error.response);
    }
  };


  const [inventoryData, setInventoryData] = useState({
    totalBreeds: 0,
    totalSlaughtered: 0,
    inWarehouse: 0,
    status: null,
    quantitySupplied: 0,
    breedTotals: {},
    breedPartsInWarehouse: {},
  });

  const [invoiceData, setInvoiceData] = useState({
    breed: null,
    part_name: null,
    sale_type: null,
    quantity: null,
    unit_price: null,

    buyer: null, // Set initial value to null
    total_price: null,
  });

  const handleInvoiceInputChange = (e) => {
    if (e.target.name === 'buyer') {
      // Update the buyer property in invoiceData
      const selectedBuyer = buyers.find((buyer) => buyer.id === parseInt(e.target.value, 10));
      setInvoiceData((prevData) => ({
        ...prevData,
        buyer: selectedBuyer ? { user: selectedBuyer.user, id: selectedBuyer.id } : null,
      }));
    } else if (e.target.name === 'buyerMarket') {
      // Update the buyer market in invoiceData
      setInvoiceData((prevData) => ({
        ...prevData,
        buyer: selectedBuyer
          ? { id: selectedBuyer.id, username: selectedBuyer.user.username }
          : null,
      }));
    } else {
      // Update other properties in the usual way
      setInvoiceData({
        ...invoiceData,
        [e.target.name]: e.target.value,
      });
    }
  };
  
  
  const handleBuyerChange = (buyerUsername) => {
    const selectedBuyer = buyers.find((buyer) => buyer.user.username === buyerUsername);
  
    if (!selectedBuyer) {
      // Handle the case where selectedBuyer is null or undefined
      console.error('Selected buyer is null or undefined');
      return;
    }
  
    // Update the selectedBuyer state
    setSelectedBuyer(selectedBuyer);
  
    // Log the current state before updating
    console.log('Before Update - invoiceData:', invoiceData);
  
    // Update the buyer property in invoiceData
    setInvoiceData((prevData) => {
      const updatedData = {
        ...prevData,
        buyer: selectedBuyer
          ? { user: { username: selectedBuyer.user.username }, id: selectedBuyer.id }
          : null,
      };
      console.log('After Update - invoiceData:', updatedData);
      console.log('After Update - invoiceData.user:', updatedData.buyer.user);
      console.log('After Update - invoiceData.username:', updatedData.buyer.user.username);

      return updatedData;
    });
  };
  
  

    // Rest of your code...
  
  
  const handleGenerateInvoice = async () => {
    // Validate the invoice data (add your own validation logic)
     const invoiceDetails = {
      breed: invoiceData.breed,
      part_name: invoiceData.part_name,
      sale_type: invoiceData.sale_type,
      quantity: invoiceData.quantity,

      
      unit_price: invoiceData.unit_price,
      buyer: {
        id: selectedBuyer && selectedBuyer.id ? selectedBuyer.id : null,
        username: selectedBuyer.user.id,
      },
    };
  
    // Log the invoice details before making the request
    console.log('Invoice Details:', invoiceDetails);
  
    try {
      // Make a POST request to your Django API endpoint for invoice generation
      const response = await axios.post(`${baseUrl}/api/generate-invoice/`, invoiceDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Handle the response as needed
      console.log('Invoice Generation Response:', response.data);
  
      setSuccessMessage('Invoice generated and sent successfully!');
      setErrorMessage(null);
      setShowForm(false); // Hide the form after success
    } catch (error) {
      console.error('Error generating invoice:', error.response);
      // Handle the error, show a message, etc.
      setErrorMessage('Error generating invoice. Please try again.');
      setSuccessMessage(null);
    }
  };
  
  

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    // Fetch initial data and update state
  }, [accessToken, baseUrl]);

  const handleGenerateAnother = () => {
    setShowForm(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setInvoiceData({
      breed: null,
      part_name: null,
      sale_type: null,
      quantity: null,
      unit_price: null,

      total_price: null,
    });
    setSelectedBuyer(null);
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
    // fetchUserRole(); // Fetch user role when the component mounts
  }, []);
  return (
    <div className='main-container warehouse-container' style={{ minHeight: '85vh', background: 'rgb(249, 250, 251' }}>
      <div className='d-flex justify-flex-end'>
      <h3 className=' ' style={{right:0}}>Finished products</h3>

<div className='d-flex'>
      <a style={{marginLeft:'5rem'}} href='/inventory-dashboard'>
      <i className='dw dw-back'></i>
        Back 
      </a>
      </div>
      </div>
      <br />

          <Card className="weather-card" style={{ background: '#ffffff' }}>
            <Card.Body>

              <Card.Title className='text-center mb-3' style={{ color: '#A9A9A9', fontSize: '1.5rem', marginBottom: '1rem' }}> Available in the chilled warehouse</Card.Title>

              <Row>
                {Object.entries(inventoryData.breedPartsInWarehouse).map(([breed, parts]) => (
                  <Col key={breed} md={4}>
                    <Card style={{ marginBottom: '1.5rem' }}>
                      <Card.Header style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{capitalizeFirstLetter(breed)}</Card.Header>
                      <Card.Body>
                        <ul>
                        <li className='mb-2' style={{ fontSize: '1.2rem', fontFamily:'verdana', fontWeight:'bold' }}>Export Parts:</li>
                          {Object.entries(parts)
                            .filter(([partName, details]) => details.some(part => part.saleType === 'export_cut'))
                            .map(([partName, details]) => (
                              <li key={partName} style={{ fontSize: '1.2rem' }}>
                                {capitalizeFirstLetter(partName)}: {details.reduce((acc, part) => part.saleType === 'export_cut' ? acc + part.quantity : acc, 0)}
                              </li>
                            ))}
                          <li className='mb-2'  style={{ fontSize: '1.2rem', fontFamily:'verdana', fontWeight:'bold' }}>Local Sale Parts:</li>
                          {Object.entries(parts)
                            .filter(([partName, details]) => details.some(part => part.saleType === 'local_sale'))
                            .map(([partName, details]) => (
                              <li key={partName} style={{ fontSize: '1.2rem' }}>
                                {capitalizeFirstLetter(partName)}: {details.reduce((acc, part) => part.saleType === 'local_sale' ? acc + part.quantity : acc, 0)}
                              </li>
                            ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
          </div>
          
     
  );
};

export default WarehouseDashboard;