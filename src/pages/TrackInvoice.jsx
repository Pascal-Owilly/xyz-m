// InvoiceDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const InvoiceDetails = () => {
  const { invoiceNumber } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        // Fetch detailed invoice information based on the invoice number
        const response = await axios.get(`${BASE_URL}/api/generate-invoice/${invoiceNumber}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setInvoiceDetails(response.data);
        setLoading(false);
        console.log('Invoice response data', response.data)
      } catch (error) {
        setLoading(false);
        console.error('Error fetching invoice details:', error);
      }
    };

    fetchInvoiceDetails();  
  }, [invoiceNumber]);

  return (
    <div className="main-container" style={{ minHeight: '85vh' }}>
      <h4 className="mb-4">Invoice Details</h4>
      {loading ? (
        <div className="text-center mt-5">Loading invoice details...</div>
      ) : (
        <Card>
          <Card.Body>
            <Card.Title>Invoice Number: {invoiceDetails.invoice_number}</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Date</td>
                  <td>{invoiceDetails.invoice_date}</td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>{invoiceDetails.due_date}</td>
                </tr>
                {/* Add more details as needed */}
              </tbody>
            </Table>
            <Button variant="primary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default InvoiceDetails;
