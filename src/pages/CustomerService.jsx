import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const MessageSender = ({ baseUrl, accessToken, show, handleClose }) => {
  const [sellers, setSellers] = useState([]); // Initialize sellers as an empty array
  const [selectedSeller, setSelectedSeller] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/sellers/`, {

          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setSellers(response.data);
        console.log('sellers', response)
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, [baseUrl, accessToken]);

  const handleSellerChange = (e) => {
    setSelectedSeller(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(selectedSeller, message);
  };

  const handleSubmit = () => {
    if (selectedSeller && selectedDocument) {
      const formData = new FormData();
      formData.append('message', selectedDocument); // Change 'file' to 'message'
      formData.append('seller', selectedSeller); // Keep 'seller' as is
  
      axios.post(`${baseUrl}/api/documents-to-seller/`, formData)
        .then(response => {
          console.log('Document uploaded successfully:', response.data);
          setShowUpload(false);
        })
        .catch(error => console.error('Error uploading document:', error));
    } else {
      console.error('Seller or document not selected');
    }
  };
  
  return (
    <div className='main-container'>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="formSeller">
          <Form.Label>Select Seller</Form.Label>
          <Form.Control as="select" onChange={handleSellerChange} value={selectedSeller}>
            <option value="">Select Seller</option>
            {Array.isArray(sellers) && sellers.map((seller, index) => (
              <option key={index} value={seller.id}>{seller.full_name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} onChange={handleMessageChange} value={message} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Message
        </Button>
      </Form>
    </div>
  );
};

export default MessageSender;
