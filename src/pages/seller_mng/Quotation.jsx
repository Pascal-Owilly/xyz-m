import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuotationForm() {


  const navigate = useNavigate();

  const baseUrl = BASE_URL;
  const accessToken = Cookies.get('accessToken');
  const [buyers, setBuyers] = useState([]);

  const [formData, setFormData] = useState({
    buyer: null,
    product: '',
    quantity: '',
    unit_price: '',
    message: '',
    delivery_time: null,
  });

  

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/buyers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuyers(response.data);
        console.log('buyer data', response.data)
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };

    fetchBuyers();
  }, [baseUrl, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData();
      toast.success('Quotation submitted successfully! Please wait for confirmation from the buyer. Thank you', {
        position: 'top-center',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error('Failed to submit quotation. Please try again later.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const postData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const postResponse = await axios.post(`${baseUrl}/api/send-quotation/`, formData, config);
      console.log('Quotation created successfully', postResponse);
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  };

const generatePDF = () => {
  const doc = new jsPDF();
  const selectedBuyer = buyers.find(buyer => buyer.id === formData.buyer);
  if (!selectedBuyer) {
    console.error('Selected buyer not found');
    return null; // Return null if selected buyer is not found
  }
  // Header
  const header = `
  Buyer Details:
  Name: ${selectedBuyer.id} 
  Address: ${selectedBuyer.address}
  Country: ${selectedBuyer.country}
`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(header, 10, 10);

  // Body (Table)
  const { buyer, product, unit_price, quantity, delivery_time, message } = formData;
  const data = [
    ['Buyer', buyer],
    ['Product Name', product],
    ['Unit Price', unit_price],
    ['Quantity', quantity],
    ['Delivery Date', delivery_time],
    ['Additional Message', message]
  ];
  doc.autoTable({
    startY: 40,
    head: [['Field', 'Value']],
    body: data,
    theme: 'striped', // Apply striped theme
    styles: { cellPadding: 5, fontSize: 12 },
    columnStyles: { 0: { fontStyle: 'bold' } }
  });

  // Footer
  const footer = `
    Confirm: [ ] Yes, I confirm this quotation
  `;
  doc.setTextColor(0); // Reset color to black
  doc.text(footer, 10, doc.autoTable.previous.finalY + 10); // Use previous.finalY to position after the table

  // Add checkbox for confirmation
  doc.setDrawColor(0); // Black color
  doc.rect(22, doc.autoTable.previous.finalY + 15, 5, 5); // Draw the checkbox
  doc.setFontSize(12);
  doc.text("Yes, I confirm this quotation", 30, doc.autoTable.previous.finalY + 20); // Add label next to the checkbox

  return doc;
};

  

  const handleSendQuotationAsPDF = () => {
    const pdf = generatePDF();
    const pdfDataUri = pdf.output('datauristring');
    // Send the PDF to the buyer via email or any other method
    console.log('Sending PDF:', pdfDataUri);
    // You can add your logic to send the PDF here
  };

  return (
    <div className=" main-container text-secondary">
      <div className='col-md-8 p-5' style={{background:'rgb(249, 250, 251)'}}>
        <h5 className=' text-center p-3' style={{color:'#666666'}}>Product Quotation Form</h5>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="buyer" className="form-label">
                Buyer
              </label>
              <div>
                <select
                  className="form-select text-dark p-2 bg-light "
                  style={{ borderRadius: '', width: '100%', border: '1px solid #999999', opacity: 0.5 }}
                  id="buyer"
                  name="buyer"
                  value={formData.buyer}
                  onChange={handleChange}
                  required
                >
                  <option className='bg-light p-3 text-dark' value="">Select Buyer</option>
                  {buyers.map((buyer) => (
                    <option className='bg-light p-2' key={buyer.id} value={buyer.id}>
                      {buyer.full_name}
                    </option>
                  ))}
                </select>
                <small className="text-primary">
                  <a href="/register-buyer" className="text-primary">Register new buyer</a>
                </small>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="product" className="form-label">Product Name</label>
              <input type="text" className="form-control" id="product" name="product" value={formData.product} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="unit_price" className="form-label">Unit Price</label>
              <input type="number" className="form-control" id="unit_price" name="unit_price" value={formData.unit_price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="delivery_time" className="form-label">Delivery Date</label>
              <input type="date" className="form-control" id="delivery_time" name="delivery_time" value={formData.delivery_time} onChange={handleChange} min="1" required />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Additional Message</label>
            <textarea className="form-control" id="message" name="message" value={formData.message} onChange={handleChange} rows="4"></textarea>
          </div>
          <button type="button" className="btn btn-primary mb-2" style={{fontSize:'15px'}} onClick={handleSubmit}>Send Quotation as PDF</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuotationForm;
