import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import { Card , Modal, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './InvoiceForm.css';

const InvoiceForms = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [profile, setProfile] = useState([]);
  const [errors, setErrors] = useState({}); // Initialize errors state

  // confirm breed supply
 
  // Function to open the confirmation modal
  const openConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  // NEW
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isFormSubmitSuccessful, setIsFormSubmitSuccessful] = useState(false);

  // END


  // end confirrm

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
    const phoneNumberRegex = /^\+\d{1,3}\d{9}$/;
    if (!formData.phone_number || !phoneNumberRegex.test(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number in the format +254123456789.';
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
      // setIsFormSubmitted(true);
      setIsFormSubmitSuccessful(true); // Set the flag for successful form submission

      // navigate('/submission-successful');
  
      setFormData({
        breeds_supplied: null,
        goat_weight: null,
        community: '',
        market: '',
        head_of_family: '',
        vaccinated: false,
        phone_number: '',
        price: null,
        country: '',
        breed: '',
        breeder: null,
        abattoir: null,
        user: null,
      });
  
      // confirm supply
      setShowConfirmationModal(true);
      // end confirm
  
    } catch (error) {
      console.error('Error submitting invoice form:', error.response.data);
    }
  };
  

  
// confirm breed supply
const confirmSubmission = async () => {
  openConfirmationModal(); // Open the confirmation modal

  try {
    const response = await axios.post(
      `${BASE_URL}/api/accept-breeds/`, // Replace with your actual endpoint for accepting breeds
      { confirmation_code: confirmationCode },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(), 
        },
      }
    );
    console.log('accept breed headers:', headers)

    // Handle success (e.g., show a success message)
    console.log('Breeds accepted successfully:', response);
    setSuccessMessage('Breeds accepted successfully!');
    setShowConfirmationModal(false);
  } catch (error) {
    console.error('Error accepting breeds:', error.response.data);
    // Handle error (e.g., show an error message)
  }
};

// end confirm

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

  // Define the modal style
  const modalStyle = {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // You can keep the existing styles
    // padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    marginTop:'5rem',

  };

  return (
    <div className='main-container' >

       {/* React Bootstrap Modal for confirmation */}
       {isFormSubmitSuccessful ? (
  <div>
    {/* React Bootstrap Modal for confirmation */}
    <Modal style={modalStyle} show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Enter the confirmation code:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Enter the confirmation code:</p>
        <input
          type="text"
          style={{
            width: '100%',
            padding: '.4rem',
            borderRadius: '30px',
            border: 'none',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }}
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          className='bg-light text-dark mx-auto'
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={confirmSubmission}>
          Confirm
        </Button>
        <Button className='btn-sm' variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
      </Modal.Footer>
    </Modal>
  </div>
) : null}

      {/* end confirm */}
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
                  placeholder='+254712345678'
                />
              <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.phone_number}</div>

              </td>
            </tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Bank Account No</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
                <input
                  type="text"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='1234567890123'
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
