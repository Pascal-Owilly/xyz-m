import React, { useState } from 'react';
import { Row, Col, Card, Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const InventoryTransactionCard = () => {
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const fetchBreederData = async (userId) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Error fetching breeder data');
      }
    } catch (error) {
      console.error('Error fetching breeder data:', error);
      throw new Error('Error fetching breeder data');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/breeder-code/search-payment-by-code/?payment_code=${paymentCode}`);
      const data = await response.json();

      if (response.ok) {
        // Fetch breeder data
        const breederData = await fetchBreederData(data.breeder);
        setPaymentData({ ...data, breederData });
        setError(null);
      } else {
        setPaymentData(null);
        setError(data.error || 'Error searching for payment data');
      }
    } catch (error) {
      console.error('Error searching for payment data:', error);
      setPaymentData(null);
      setError('Error searching for payment data');
    }
  };

  return (
    <div className='main-container'>
      <Container>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <h3>Search Payment by Code</h3>
                <Form>
                  <Form.Group controlId="paymentCode">
                    <Form.Label>Payment Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter payment code"
                      value={paymentCode}
                      onChange={(e) => setPaymentCode(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Form>
                {error && <p className="text-danger">{error}</p>}
                {paymentData && (
                  <div>
                    <h4>Payment Details</h4>
                    <p>Status: {paymentData.status}</p>
                    <p>Breeder Details:</p>
                    <ul>
                      <li>Breeder Market: {paymentData.breederData.breeder_market}</li>
                      <li>Breeder Community: {paymentData.breederData.breeder_community}</li>
                      {/* Include other breeder details as needed */}
                    </ul>
                    {/* Include other payment details as needed */}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InventoryTransactionCard;
