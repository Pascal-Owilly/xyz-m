import React, { useState, useEffect } from 'react';
import { Container, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const Home = () => {
  const baseUrl = BASE_URL;
  const authToken = Cookies.get('authToken');

  const [controlCenters, setControlCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [weight, setWeight] = useState('');
  const [breed, setBreed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitMessage, setSubmitMessage] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetchControlCenters();
  }, []);

  useEffect(() => {
    if (breed) {
      getTotalBredQuantity(breed);
    }
  }, [breed]);

  const fetchControlCenters = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/control-centers/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      setControlCenters(response.data);
    } catch (error) {
      console.error('Error fetching control centers:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the entered quantity is less than what's in stock
    if (parseInt(quantity, 10) > stockQuantity) {
      setSubmitMessage({ type: 'error', text: `Entered quantity is greater than what is in stock (${stockQuantity}).` });
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/slaughtered-list/`,
        {
          breed: breed,
          quantity: parseInt(quantity, 10),
          control_center: selectedCenter,
          weight: parseInt(weight),
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setFormSubmitted(true);
      setSubmitMessage({ type: 'success', text: 'Form submitted successfully!' });
      setBreed('');
      setQuantity('');
      setSelectedCenter('');
      setWeight('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to submit form. Please refresh the page and try again' });
    }
  };

  const getTotalBredQuantity = async (selectedBreed) => {
    try {
      // Make a request to get the total bred quantity for the selected breed
      const response = await axios.get(
        `${baseUrl}/api/breeder_totals/`,
        {
          params: { breed: selectedBreed },
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      // Find the total bred quantity for the selected breed
      const totalBredEntry = response.data.find((entry) => entry.breed === selectedBreed);

      // If found, set the total bred quantity; otherwise, default to 0
      if (totalBredEntry) {
        setStockQuantity(totalBredEntry.total_breed_supply);
      } else {
        setStockQuantity(0);
      }
    } catch (error) {
      console.error('Error fetching total bred quantity:', error);
      setStockQuantity(0); // Default to 0 if there's an error
    }
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
    setSubmitMessage(null);
  };


  // CUT FORM
  const [cutSubmitMessage, setCutSubmitMessage] = useState(null);
  const [showCutForm, setShowCutForm] = useState(true);

  const [cutData, setCutData] = useState({
    breed: 'goat',
    partName: 'ribs',
    saleType: 'export_cut',
    quantity: null,
  });
  // ... (other state variables and functions)
  const SALE_CHOICES = [
    ['export_cut', 'Export Cut'],
    ['local_sale', 'Local Sale Cut'],
];

const sale_cuts = SALE_CHOICES.map(([value, label]) => ({ value, label }));

const local_sale = SALE_CHOICES.map(([value, label]) => (
    `<option key="${value}" value="${value}">${label}</option>`
));

  const BreedCutForm = ({ showCutForm, onSubmit, cutData, onChange, submitMessage, onVisibilityChange }) => (
    showCutForm && (
      <div className="col-md-12 mb-5" >
        <div className="card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius:'11px' }}>
          <div className="card-body">
            <form onSubmit={onSubmit}>
              <h6 className="mb-3 " style={{color:'#999999'}}>To be added to chilled warehouse</h6>
  
              <p>
              <label htmlFor="breedInput" className="form-label">Enter raw product name: (eg Cow, Goat etc)</label>
  <input
    id="breedInput"
    type="text"
    name="breed"
    value={cutData.breed}
    onChange={onChange}
    className="form-control mb-3"
    required
  />
              </p>
              <label htmlFor="partNameInput" className="form-label text-secondary">Enter finished product name: (eg ribs, intestines etc)</label>
  <input
    id="partNameInput"
    type="text"
    name="partName"
    value={cutData.partName}
    onChange={onChange}
    className="form-control mb-3"
    style={{
      background: 'white',
      color: '#999999', // Secondary text color
      padding: '0.2rem',
      width: '100%'
    }}
    required
  />
  
  <label htmlFor="weightInput" className="form-label" style={{
      background: 'white',
      color: '#999999', // Secondary text color
      padding: '0.1rem',
      width: '100%'
    }}>Enter weight in Kg: (eg 300, 120 etc)</label>
  <input
    id="weightInput"
    type="number"
    name="weight"
    value={cutData.weight}
    onChange={onChange}
    className="form-control mb-3"
    style={{
      background: 'white',
      color: '#999999', // Secondary text color
      padding: '0.2rem',
      width: '100%'
    }}
    required
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
                  }}
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
              <label htmlFor="quantityInputCut" className="form-label" 
              style={{
                background: 'white',
                color: '#999999', // Secondary text color
              }}
              >Enter quantity: (eg 30, 120 etc)</label>
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
              <button type="submit" className="btn text-white" style={{background:'#001b40'}}>Submit</button>
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
        {/* <button className="btn btn-sm btn-secondary ms-2 mx-2" onClick={onVisibilityChange}>
           Submit Another 
        </button> */}
      </div>
    )
  );

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
  const [showForm, setShowForm] = useState(true);


  return (
    <div className="main-container" style={{minHeight:'85vh'}}>
          <h3 className="mb-4" style={{color:'#001b42'}}>Stock-exports update forms</h3>
          <hr />
      <Container>
        {/* <Col md={2}></Col> */}
        <Col md={12}>
<h6 className='mt-2 mb-3'>Outbound stock update </h6>
              {/* Submit Messages */}
    <SubmitMessage message={submitMessage} onVisibilityChange={handleFormVisibility} /> 
    <SubmitMessage message={cutSubmitMessage} onVisibilityChange={handleCutFormVisibility} />



        <div className="card p-4" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius:'11px' }}>
          {submitMessage && (
            <div className={`alert text-danger alert-${submitMessage.type} mt-3`} style={{fontWeight:'500'}}>
              {submitMessage.text}
            </div>
          )}
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} >
              <div className="mb-3">
                <p>
                <label htmlFor="control_center">Select Control Center:</label>
                </p>
                <select style={{color:'#999999', background:'#f9f9f9', padding:'5px', border:'1px solid #999999', borderRadius:'30px'}} id="control_center" value={selectedCenter} onChange={(e) => setSelectedCenter(e.target.value)} required>
                  <option value="" style={{color:'#999999', background:'#f9f9f9'}} >Select</option>
                  {controlCenters.map(center => (
                    <option key={center.id} value={center.id}>{center.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <p>
                <label htmlFor="weight">Weight:</label>
                </p>
                <input  style={{color:'#999999', background:'#f9f9f9', padding:'5px', border:'1px solid #999999', borderRadius:'30px'}}  type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </div>
              <div className="mb-3">
                <p>
                <label htmlFor="breedInput">Enter product name: (eg Cow, Goat etc)</label>
                </p>
                <input
                style={{color:'#999999', background:'#f9f9f9', padding:'5px', border:'1px solid #999999', borderRadius:'30px'}}
                  id="breedInput"
                  type="text"
                  name="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <p>
                <label htmlFor="quantityInput">Enter quantity: (eg 300 etc)</label>
                </p>
                <input
                style={{color:'#999999', background:'#f9f9f9', padding:'5px', border:'1px solid #999999', borderRadius:'30px'}}
                  id="quantityInput"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <hr />
              <Button className='btn btn-primary' type="submit" style={{width:'200px'}}>Submit</Button>
            </form>
          ) : (
            <div className={`alert alert-success mt-3`}>
              <Button className="ms-2" onClick={handleResetForm}>Submit Another</Button>
            </div>
          )}
        </div>
        </Col>

        {/* Breed Cut Form */}
<Col md={12} >
  <hr />
  <h6 className='mb-3'>Export-ready inventory update</h6>
              <BreedCutForm
                showCutForm={showCutForm}
                onSubmit={handleCutSubmit}
                cutData={cutData}
                onChange={handleCutInputChange}
                submitMessage={cutSubmitMessage}
                // onVisibilityChange={handleCutFormVisibility}
              />
            </Col>

      </Container>
    </div>
  );
};

export default Home;
