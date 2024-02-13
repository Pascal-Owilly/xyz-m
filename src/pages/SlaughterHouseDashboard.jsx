import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiCurrencyDollar } from 'react-icons/hi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { Container, Row, Col, Pagination, Card, Form, Table, Button,  Navbar, Nav } from 'react-bootstrap';

const Greetings = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  return greeting;
};

const PART_CHOICES = [
  ['ribs', 'Ribs'],
  ['thighs', 'Thighs'],
  ['loin', 'Loin'],
  ['shoulder', 'Shoulder'],
  ['shanks', 'Shanks'],
  ['organ_meat', 'Organ Meat'],
  ['intestines', 'Intestines'],
  ['tripe', 'Tripe'],
  ['sweetbreads', 'Sweetbreads'],
];

const SALE_CHOICES = [
  ['export_cut', 'Export Cut'],
  ['local_sale', 'Local Sale Cut'],
];

const UserProfile = ({ user }) => (
  <Col lg={{ span: 3, offset: 9 }} className='text-right'>
 
</Col>
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




const BreedCutForm = ({ showCutForm, onSubmit, cutData, onChange, submitMessage, onVisibilityChange }) => (
  showCutForm && (
    <div className="col-md-12">
      <div className="card" style={{ height:'500px' }}>
        <div className="card-body">
          <form onSubmit={onSubmit} >
            <h5 className=" mb-3 " style={{ color: '#001b40' }} >Finished products form</h5>
            <p>
              <label htmlFor="breedCutSelect" className="form-label">Enter product name:</label>
              <select
                        style={{
                          background: 'white',
                          color: '#999999', // Secondary text color
                          padding: '0.2rem',
                          borderRadius: '30px',
                          width:'100%'
                        }}
                        id="breedCutSelect"
                        name="breed"
                        value={cutData.breed}
                        onChange={onChange}
                        className='form-select mb-3 mx-2'
                      >
                        {['goats', 'sheep', 'cows'].map((animal) => (
                          <option key={animal} value={animal}>
                            {animal.charAt(0).toUpperCase() + animal.slice(1)}
                          </option>
                        ))}
                      </select>
            </p>
            <label htmlFor="partNameSelect" className="form-label">Select Part Name:</label>
            <input
  style={{
    background: 'white',
    color: '#999999', // Secondary text color
    padding: '0.2rem',
    borderRadius: '30px',
    width: '100%',
    border: '1px solid #ced4da', // Add border style
    outline: 'none', // Remove default outline
  }}
  id="breedCutSelect"
  name="breed"
  value={cutData.breed}
  onChange={onChange}
  className='form-select mb-3 mx-2'
  placeholder="eg rib, loin.. etc" // Add placeholder text
/>

            <p>
              <label htmlFor="saleTypeSelect" className="form-label">Select Sale Type:</label>
              <select
style={{
  background: 'white',
  color: '#999999', // Secondary text color
  padding: '0.2rem',
  borderRadius: '30px',
  width:'100%'
}}                id="saleTypeSelect"
                name="saleType"
                value={cutData.saleType}
                onChange={onChange}
                className='form-select mb-3 mx-2'
              >
                {/* Use the SALE_CHOICES here */}
                {SALE_CHOICES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </p>
            <label htmlFor="quantityInputCut" className="form-label">Enter quantity of breed parts:</label>
            <input
                        id="quantityInputCut"
                        type="number"
                        name="quantity"
                        value={cutData.quantity}
                        onChange={onChange}
                        className="form-control mb-3"
                        required
                        style={{
                          background: 'white',
                          color: '#6c757d', // Secondary text color
                          borderRadius: '30px',
                          padding: '0.2rem',
                        }}
                      />
            <button type="submit" className="btn text-white" style={{ background: '#001b40' }}>Submit</button>
          </form>
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
  const [selectedBreeds, setSelectedBreeds] = useState([]);

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

  const [activeSection, setActiveSection] = useState('BreederPayments');

  // ... (other state variables and functions)

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      // Do something with the token if needed
    }
    fetchUserData();
  }, []);

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
      if(!accessToken){
        navigate('/')
      }
      if (accessToken) {
        const response = await axios.get(`${baseUrl}/auth/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const userProfile = response.data;
        setProfile(userProfile);
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
  

  const handleFormVisibility = () => {
    setShowForm(!showForm);
    setSubmitMessage(null);
  };

  const handleCutFormVisibility = () => {
    setShowCutForm(!showCutForm);
    setCutSubmitMessage(null);
  };

// Modify the handleInputChange function to handle changes in multiple breed selections
const handleInputChange = (e) => {
  const { value } = e.target;
  setSelectedBreeds((prevSelectedBreeds) => {
    if (prevSelectedBreeds.includes(value)) {
      return prevSelectedBreeds.filter((breed) => breed !== value);
    } else {
      return [...prevSelectedBreeds, value];
    }
  });
};

  const handleCutInputChange = (e) => {
    setCutData({
      ...cutData,
      [e.target.name]: e.target.value,
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
  

  // Update the form submission logic to handle multiple selected breeds
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${baseUrl}/api/slaughtered-list/`,
      {
        breeds: selectedBreeds, // Pass the selected breeds array
        quantity: parseInt(quantity, 10),
      },
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );

    console.log('Post response:', response.data);

    setSubmitMessage({ type: 'success', text: 'Slaughter form submitted successfully!' });
    setShowForm(false);

    // Clear the form fields after successful submission
    setSelectedBreeds([]); // Clear the selected breeds array
    setQuantity('');
  } catch (error) {
    console.error('Error submitting form:', error);

    setSubmitMessage({ type: 'error', text: 'Failed to submit form. Please refresh the page and try again' });
  }
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
      setCutSubmitMessage({ type: 'success', text: 'Breed Parts Form submitted successfully!' });
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
      setCutSubmitMessage({ type: 'error', text: 'Failed to submit Breed parts Form. Please refresh the page and try again.' });
    }
  };

  const SlaughterForm = ({ showForm, onSubmit, submitMessage, onVisibilityChange, breedsData, handleInputChange, selectedBreeds }) => (
    showForm && (
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card" style={{ height: '500px' }}>
            <div className="card-body">
              <h5 className="mb-3" style={{ color: '#001b40' }}>Raw materials form </h5>
              {breedsData && breedsData.map((breed, index) => (
                <div key={index} className="mb-4">
                  <h6>{breed.name}</h6>
                  <div className="mb-3">
                    <label htmlFor={`quantity_${index}`} className="form-label">Select Quantity for {breed.name}:</label>
                    <input
                      id={`quantity_${index}`}
                      type="number"
                      name={`quantity_${index}`}
                      value={breed.quantity}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="form-control mb-3"
                      placeholder={`Enter quantity for ${breed.name}`}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={`animal_${index}`} className="form-label">Select Animals for {breed.name}:</label>
                    <select
                      id={`animal_${index}`}
                      name={`animal_${index}`}
                      value={selectedBreeds[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className='form-select mb-3'
                      multiple
                    >
                      {breed.animals.map((animal, animalIndex) => (
                        <option key={animalIndex} value={animal.id}>
                          {animal.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn" style={{ background: '#001b40', color: 'white' }}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    )
  );
  
  
  

  return (
    <>

     <div className='main-container'>

{/* Navbar */}
<Navbar bg="" style={{ background: '#001b40' }} expand="lg" variant="dark">
      <Navbar.Brand>
        <span style={{ fontWeight: '' }}>Inventory Record Forms</span>
      </Navbar.Brand>

    </Navbar>
        <hr />

        <p className='p-3'>In this dashboard, you will be recording the breeds slaughtered and the corresponding breed parts; please be cautious as the inventory will be updated based on these actions.</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                  <a href="/inventory-dashboard" className='mx-5' style={{ color: '#3498db', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                    <i className="dw dw-back" style={{ marginLeft: '5px' }}></i> &nbsp;  Back to inventory
                  </a>
                </div>
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

            {/* Breed Cut Form */}
            <Col md={6}>
              <BreedCutForm
                showCutForm={showCutForm}
                onSubmit={handleCutSubmit}
                cutData={cutData}
                onChange={handleCutInputChange}
                submitMessage={cutSubmitMessage}
                onVisibilityChange={handleCutFormVisibility}
              />
            </Col>
          </Row>


    {/* <div className="mb-3 ">
      <div className="icon-box">
        <HiBell size={20} color='white' />
      </div>
    </div> */}
  </div>
</div>

    </>
  );
};

export default Home;
