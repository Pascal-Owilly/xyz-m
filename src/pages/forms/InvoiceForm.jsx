import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import { Card } from 'react-bootstrap'; // Import the Card component from react-bootstrap
import {useNavigate} from 'react-router-dom';

const InvoiceForms = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const authToken = Cookies.get('authToken');
  const baseUrl = BASE_URL;
  const [formData, setFormData] = useState({
    breads_supplied: null,
    goat_weight: null,
    community: '',
    breed: 'goats', // Set a default breed
    market: '',
    head_of_family: '',
    vaccinated: false,
    phone_number: '',
    price: null,
    breader: null,
    abattoir: null, 
    user: null,
    animalOptions: ['Goats', 'Sheep', 'Cows', 'Pigs'], // Add more options as needed
    selectedAnimal: 'Goats', // Set a default animal
  });

  useEffect(() => {
    if (authToken) {
      // Fetch user data
      axios.get(`${baseUrl}/auth/user/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        console.log('Users data:', response.data);

        setFormData((prevData) => ({
          ...prevData,
          breader: response.data.username || '', // Use the correct path
        }));
      })
      
      .catch((error) => {
        console.log('Error fetching user data:', error);
      });

      // ... (rest of the code)
    } else {
      // Redirect unauthenticated users to the login page
      navigate('/login');
    }
  }, [navigate, authToken]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from other endpoints as needed
        const abattoirResponse = await axios.get(`${baseUrl}/api/abattoirs/1`, {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        const abattoirData = abattoirResponse.data;
        console.log('abattoir data', abattoirData);
  
        setFormData((prevData) => ({
          ...prevData,
          abattoir: abattoirData.id,  // Use the correct field name
          abattoir_name: abattoirData.name,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [authToken]);
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const authToken = Cookies.get('authToken');
  
      const response = await axios.post(
        `${baseUrl}/api/breader-trade/`,
        {
          ...formData,
          breader: user.pk,
          user: user.pk,
        },
        {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccessMessage('Invoice form submitted successfully!');
      setIsFormSubmitted(true);
      navigate('/submission-successful')
  
      // Clear the form
      setFormData({
        breads_supplied: null,
        goat_weight: null,
        community: '',
        market: '',
        head_of_family: '',
        vaccinated: false,
        phone_number: '',
        price: null,
        breed: '',
        breader: null,
        abattoir: null, 
        user: null,
      });

      // window.location.reload();

    } catch (error) {
      console.error('Error submitting invoice form:', error.response.data);
    }
  };
  

  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className='main-container' >
      <div className='container' style={{height:'auto'}}>
        <div className='row'>
        <div className='col-md-1'></div>

          <div className='col-md-9'>
          
      {user && ( 
      <Card className="weather-card" style={{ background: 'transparent' }}>
      <Card.Body>
        <Card.Title style={{ color: '#A9A9A9' }}>Please fill out this Invoice Form {successMessage} </Card.Title>
        <table style={{ background: 'transparent', color: '#999999', width:'100%' }}>
          <tbody>
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Number of Breads Supplied</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="number"
                  name="breads_supplied"
                  value={formData.breads_supplied}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Example 30'
                />
              </td>
            </tr>
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Bread Weight</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="number"
                  name="goat_weight"
                  value={formData.goat_weight}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='eg. 450'

                />
              </td>
            </tr>
            <tr>
  <th style={{ border: '1px dotted black', padding: '5px' }}>Bread Name</th>
  <td style={{ border: '1px dotted black', padding: '5px' }}>
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
              <th style={{ border: '1px dotted black', padding: '5px' }}>Bread Price</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Example 45000'

                />
              </td>
              </tr>
              <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Phone Number</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='+254712345678'
                />
              </td>
            </tr>
            
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px',color: '#999999' }}>Community:</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="text"
                  name="community"
                  value={formData.community}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Name of your community'

                />
              </td>
            </tr>
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Market:</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="text"
                  name="market"
                  value={formData.market}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Name of your market'

                />
              </td>
            </tr>
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Head of Family:</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="text"
                  name="head_of_family"
                  value={formData.head_of_family}
                  onChange={handleInputChange}
                  className='form-control'
                  placeholder='Your family name'

                />
              </td>
            </tr>
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Vaccinated:</th>
              <td style={{ border: '1px dotted black', padding: '5px' }}>
                <input
                  type="checkbox"
                  name="vaccinated"
                  checked={formData.vaccinated}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
            <th style={{ border: '1px dotted black', padding: '5px' }}>Breader Name</th>

            <td style={{ border: '1px dotted black', padding: '5px', textTransform: 'capitalize' }}>
              <input
                type="text"
                name="breader_id"
                value={formData.breader ? capitalizeFirstLetter(formData.breader) : ''}
                readOnly
                className='form-control'
              />
            </td>

            </tr>
            <tr>
              <th style={{ border: '1px dotted black', padding: '5px' }}>Abattoir Name</th>
              <td style={{ border: '1px dotted black', padding: '5px', textTransform:'capitalize' }}>
                <input
                style={{}}
                  type="text"
                  name="abattoir_name"
                  value={formData.abattoir_name ? formData.abattoir_name : ''}
                  readOnly
                  className='form-control'
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className='btn btn-dark mt-3' style={{ width: '200px' }} onClick={handleFormSubmit}>Submit</button>
      </Card.Body>
    </Card>
        )}
          </div>
          <div className='col-md-4'></div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceForms;
