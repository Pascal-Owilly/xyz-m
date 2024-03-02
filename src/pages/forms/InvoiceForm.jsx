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
  const [controlCenters, setControlCenters] = useState([]);
  const [sellers, setSellers] = useState([]);

  const accessToken = Cookies.get('accessToken');
  const baseUrl = BASE_URL;

  const [formData, setFormData] = useState({
    breeds_supplied: null,
    goat_weight: null,
    community: '',
    breed: '', // Set a default breed
    market: '',
    head_of_family: '',
    vaccinated: false,
    phone_number: '',
    tag_number:'',
    email:'',
    price: null,
    breeder: null,
    abattoir: null,
    user: null,
    animalOptions: ['Goats', 'Sheep', 'Cows', 'Pigs'],
    selectedAnimal: 'Goats',
    control_center:null,
    seller:  null,
  });

useEffect(() => {
  fetchUserData();
}, [navigate, accessToken]);


// Fetch control centers and sellers data
useEffect(() => {
  const fetchControlCentersAndSellers = async () => {
    try {
      const controlCentersResponse = await axios.get(`${baseUrl}/api/control-centers/`);
      const sellersResponse = await axios.get(`${baseUrl}/api/sellers/`);

      setControlCenters(controlCentersResponse.data);
      setSellers(sellersResponse.data);
      console.log('sellers', sellersResponse.data)
      console.log('control center', controlCentersResponse.data)

    } catch (error) {
      console.error('Error fetching control centers and sellers data:', error);
    }
  };

  fetchControlCentersAndSellers();
}, [baseUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch seller data for the currently logged-in breeder
        const response = await axios.get(`${baseUrl}/api/sellers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            breeder_id: user?.id, // Pass the currently logged-in breeder's ID as a parameter
          },
        });
    
        const sellerData = response.data;
        console.log('seller data', sellerData); // Log the sellerData array
    
        // Set Abattoir name to the full name of the first seller related to the breeder
        if (sellerData.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            abattoir_name: sellerData[0]?.full_name || '',
          }));
        } else {
          console.error('No seller data found for the breeder.');
          // Handle the case where no seller data is found
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token expired, try refreshing the token
          await refreshAccessToken();
          // Retry fetching data
          await fetchData();
        } else {
          // Handle other errors
          console.error('Error fetching seller data:', error);
          // You can set an error state here to display an error message to the user
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
        // Fetch seller data for the currently logged-in breeder
        const abattoirResponse = await axios.get(`${baseUrl}/api/sellers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            breeder_id: user?.id, // Pass the currently logged-in breeder's ID as a parameter
          },
        });
  
        const abattoirData = abattoirResponse.data;
        console.log('seller data', abattoirData);
  
        // Set default abattoir name if available
        if (abattoirData.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            abattoir: abattoirData[0].id,
            abattoir_name: abattoirData[0].full_name,
          }));
        }
  
        // Set default breeder name
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
      }
    };
  
    fetchData();
  }, [accessToken, user]);
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if control_center and seller are selected
  if (!formData.control_center || !formData.seller) {
    alert('Please select both Control Center and Seller.'); // Display an error message
    return; // Prevent form submission
  }

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
        tag_number:'',
        breed: '',
        breeder: null,
        abattoir: null,
        user: null,
        control_center: null,
        seller: null,
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
  <th style={{ border: '1px solid #999999', padding: '5px' }}>Product name</th>
  <td style={{ border: '1px solid #999999', padding: '5px' }}>
  <input
    type="text"
    name="breed"
    value={formData.breed}
    onChange={handleInputChange}
    className='form-control'
    placeholder="Enter product name"
  />
</td>

</tr>
            <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Quantity</th>
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
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Weight (Kg)</th>
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
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Price/Kg</th>
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
                  placeholder='13754712345678'
                />
              <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.bank_account_number}</div>

              </td>
              </tr>
              <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Select seller</th>
              <td>
              <div className='form-group'>
                  <label htmlFor='control_center'>Select Control Center:</label>
                  <select
                    id='control_center'
                    name='control_center'
                    className='form-control'
                    value={formData.control_center}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select Control Center</option>
                    {controlCenters.map((center) => (
                      <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                  </select>
                </div>
              </td>
              </tr>
            
              <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Select control center</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>

              <div className='form-group'>
                  <label htmlFor='seller'>Select Seller:</label>
                  <select
                    id='seller'
                    name='seller'
                    className='form-control'
                    value={formData.seller}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select Seller</option>
                    {sellers.map((seller) => (
                      <option key={seller.id} value={seller.id}>{seller.full_name}</option>
                    ))}
                  </select>
                </div>
                </td>
                </tr>
   
                <input
                  type="hidden"
                  name="tag_number"
                  value={user && user.community ? user.community : ''}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Name of your community'

                />
              
              <input
                  type="hidden"
                  name="tag_number"
                  value={formData.tag_number}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Tag number'

                />
            <tr>
                <input
                  type="hidden"
                  name="market"
                  value={user && user.market ? user.market : ''}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Name of your market'

                />
            </tr>
            
              <input
                  type="hidden"
                  name="head_of_family"
                  value={user && user.head_of_family ? user.head_of_family : ''}
                  onChange={handleInputChange}
                  className='form-control'
                  readOnly

                  placeholder='Family head'

                />
            
              <input
                type="hidden"
                name="breeder"
                value={formData.breeder_name ? formData.breeder_name : ''}
                readOnly
                className='form-control'
              />
           
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
          </div>
          <div className='col-md-4'></div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceForms;
