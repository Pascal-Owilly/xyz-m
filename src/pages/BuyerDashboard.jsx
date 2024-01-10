// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const BuyerInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    </div>
  );
};

export default BuyerInvoice;
