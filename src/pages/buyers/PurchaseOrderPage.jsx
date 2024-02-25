import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from 'react-bootstrap';

function PurchaseOrderPDF({ formData }) {
  const generatePurchaseOrderPDF = () => {
    // Generate purchase order PDF logic here
    const doc = new jsPDF();
    // Add content to the PDF document using formData
    // For example:
    doc.text(`Seller: ${formData.seller}`, 10, 10);
    doc.text(`Trader Name: ${formData.trader_name}`, 10, 20);
    console.log('form data', formData)
    // Add more content as needed
    return doc;
  };

  const handleDownloadPDF = () => {
    const pdf = generatePurchaseOrderPDF();
    pdf.save('purchase_order.pdf');
  };

  return (
    <div className='main-container' style={{ minHeight: '85vh' }}>
      <h5 className='text-center'>Purchase Order Confirmation</h5>
      <hr />
      <div className='p-4 m-3' style={{ background: '#F9FAFB', color: '#666666', fontSize: '14px', border: 'none' }}>
        <Button className='btn btn-sm text-white' style={{ background: '#001b40', width: '200px' }} onClick={handleDownloadPDF}>
          Download Purchase Order
        </Button>
      </div>
    </div>
  );
}

function PurchaseOrderForm({ orderId }) {
  const baseUrl = BASE_URL;
  const [formData, setFormData] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/purchase-orders/${orderId}/`);
        setFormData(response.data);
        console.log('response', response)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (orderId) {
      fetchData();
    }
  }, [baseUrl, orderId]);

  const handleConfirm = async () => {
    try {
      // Perform confirmation logic here
      // For demonstration purposes, let's assume the confirmation is successful
      // You should update this with your actual confirmation logic
      history.push(`/purchase-order/${orderId}`); // Redirect to the page with the generated purchase order
    } catch (error) {
      console.error('Error confirming quotation:', error);
      // Handle error
    }
  };

  if (!formData) {
    return null; // Render nothing if formData is not available yet
  }

  return (
    <div className='main-container' style={{minHeight:'80vh'}}><h1>Purchase Order </h1>
    <PurchaseOrderPDF formData={formData} />
    </div>
  );
}

export default PurchaseOrderForm;
