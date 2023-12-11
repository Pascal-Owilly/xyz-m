import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiCurrencyDollar } from 'react-icons/hi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';

const Home = () => {
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

  const baseUrl = BASE_URL;
  const [profile, setProfile] = useState([]);
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState({});
  const [partNames, setPartNames] = useState([]);
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

const [saleChoices, setSaleChoices] = useState(SALE_CHOICES);

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

  const [breed, setBreed] = useState({
    breed: 'goats',
    animalOptions: ['Goats', 'Sheep', 'Cows', 'Pigs'],
    selectedAnimal: 'Goats',
  });

  const [quantity, setQuantity] = useState('');

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

      // Clear the form fields after successful submission
      setBreed({ ...breed, selectedAnimal: '' });
      setQuantity('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const [cutData, setCutData] = useState({
    breed: 'pigs',
    partName: '',
    saleType: 'export_cut',
    quantity: '',
  });

  const handleCutInputChange = (e) => {
    setCutData({
      ...cutData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCutSubmit = async (e) => {
    e.preventDefault();

    try {
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

      // Clear the form fields after successful submission
      setCutData({
        breed: 'pigs',
        partName: '',
        saleType: 'export_cut',
        quantity: '',
      });
    } catch (error) {
      console.error('Error submitting cut form:', error);
    }
  };

  return (
    <>
      <div className='main-container'>
        <h2 className='text-center'> Slaughterhouse Dashboard</h2>
        <div>
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <p className='text-center'>
              {`${Greetings()}, `}
              <span style={{ textTransform: 'capitalize' }}>{user.username}!</span>
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              <select
                name="breed"
                value={breed.selectedAnimal}
                onChange={handleInputChange}
                className='form-control'
              >
                {['goats', 'sheep', 'cows', 'pigs'].map((animal) => (
                  <option key={animal} value={animal}>
                    {animal.charAt(0).toUpperCase() + animal.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Quantity:
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
          <br />
          <form onSubmit={handleCutSubmit}>
        <h3 style={{ marginTop: '20px' }}>Breed Cut Form</h3>
        <label>
          Breed:
          <select
            name="breed"
            value={cutData.breed}
            onChange={handleCutInputChange}
            className='form-control'
          >
            {['goats', 'sheep', 'cows', 'pigs'].map((animal) => (
              <option key={animal} value={animal}>
                {animal.charAt(0).toUpperCase() + animal.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
            Part Name:
            <select
              name="partName"
              value={cutData.partName}
              onChange={handleCutInputChange}
              className='form-control'
            >
              {/* Use the PART_CHOICES here */}
              {PART_CHOICES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
        </label>
        <br />
        <label>
            Sale Type:
            <select
              name="saleType"
              value={cutData.saleType}
              onChange={handleCutInputChange}
              className='form-control'
            >
              {/* Use the PART_CHOICES here */}
              {SALE_CHOICES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={cutData.quantity}
            onChange={handleCutInputChange}
            required
          />
        </label>
        <br />
        <button type="submit">Submit Breed Cut</button>
      </form>

          <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <HiBell size={20} color='white' />
          </div>
          <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <HiCube className='mr-2' /> Manage goats slaughtered and processed
          </button>
          <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <HiCurrencyDollar className='mr-2' /> Carcass Tracking weighing and segregating export/non-export parts
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
