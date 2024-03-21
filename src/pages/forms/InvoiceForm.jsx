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
      // const sellersResponse = await axios.get(`${baseUrl}/api/all-sellers/`);

      setControlCenters(controlCentersResponse.data);
      // setSellers(sellersResponse.data);
      // console.log('sellers dataata', sellersResponse.data)
      console.log('control center', controlCentersResponse.data)

    } catch (error) {
      console.error('Error fetching control centers and sellers data:', error);
    }
  };

  fetchControlCentersAndSellers();
}, [baseUrl]);

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
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/all-sellers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSellers(response.data);
        console.log('sellers for breeders', response.data)
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, [baseUrl, accessToken]);
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Initialize errors object
    const errors = {};
    if (!formData.breed || formData.breed <= 0) {
      errors.breed = 'Please enter a name for this product.';
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
  
    if (!formData.control_center) {
      errors.control_center = 'Please select a control center.';
    }
  
    if (!formData.seller) {
      errors.seller = 'Please select a seller.';
    }
  
    if (Object.keys(errors).length > 0) {
      // Set form errors and stop form submission
      setErrors(errors);
      return;
    }
  
    try {
      // Clear form errors on successful submission
      setErrors({});
  
      const response = await axios.post(
        `${baseUrl}/api/breader-trade-to-seller/`,
        {
          ...formData,
          breeder: user?.id,
          user: user?.id,
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
  
      // Reset form data except for breeder and abattoir
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
        tag_number: '',
        breed: '',
        breeder: user?.id,
        abattoir: formData.abattoir,
        user: user?.id,
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
          alert('Error in creating BreaderTrade:', backendErrors);
        }
      } else {
        alert('Error submitting invoice form:', error.response.data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
          {/* style="min-height: 65vh; color: rgb(0, 27, 66); padding: 5px; display: flex; flex-direction: column; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 8px; background-color: rgb(245, 245, 245);" */}
    {/* {user && user.role === 'superuser' && ( */}
      <Card className="weather-card" style={{ background: 'rgb(245, 245, 245)', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 8px' }}>
      <Card.Body>
        <Card.Title style={{ color: '#A9A9A9' }}>Product supply form {successMessage} </Card.Title>
        <table style={{ background: 'rgb(245, 245, 245)', color: '#999999', width:'100%' }}>
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
                  <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.breed}</div>

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
                style={{background:'#fff'}}
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
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Control center</th>
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
                <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.control_center}</div>

              </td>

              </tr>
              <tr>
              <th style={{ border: '1px solid #999999', padding: '5px' }}>Seller</th>
              <td style={{ border: '1px solid #999999', padding: '5px' }}>
              <div className='form-group'>
                  <label htmlFor='seller'>Select seller</label>
                    <select
                    className="form-select text-dark p-2 bg-light "
                    style={{ borderRadius: '', width: '100%', border: '1px solid #999999', opacity: 0.5 }}
                    id="seller"
                    name="seller"
                    value={formData.seller}
                    onChange={handleChange}
                    required
                  >
                    <option className='bg-light p-3 text-dark' value="">Select seller</option>
                    {sellers.map((seller) => (
                      <option className='bg-light p-2' key={seller.id} value={seller.seller}>
                        {seller.full_name} - ({seller.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="error-message text-danger" style={{fontSize:'14px'}}>{errors.seller}</div>

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
