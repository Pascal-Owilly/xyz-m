import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiCurrencyDollar } from 'react-icons/hi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { Container, Row, Col, Table, Button, Pagination, Card } from 'react-bootstrap';

const UserProfile = ({ user }) => (
<div className="mb-3" style={{ color: '#666666' }}>
  <p>Please enter the raw materials name and finished product name exactly as it appears in the inventory. Note that the form is case sensitive. and will add the entered name as a brand new product if not in the inventory</p>
</div>

);

const Message = ({ type, text }) => {
  if (!text) {
    return null; // Don't render if there is no message
  }

  return (
    <div className={`alert alert-${type} mt-3`} role="alert">
      {text}
    </div>
  );
};

const SlaughterForm = ({ showForm, onSubmit, submitMessage, onVisibilityChange, breed, handleInputChange, quantity, setQuantity }) => (
  showForm && (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
          <h5 className="mb-3 " style={{color:'#001b40'}}>Raw materials</h5>
          <h6 className="mb-3 " style={{color:'#999999'}}>To be deducted from inventory</h6>

            <form onSubmit={onSubmit}>
            <label htmlFor="breedInput" className="form-label" style={{color:'#666666'}}>Enter product name: (eg Cow, Goat etc)</label>
<input
  id="breedInput"
  type="text"
  name="breed"
  value={breed.selectedAnimal}
  onChange={(e) => handleInputChange(e)}
  className="form-control mb-3"
  required
/>


              <p>
                <label htmlFor="quantityInput" className="form-label">Enter quantity: (eg 300 etc)</label>
                <input
                  id="quantityInput"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control mb-3"
                  required
                />
              </p>
              <button type="submit" className="btn text-white" style={{background:'#001b40'}}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
);

const SubmitMessage = ({ message, onVisibilityChange }) => (
  message && (
    <div className={`alert alert-${message.type} mt-3`}>
      {message.text}
      <button className="btn btn-sm btn-secondary ms-2 mx-2" onClick={onVisibilityChange}>
        Submit Another
      </button>
    </div>
  )
);

const Home = () => {
  const baseUrl = BASE_URL;
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [cutSubmitMessage, setCutSubmitMessage] = useState(null);
  const [showCutForm, setShowCutForm] = useState(true);
  const [breed, setBreed] = useState({
    breed: 'goats',
    animalOptions: ['Goats', 'Sheep', 'Cows'],
    selectedAnimal: 'Goats',
  });
  const [quantity, setQuantity] = useState('');
  const [cutData, setCutData] = useState({
    breed: 'goat',
    partName: 'ribs',
    saleType: 'export_cut',
    quantity: null,
  });
  // ... (other state variables and functions)

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      // Do something with the token if needed
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/authentication/user/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFormVisibility = () => {
    setShowForm(!showForm);
    setSubmitMessage(null);
  };

  const handleCutFormVisibility = () => {
    setShowCutForm(!showCutForm);
    setCutSubmitMessage(null);
  };

  const handleInputChange = (e) => {
    setBreed({
      ...breed,
      selectedAnimal: e.target.value,
    });
  };

  const getTotalBredQuantity = async (selectedBreed) => {
    try {
      // Make a request to get the total bred quantity for the selected breed
      const response = await axios.get(
        `${baseUrl}/api/breeder_totals/`,  // Use the correct endpoint
        {
          params: { breed: selectedBreed.toLowerCase() },
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
  
      // Find the total bred quantity for the selected breed
      const totalBredEntry = response.data.find(entry => entry.breed.toLowerCase() === selectedBreed.toLowerCase());
  
      // If found, return the total bred quantity; otherwise, default to 0
      return totalBredEntry ? totalBredEntry.total_breed_supply : 0;
    } catch (error) {
      console.error('Error fetching total bred quantity:', error);
      return 0;  // Default to 0 if there's an error
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the total bred quantity for the selected breed
    const breedTotalBred = await getTotalBredQuantity(breed.selectedAnimal);
  
    console.log('Breed Total Bred:', breedTotalBred);
    console.log('Entered Quantity:', parseInt(quantity, 10));
  
    // Check if slaughtered quantity is more than total bred
    if (parseInt(quantity, 10) > breedTotalBred) {
      // Alert the user or handle the error as needed
      alert(`Inputed quantity (${parseInt(quantity, 10)}) is greater than total quantity left in the inventory for this particular product (${breedTotalBred}).`);
      return;
    }
  
    try {
      // Make a POST request to the endpoint
      const response = await axios.post(
        `${baseUrl}/api/slaughtered-list/`,
        {
          breed: breed.selectedAnimal.toLowerCase(),
          quantity: parseInt(quantity, 10),
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
  
      console.log('Post response:', response.data);
  
      // Show success message and hide the form
      setSubmitMessage({ type: 'success', text: 'Form submitted successfully!' });
      setShowForm(false);
  
      // Clear the form fields after successful submission
      setBreed({ ...breed, selectedAnimal: '' });
      setQuantity('');
    } catch (error) {
      console.error('Error submitting form:', error);
  
      // Show failure message
      setSubmitMessage({ type: 'error', text: 'Failed to submit form. Please refresh the page and try again' });
    }
  };
  

  const handleCutInputChange = (e) => {
    setCutData({
      ...cutData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCutSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the endpoint
      const response = await axios.post(
        `${baseUrl}/api/breed-cut/`,
        {
          breed: cutData.breed.toLowerCase(),
          part_name: cutData.partName.toLowerCase(),
          sale_type: cutData.saleType.toLowerCase(),
          quantity: parseInt(cutData.quantity, 10),
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      console.log('Cut post response:', response.data);

      // Show success message and hide the form
      setCutSubmitMessage({ type: 'success', text: 'Form submitted successfully!' });
      setShowCutForm(false);

      // Clear the form fields after successful submission
      setCutData({
        breed: 'goat',
        partName: 'ribs',
        saleType: 'export_cut',
        quantity: null,
      });
    } catch (error) {
      console.error('Error submitting cut form:', error);

      // Show failure message
      setCutSubmitMessage({ type: 'error', text: 'Failed to submit. Please refresh the page and try again.' });
    }
  };
  

  return (
    <>
     <div className='main-container'>
  <h3 className='' style={{color:'#001b40'}}>Inventory update forms</h3>

  <div className="container">
    {/* User Profile */}
    <UserProfile user={user} />

    {/* Submit Messages */}
    <SubmitMessage message={submitMessage} onVisibilityChange={handleFormVisibility} />
    <SubmitMessage message={cutSubmitMessage} onVisibilityChange={handleCutFormVisibility} />

    {/* Slaughter Form */}
    <Row>
            {/* Slaughter Form */}
            <Col md={6}>
              <SlaughterForm
                showForm={showForm}
                onSubmit={handleSubmit}
                submitMessage={submitMessage}
                onVisibilityChange={handleFormVisibility}
                breed={breed}
                handleInputChange={handleInputChange}
                quantity={quantity}
                setQuantity={setQuantity} // Pass the setQuantity function
              />
            </Col>
          </Row>
  </div>
</div>

    </>
  );
};

export default Home;
