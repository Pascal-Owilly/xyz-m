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
    partName: 'ribs',
    saleType: 'export_cut',
    quantity: null,
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
        partName: 'ribs',
        saleType: 'export_cut',
        quantity: null,
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
          <div className="mb-4 p-3 bg-lightgreen rounded">
            <p className='text-center'>
              {`${Greetings()}, `}
              <span style={{ textTransform: 'capitalize' }}>{user.username}!</span>
            </p>
          </div>

          {/* Slaughter Form */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="breedSelect" className="form-label">Select Breed:</label>
                    <select
                      id="breedSelect"
                      name="breed"
                      value={breed.selectedAnimal}
                      onChange={handleInputChange}
                      className='form-select mb-3'
                    >
                      {['goats', 'sheep', 'cows', 'pigs'].map((animal) => (
                        <option key={animal} value={animal}>
                          {animal.charAt(0).toUpperCase() + animal.slice(1)}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="quantityInput" className="form-label">Quantity:</label>
                    <input
                      id="quantityInput"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="form-control mb-3"
                      required
                    />

                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div>

            {/* Breed Cut Form */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleCutSubmit}>
                    <h3 className="mb-3">Breed Cut Form</h3>

                    <label htmlFor="breedCutSelect" className="form-label">Select Breed:</label>
                    <select
                      id="breedCutSelect"
                      name="breed"
                      value={cutData.breed}
                      onChange={handleCutInputChange}
                      className='form-select mb-3'
                    >
                      {['goats', 'sheep', 'cows', 'pigs'].map((animal) => (
                        <option key={animal} value={animal}>
                          {animal.charAt(0).toUpperCase() + animal.slice(1)}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="partNameSelect" className="form-label">Select Part Name:</label>
                    <select
                      id="partNameSelect"
                      name="partName"
                      value={cutData.partName}
                      onChange={handleCutInputChange}
                      className='form-select mb-3'
                    >
                      {/* Use the PART_CHOICES here */}
                      {PART_CHOICES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="saleTypeSelect" className="form-label">Select Sale Type:</label>
                    <select
                      id="saleTypeSelect"
                      name="saleType"
                      value={cutData.saleType}
                      onChange={handleCutInputChange}
                      className='form-select mb-3'
                    >
                      {/* Use the SALE_CHOICES here */}
                      {SALE_CHOICES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="quantityInputCut" className="form-label">Quantity:</label>
                    <input
                      id="quantityInputCut"
                      type="number"
                      name="quantity"
                      value={cutData.quantity}
                      onChange={handleCutInputChange}
                      className="form-control mb-3"
                      required
                    />

                    <button type="submit" className="btn btn-success">Submit Breed Cut</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

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
      </div>    </>
  );
};

export default Home;
