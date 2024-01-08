import React, { useState } from 'react';
import { Row, Col, Card, Container, Form, Button } from 'react-bootstrap';
import { BASE_URL } from './auth/config';

const InventoryTransactionCard = () => {
  const baseUrl = BASE_URL;
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/abattoir-payments-to-breeders/search-payment-by-code/search_payment_by_code/?payment_code=${paymentCode}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
        setError(null);
      } else {
        setPaymentData(null);
        setError(data.error || 'Invaid payment code');
      }
    } catch (error) {
      console.error('Error searching for payment data:', error);
      setPaymentData(null);
      setError('Error searching for payment data');
    }
  };

  const formatPaymentInitiationDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
   <div className='main-container' style={{ minHeight: '85vh', backgroundColor: '#f0f8ff' }}>

  <h4 className="text-primary mb-4">Bank Teller Dashboard</h4>
  <Container>
    <Row>
      <Col md={10}>
        <Card>
          <Card.Body>
            <h3 className="text-success mb-4">Search Payment by Code</h3>
            <Form>
              <Form.Group controlId="paymentCode">
                <Form.Label className="text-primary">Payment Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter payment code"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value)}
                />
              </Form.Group>
              <hr className="bg-primary" />
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </Form>
            {error && <p className="text-danger">{error}</p>}
            {paymentData && (
              <Card className="mt-4 shadow">
                <Card.Body>
                  <h4 className="text-primary mb-3">Payment Details</h4>
                  <Row>
                    <Col md={6}>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Abattoir: {paymentData.breeder_trade.abattoir}</p>
                      <p  style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}><span style={{fontWeight:'bold'}} className="text-success" >ID Number: </span>{paymentData.breeder_trade.id_number}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Breed: {paymentData.breeder_trade.breed}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Price: Kes {paymentData.breeder_trade.price}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Reference: {paymentData.breeder_trade.reference}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Transaction Date: {paymentData.breeder_trade.transaction_date}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Vaccinated: {paymentData.breeder_trade.vaccinated ? 'Yes' : 'No'}</p>
                    </Col>
                    <Col md={6}>
                      <h5 className="text-primary mb-3">Breeder Details</h5>

                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Market: {paymentData.breeder_trade.breeder_market}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Community: {paymentData.breeder_trade.breeder_community}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Head of Family: {paymentData.breeder_trade.breeder_head_of_family}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}> <span className="text-success"  style={{fontWeight:'bold'}}>Full Name:</span> {paymentData.breeder_trade.breeder_first_name} {paymentData.breeder_trade.breeder_last_name}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>
                        <span className="text-success" style={{ fontWeight: 'bolder' }}>Account Number:</span> {paymentData.breeder_trade.bank_account_number}
                      </p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Email:  {paymentData.breeder_trade.email}</p>
                    </Col>
                  </Row>
                  <hr className="bg-primary" />
                  <h4 className="text-primary mb-3">Additional Payment Details</h4>
                  <Row>
                    <Col md={6}>
                      <p><span className="text-primary" style={{ fontWeight: 'bold' }}>Payment Code:</span> {paymentData.payment_code}</p>
                      <p><span className="text-primary" style={{ fontWeight: 'bold' }}>Initiation Date:</span> {formatPaymentInitiationDate(paymentData.payment_initiation_date)}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
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
