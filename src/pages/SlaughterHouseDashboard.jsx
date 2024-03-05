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

  return (
    <div className="main-container" style={{minHeight:'85vh'}}>
          <h5 className="mb-4">Inventory Update Record Form</h5>
      <Container>
        <Col md={2}></Col>
        <Col md={8}>

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

      </Container>
    </div>
  );
};

export default Home;
