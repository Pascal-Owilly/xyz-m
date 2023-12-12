import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiCurrencyDollar } from 'react-icons/hi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';

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
  <div className="mb-4 p-3 bg-lightgreen rounded">
    <p className='text-center'>
      {`${Greetings()}, `}
      <span style={{ textTransform: 'capitalize' }}>{user.username}!</span>
    </p>
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
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
          <h3 className="mb-3">Breed Slaughter Form</h3>

            <form onSubmit={onSubmit}>
              <label htmlFor="breedSelect" className="form-label">Select Breed:</label>
              <select
                  style={{ background: '#001f33', padding: '0.2rem', borderRadius: '30px' }}
                  id="breedSelect"
                  name="breed"
                  value={breed.selectedAnimal}
                  onChange={(e) => handleInputChange(e)}  // Use the handleInputChange function
                  className='form-select mb-3 mx-2'
                >


                {['goats', 'sheep', 'cows', 'pigs'].map((animal) => (
                  <option key={animal} value={animal}>
                    {animal.charAt(0).toUpperCase() + animal.slice(1)}
                  </option>
                ))}
              </select>

              <p>
                <label htmlFor="quantityInput" className="form-label">Enter quantity of breeds slaughtered:</label>
                <input
                  id="quantityInput"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control mb-3"
                  required
                />
              </p>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
);

const BreedCutForm = ({ showCutForm, onSubmit, cutData, onChange, submitMessage, onVisibilityChange }) => (
  showCutForm && (
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <h3 className="mb-3">Breed Parts Form</h3>
            <p>
              <label htmlFor="breedCutSelect" className="form-label">Select Breed:</label>
              <select
                style={{ background: '#001f33', padding: '0.2rem', borderRadius: '30px' }}
                id="breedCutSelect"
                name="breed"
                value={cutData.breed}
                onChange={onChange}
                className='form-select mb-3 mx-2'
              >
                {['goats', 'sheep', 'cows', 'pigs'].map((animal) => (
                  <option key={animal} value={animal}>
                    {animal.charAt(0).toUpperCase() + animal.slice(1)}
                  </option>
                ))}
              </select>
            </p>
            <label htmlFor="partNameSelect" className="form-label">Select Part Name:</label>
            <select
              style={{ background: '#001f33', padding: '0.2rem', borderRadius: '30px' }}
              id="partNameSelect"
              name="partName"
              value={cutData.partName}
              onChange={onChange}
              className='form-select mb-3 mx-2'
            >
              {/* Use the PART_CHOICES here */}
              {PART_CHOICES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p>
              <label htmlFor="saleTypeSelect" className="form-label">Select Sale Type:</label>
              <select
                style={{ background: '#001f33', padding: '0.2rem', borderRadius: '30px' }}
                id="saleTypeSelect"
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
            />
            <button type="submit" className="btn btn-success">Submit Breed Cut</button>
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
  const [breed, setBreed] = useState({
    breed: 'goats',
    animalOptions: ['Goats', 'Sheep', 'Cows', 'Pigs'],
    selectedAnimal: 'Goats',
  });
  const [quantity, setQuantity] = useState('');
  const [cutData, setCutData] = useState({
    breed: 'pigs',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setSubmitMessage({ type: 'success', text: 'Slaughter form submitted successfully!' });
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
      setCutSubmitMessage({ type: 'success', text: 'Breed Cut Form submitted successfully!' });
      setShowCutForm(false);

      // Clear the form fields after successful submission
      setCutData({
        breed: 'pigs',
        partName: 'ribs',
        saleType: 'export_cut',
        quantity: null,
      });
    } catch (error) {
      console.error('Error submitting cut form:', error);

      // Show failure message
      setCutSubmitMessage({ type: 'error', text: 'Failed to submit Breed Cut Form. Please refresh the page and try again.' });
    }
  };

  return (
    <>
      <div className='main-container'>
        <h2 className='text-center'> Slaughterhouse Dashboard</h2>
        <div>
          {/* User Profile */}
          <UserProfile user={user} />

           {/* Display Submit Messages at the top */}
           {/* <Message message={submitMessage} /> */}
          {/* <Message message={cutSubmitMessage} /> */}
{/* Submit Messages */}
<SubmitMessage message={submitMessage} onVisibilityChange={handleFormVisibility} />
          <SubmitMessage message={cutSubmitMessage} onVisibilityChange={handleCutFormVisibility} />


          {/* Slaughter Form */}
          <SlaughterForm
              showForm={showForm}
              onSubmit={handleSubmit}
              submitMessage={submitMessage}
              onVisibilityChange={handleFormVisibility}
              breed={breed}
              handleInputChange={handleInputChange}
              quantity={quantity}
              setQuantity={setQuantity}  // Pass the setQuantity function
            />




          {/* Breed Cut Form */}
          <BreedCutForm
            showCutForm={showCutForm}
            onSubmit={handleCutSubmit}
            cutData={cutData}
            onChange={handleCutInputChange}
            submitMessage={cutSubmitMessage}
            onVisibilityChange={handleCutFormVisibility}
          />

          
          <div className="mb-3 d-flex justify-content-end">
            <div className="icon-box">
              <HiBell size={20} color='white' />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <HiCube className='mr-2' /> Manage goats slaughtered and processed
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <HiCurrencyDollar className='mr-2' /> Carcass Tracking weighing and segregating export/non-export parts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
