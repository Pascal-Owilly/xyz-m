import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const InvoiceForms = () => {
  const authToken = Cookies.get('authToken');

  const baseUrl = BASE_URL;

  const [formData, setFormData] = useState({
    breads_supplied: null,
    breader: null,
    abattoir: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Placeholder for obtaining user data
        const userResponse = await axios.get(`${baseUrl}/authentication/user/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const userData = userResponse.data;
        console.log(userData)
        // Placeholder for obtaining Breader data
        const breaderResponse = await axios.get(`${baseUrl}/api/breaders/`, {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        const breaderData = breaderResponse.data;
        console.log(breaderData)
        // Filter Breader data based on the currently logged-in user
        const filteredBreader = breaderData.find(item => item.user === userData.id);
        
        if (filteredBreader) {
          // Update the formData with Breader data
          setFormData((prevData) => ({
            ...prevData,
            breader: filteredBreader.user,
          }));
        } else {
          console.error('User does not have Breader permissions');
          // Handle the case where the user doesn't have Breader permissions
        }

        // Fetch Abattoir data from the endpoint
        const abattoirResponse = await axios.get(`${baseUrl}/api/abattoirs/1`, {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        const abattoirData = abattoirResponse.data;

        // Update the formData with Abattoir data
        setFormData((prevData) => ({
          ...prevData,
          abattoir: abattoirData.name,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [authToken]); // Include authToken in the dependency array

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/api/breader-trade/`, formData);

      console.log('Invoice form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting invoice form:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className='main-container'>
      <h2>Please fill out the invoice form to supply </h2>
      <form onSubmit={handleFormSubmit}>
        <br />

        <label>
          Breads Supplied:
          <input
            type="number"
            name="breads_supplied"
            value={formData.breads_supplied}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Breader:
          <input
            type="text"
            name="breader"
            value={formData.breader ? formData.breader : ''}
            readOnly
          />
        </label>
        <br />

        <label>
          Abattoir:
          <input
            type="text"
            name="abattoir"
            value={formData.abattoir ? formData.abattoir : ''}
            readOnly
          />
        </label>
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InvoiceForms;
