import React, { useState, useEffect } from 'react';
import './styles.css';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import axios from 'axios';

function PurchaseOrderForm({ orderId }) {
  const baseUrl = BASE_URL;

  const accessToken = Cookies.get('accessToken');
// State for success and failure messages
const [successMessage, setSuccessMessage] = useState('');
const [failureMessage, setFailureMessage] = useState('');

  // State for form data
  const [formData, setFormData] = useState({
    seller: '',
    trader_name: '',
    buyer_contact: '',
    seller_address: '',
    seller_contact: '',
    shipping_address: '',
    confirmed: false, // Added the confirmed field
    product_description: '',
    quantity: '',
    unit_price: '',
    tax: '',
    total_price: '',
    payment_terms: '',
    delivery_terms: '',
    special_instructions: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/purchase-orders/${orderId}/`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (orderId) {
        await axios.put(`${baseUrl}/api/purchase-orders/${orderId}/`, formData);
      } else {
        await axios.post(`${baseUrl}/api/purchase-orders/`, formData);
      }
      setSuccessMessage('Purchase order has been submitted successfully. Please wait for confirmation by the seller.');
      setFailureMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setFailureMessage('Failed to submit purchase order. Please check the fields and try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className='main-container' style={{ minHeight: '85vh' }}>
      {successMessage && <h2 className='text-center text-success mt-3'>{successMessage}</h2>}
      {failureMessage && <h2 className='text-center text-danger mt-3'>{failureMessage}</h2>}
        <p style={{color:'#001b40'}} className='text-center mt-3'>You have successfully confirmed the quotation. Please Proceed to generate purchase order.</p>
      <Form className='p-4 m-3' style={{ background: '#F9FAFB', color: '#666666', fontSize: '14px', border: 'none' }} onSubmit={handleSubmit}>
        <h5 className='text' style={{ color: '#666666' }}>Purchase Order Form</h5>
        <hr />
        <Row>
          <Col md={3}>
            <Form.Group controlId="seller">
              <Form.Label>Seller:</Form.Label>
              <Form.Control type="text" name="seller" value={formData.seller} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="trader_name">
              <Form.Label>Trader Name:</Form.Label>
              <Form.Control type="text" name="trader_name" value={formData.trader_name} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="shipping_address">
              <Form.Label>Shipping Address:</Form.Label>
              <Form.Control type="text" rows={3} name="shipping_address" value={formData.shipping_address} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="product_description">
              <Form.Label>Description:</Form.Label>
              <Form.Control type="text" rows={3} name="product_description" value={formData.product_description} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="unit_price">
              <Form.Label>Unit Price:</Form.Label>
              <Form.Control type="number" name="unit_price" value={formData.unit_price} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="total_price">
              <Form.Label>Total amount:</Form.Label>
              <Form.Control type="number" name="total_price" value={formData.total_price} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="tax">
              <Form.Label>Tax rate:</Form.Label>
              <Form.Control type="number" name="tax" value={formData.tax} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Form.Group controlId="payment_terms">
              <Form.Label>Payment terms:</Form.Label>
              <Form.Control type="textarea" name="payment_terms" value={formData.payment_terms} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="special_instructions">
              <Form.Label>Special instructions:</Form.Label>
              <Form.Control type="textarea" name="special_instructions" value={formData.special_instructions} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="delivery_terms">
              <Form.Label>Delivery Terms:</Form.Label>
              <Form.Control type="textarea" rows={3} name="delivery_terms" value={formData.delivery_terms} onChange={handleChange} />
            </Form.Group>
          </Col>
          {/* <Col md={3}>
            <Form.Group controlId="confirmed">
              <Form.Check type="checkbox" name="confirmed" label="Confirmed" checked={formData.confirmed} onChange={handleChange} />
            </Form.Group>
          </Col> */}
        </Row>
        <hr />
        <Button style={{background:'#001b40', width: '200px'}} className='btn btn-sm text-white'  type="submit">Create</Button>
      </Form>
    </div>
  );
}

export default PurchaseOrderForm;
