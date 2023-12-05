import React, { useState, useEffect } from 'react';
import { BASE_URL } from './config';
const RegistrationForm = () => {
  const baseUrl = BASE_URL; 
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${baseUrl}/registration/get-csrf-token/`);
        const data = await response.json();
        setCsrfToken(data.csrf_token);
        console.log('token is:  ', response)
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use csrfToken in your request headers
    fetch(`${baseUrl}/registration/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      // other request configurations...
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response
        console.log('response', response);
      })
      .catch(error => {
        // Handle errors  
        console.error('Registration error:', error);
      });
  };

  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
    id_number: '',
    community: '',
    market: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className='main-container' style={{height:'85vh'}}>
    <form onSubmit={handleSubmit} style={{marginTop:'5vh'}}>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label>Password:</label>
      <input
        type="password"
        name="password1"
        value={formData.password1}
        onChange={handleChange}
        required
      />

      <label>Confirm Password:</label>
      <input
        type="password"
        name="password2"
        value={formData.password2}
        onChange={handleChange}
        required
      />

      <label>First Name:</label>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />

      <label>Last Name:</label>
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />

      <label>ID Number:</label>
      <input
        type="text"
        name="id_number"
        value={formData.id_number}
        onChange={handleChange}
        required
      />

      <label>Community:</label>
      <input
        type="text"
        name="community"
        value={formData.community}
        onChange={handleChange}
        required
      />

      <label>Market:</label>
      <input
        type="text"
        name="market"
        value={formData.market}
        onChange={handleChange}
        required
      />

      <button type="submit">Register</button>
    </form>
    </div>
  );
};

export default RegistrationForm;
