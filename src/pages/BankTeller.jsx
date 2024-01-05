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
      const response = await fetch(`${baseUrl}/api/breeder-code/search-payment-by-code/?payment_code=${paymentCode}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
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

  const formatPaymentInitiationDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <div className='main-container' style={{minHeight:'85vh'}}>

      <h4>Bank Teller Dashboard</h4>
      <Container>
        <Row>
          <Col md={10}>
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
                  <hr />
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Form>
                {error && <p className="text-danger">{error}</p>}
                {paymentData && (
                  <div>
                    <hr />
                    <h4>Payment Details</h4>
                    <hr />
                    <Row>
                      <Col>
                        <p>Status: {paymentData.status}</p>
                        <p>Abattoir: {paymentData.breeder_trade.abattoir}</p>
                        <p>Id Number: {paymentData.breeder_trade.id_number}</p>
                        <p>Breed: {paymentData.breeder_trade.breed}</p>
                        <p>Price: Kes {paymentData.breeder_trade.price}</p>
                        <p>Reference: {paymentData.breeder_trade.reference}</p>
                      </Col>
                      <Col>
                        <p>Breeder Market: {paymentData.breeder_trade.breeder_market}</p>
                        <p>Breeder Community: {paymentData.breeder_trade.breeder_community}</p>
                        <p>Breeder Head of Family: {paymentData.breeder_trade.breeder_head_of_family}</p>
                        <p>Breeder Full Name: {paymentData.breeder_trade.breeder_first_name} {paymentData.breeder_trade.breeder_last_name}</p>
                        <p>Account Number:  {paymentData.breeder_trade.bank_account_number}</p>
                        <p>Email:  {paymentData.breeder_trade.email}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Transaction Date: {paymentData.breeder_trade.transaction_date}</p>
                        <p>Vaccinated: {paymentData.breeder_trade.vaccinated ? 'Yes' : 'No'}</p>
                        <p>Payment Code: {paymentData.payment_code}</p>
                        <p>Payment Initiation Date: {formatPaymentInitiationDate(paymentData.payment_initiation_date)}</p>
                      </Col>
                    </Row>
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
