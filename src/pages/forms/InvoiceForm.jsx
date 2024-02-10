import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InvoiceForms = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [profile, setProfile] = useState([]);
  const [errors, setErrors] = useState({}); // Initialize errors state

  const accessToken = Cookies.get('accessToken');
  const baseUrl = BASE_URL;

  const [formData, setFormData] = useState({
    breeds_supplied: null,
    goat_weight: null,
    community: '',
    breed: 'goats', // Set a default breed
    market: '',
    head_of_family: '',
    vaccinated: false,
    phone_number: '',
    email:'',
    price: null,
    breeder: null,
    abattoir: null,
    user: null,
    animalOptions: ['Goats', 'Sheep', 'Cows', 'Pigs'],
    selectedAnimal: 'Goats',
  });

useEffect(() => {
  fetchUserData();
}, [navigate, accessToken]);

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

    
    const fetchData = async () => {
      try {
        const abattoirResponse = await axios.get(`${baseUrl}/api/abattoirs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        // ... (other code)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token expired, try refreshing the token
          await refreshAccessToken();
          // Retry fetching user data
          await fetchUserData();
        } else {
          // Handle other errors
        }
      }
    };

    fetchData();
  }, [accessToken, user]);

  useEffect(() => {
    fetchUserData();
  }, [navigate, accessToken]);
  

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
  
      if (accessToken) {
        const response = await axios.get(`${baseUrl}/auth/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const userProfile = response.data.user; // Access the user information correctly
        console.log('profile', userProfile)
        setUser(userProfile);
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
    fetchUserData();
  }, [navigate, accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abattoirResponse = await axios.get(`${baseUrl}/api/abattoirs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const abattoirData = abattoirResponse.data;
        if (abattoirData.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            abattoir: abattoirData[0].id,
            abattoir_name: abattoirData[0].user,
          }));
        }

        setFormData((prevData) => ({
          ...prevData,
          breeder: user?.id,
          user: user?.id,
          breeder_name: user?.username,
        }));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
        } 
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
          await fetchUserData();
        }
      }
    };

    fetchData();
  }, [accessToken, user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

     // Initialize errors object
     const errors = {};

// Validate phone number format
const phoneNumberRegex = /^\+(\d{1,4})\d{8,}$/;
if (!formData.phone_number || !(phoneNumberRegex.test(formData.phone_number) || /^\+\d{12}$/.test(formData.phone_number))) {
  errors.phone_number = 'Please enter a valid phone number. Use the format +2547112345678 or include a valid country code.';
}



     // Validate breeds supplied
  if (!formData.breeds_supplied || formData.breeds_supplied <= 0) {
    errors.breeds_supplied = 'Please enter a valid number of breeds supplied.';
  }

  // Validate total weight
  if (!formData.goat_weight || formData.goat_weight <= 0) {
    errors.goat_weight = 'Please enter a valid total weight.';
  }

    // Validate total weight
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Please enter a valid amount.';
    }
 
 
     if (Object.keys(errors).length > 0) {
       // Set form errors and stop form submission
       setErrors(errors);
       return;
     }

    try {
      console.log('User ID:', user?.id); // Log the user ID

      // Clear form errors on successful submission
      setErrors({});

      const response = await axios.post(
        `${baseUrl}/api/breader-trade/`,
        {
          ...formData,
          breeder: user?.id,  // Update with the correct field name
          user: user?.i,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('breeder trade', response);

      setSuccessMessage('Invoice form submitted successfully!');
      setIsFormSubmitted(true);
      navigate('/submission-successful');

      setFormData({
        breeds_supplied: null,
        goat_weight: null,
        community: '',
        market: '',
        head_of_family: '',
        vaccinated: false,
        phone_number: '',
        price: null,
        email: '',
        country: '',
        breed: '',
        breeder: null,
        abattoir: null,
        user: null,
      });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        const backendErrors = error.response.data;
        if (backendErrors && backendErrors.phone_number) {
          // Handle phone number validation error
          const phoneError = backendErrors.phone_number[0].string;
          setErrors({ phone_number: phoneError });
        } else {
          console.error('Error in creating BreaderTrade:', backendErrors);
        }
      } else {
        console.error('Error submitting invoice form:', error.response.data);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
    console.log(inputValue)

  };

  useEffect(() => {
    console.log('User:', user); // Log the entire user object
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [accessToken]);


  return (
    <div className='main-container' >
      <div className='container' style={{height:'auto'}}>
        <div className='row'>
        <div className='col-md-1'></div>

          <div className='col-md-9'>
          
    {/* {user && user.role === 'superuser' && ( */}
      <Card className="weather-card" style={{ background: '#ffffff' }}>
      <Card.Body>
        <Card.Title style={{ color: '#A9A9A9' }}>Please fill out this Invoice Form {successMessage} </Card.Title>
        <table style={{ background: 'transparent', color: '#999999', width:'100%' }}>
          <tbody>
          <tr>
  <th style={{ border: '1px solid #999999', padding: '5px' }}>Name of breed</th>
  <td style={{ border: '1px solid #999999', padding: '5px' }}>
    <select
      name="breed"
      value={formData.breed}
      onChange={handleInputChange}
      className='form-control'
    >
      {['goats', 'sheep', 'cows', 'pigs'].map((breed) => (
        <option key={breed} value={breed}>
          {breed.charAt(0).toUpperCase() + breed.slice(1)}
        </option>
      ))}
    </select>
  </td>
</tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>How many breeds?</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="number"
                  name="breeds_supplied"
                  value={formData.breeds_supplied}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Example 30'
                />
              <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.breeds_supplied}</div>

              </td>
            </tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Total Weight</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="number"
                  name="goat_weight"
                  value={formData.goat_weight}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='eg. 450'

                />
                <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.goat_weight}</div>

              </td>
            </tr>
            

<tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Vaccinated:</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  className='bg-white'
                  type="checkbox"
                  name="vaccinated"
                  checked={formData.vaccinated}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
              <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Breed Price</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Example 45000'

                />
             <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.price}</div>

              </td>
              </tr>
              <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Phone Number</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder=' eg. +254712345678'
                />
              <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.phone_number}</div>

              </td>
            </tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Email</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='eg. john@example.com'

                />
                <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.email}</div>

              </td>
            </tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>National ID No</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Enter Id Number'
                />
              <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.id_number}</div>

              </td>
            </tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Account No</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="text"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='+254712345678'
                />
              <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.bank_account_number}</div>

              </td>
            </tr>
            
            {/* <tr> */}
              {/* <th style={{ border: '1px dotted black', padding: '5px',color: '#999999' }}>Community:</th> */}
              {/* <td style={{ border: '1px dotted black', padding: '5px' }}> */}
                <input
                  type="hidden"
                  name="community"
                  value={user && user.community ? user.community : ''}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Name of your community'

                />
              {/* </td> */}
            {/* </tr> */}
            <tr>
              {/* <th style={{ border: '1px dotted black', padding: '5px' }}>Market:</th> */}
              {/* <td style={{ border: '1px dotted black', padding: '5px' }}> */}
                <input
                  type="hidden"
                  name="market"
                  value={user && user.market ? user.market : ''}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Name of your market'

                />
              {/* </td> */}
            </tr>
            {/* <tr> */}
              {/* <th style={{ border: '1px dotted black', padding: '5px' }}>Head of Family:</th> */}
              {/* <td style={{ border: '1px dotted black', padding: '5px' }}> */}
              <input
                  type="hidden"
                  name="head_of_family"
                  value={user && user.head_of_family ? user.head_of_family : ''}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Family head'

                />
              {/* </td> */}
            {/* </tr> */}
           
            {/* <tr> */}
            {/* <th style={{ border: '1px dotted black', padding: '5px' }}>Breeder Name</th> */}

            {/* <td style={{ border: '1px dotted black', padding: '5px', textTransform: 'capitalize' }}> */}
              <input
                type="hidden"
                name="breeder"
                value={formData.breeder_name ? formData.breeder_name : ''}
                readOnly
                className='form-control'
              />
            {/* </td> */}

            {/* </tr> */}
            {/* <tr> */}
              {/* <th style={{ border: '1px dotted black', padding: '5px' }}>Abattoir Name</th> */}
              {/* <td style={{ border: '1px dotted black', padding: '5px', textTransform:'capitalize' }}> */}
                <input
                style={{}}
                  type="hidden"
                  name="abattoir_name"
                  value={formData.abattoir_name ? formData.abattoir_name : ''}
                  readOnly
                  className='form-control'
                />
              {/* </td> */}
            {/* </tr> */}
          </tbody>
        </table>
        <button
  type="submit"
  className='btn btn-primary mt-3'
  style={{ width: '200px', marginLeft: 'auto', display: 'block' }}
  onClick={handleFormSubmit}
>
  Submit
</button>
      </Card.Body>
    </Card>
        {/* )} */}
          </div>
          <div className='col-md-4'></div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceForms;
