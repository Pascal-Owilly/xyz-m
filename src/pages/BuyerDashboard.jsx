// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const BuyerInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState([]);
  const [invoiceTracking, setInvoiceTracking] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([])
  const [productCatalog, setProductCatalog] = useState([])

  // Fetch invoice data when the component mounts
  useEffect(() => {
    setLoading(true);
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');

      if (!accessToken) {
        navigate('/'); // Redirect to the home page if no access token is detected
        return;
      }

      // Fetch invoices related to the logged-in user
      const response = await axios.get(`${BASE_URL}/api/generate-invoice/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setInvoiceData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching invoice data:', error);
    }
  };

  const handleTrackInvoice = (invoiceNumber) => {
    // Redirect to the tracking page with the selected invoice number
    navigate(`/track-invoice/${invoiceNumber}`);
  };

  return (
    <div className='main-container' style={{minHeight:'85vh'}}>
      <h4>Buyer Invoices</h4>
      {loading ? (
        <div className="text-center mt-5">Loading invoices...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((invoice) => (
              <tr key={invoice.invoice_number}>
                <td>{invoice.invoice_number}</td>
                <td>{invoice.invoice_date}</td>
                <td>{invoice.due_date}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleTrackInvoice(invoice.invoice_number)}
                  >
                    Track Invoice
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Order History Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Order History</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Tracking Information</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                  <td>{order.trackingInfo}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Invoice Tracking Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Invoice Tracking</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Invoice Number</th> {/* Add this line */}
                <th>Order ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceTracking.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.invoiceNumber}</td> {/* Add this line */}
                  <td>{invoice.orderID}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>{invoice.date}</td>
                  <td>
                    <Button variant="primary" href={invoice.downloadLink} target="_blank" rel="noopener noreferrer">
                      Download Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

       {/* Transaction History Section */}
       <Card className="mb-4">
        <Card.Body>
          <Card.Title>Transaction History</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Product Catalog Section */}
      <Card>
        <Card.Body>
          <Card.Title>Product Catalog</Card.Title>
          <Row>
            {productCatalog.map(product => (
              <Col key={product.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
                    <Card.Text>${product.price.toFixed(2)}</Card.Text>
                    {/* Add additional product details or actions */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BuyerInvoice;
