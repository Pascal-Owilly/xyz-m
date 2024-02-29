import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../auth/config';

const ActiveOrders = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [quotations, setQuotations] = useState([]);
  const [quotation, setQuotation] = useState([]);

  const accessToken = Cookies.get('accessToken');
  const ordersPerPage = 5;

  useEffect(() => {
    // Fetching actual data from API
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/quotations/`);
        setQuotations(response.data.filter(quotation => quotation.confirm === true)); // Filter confirmed quotations
        setLoading(false);
        console.log('all quotation', response.data);
      } catch (error) {
        console.error('Error fetching quotations:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [baseUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const refreshAccessToken = async () => {
    try {
      console.log('fetching token refresh ... ');

      const refreshToken = Cookies.get('refreshToken');

      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      Cookies.set('accessToken', newAccessToken);
      // Re-fetch quotations or any other necessary data
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  const indexOfLastQuotation = currentPage * ordersPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - ordersPerPage;
  const currentQuotations = quotations.slice(indexOfFirstQuotation, indexOfLastQuotation);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='main-container' style={{ background: '#F9FAFB', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', fontSize: '16px', color: '#333' }}>
      <hr />
      <h4 className='' style={{ marginBottom: '18px', color: '#666666' }}>Active Orders</h4>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      {currentQuotations.map((quotation) => (
  <div key={quotation.id} style={{ marginBottom: '20px', background: 'white', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
   <div className="card" style={{ backgroundColor: '#f8f9fa', padding: '1rem' }}>
      <div className="card-body">
        <table className="table table-striped table-responsive" style={{ width: '100%', border: 'none' }}>
          <thead style={{ color: '#999999' }}>
            <tr>
              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Order Number</th>
              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</th>
              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Price/Kg</th>
              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Description</th>
              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</th>
              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Collected from</th>

              <th style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ color: '#666666' }}>
            <tr>
              <td style={{ fontSize: '13px' }}>#{quotation.id}</td>
              <td style={{ fontSize: '13px' }}>{new Date(quotation.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</td>
              <td style={{ fontSize: '13px', textTransform:'capitalize' }}>{quotation.unit_price}</td>
              <td style={{ fontSize: '13px', textTransform:'capitalize' }}>{quotation.product}</td>
              <td style={{ fontSize: '13px', textTransform:'capitalize' }}>{quotation.quantity}</td>
              <td style={{ fontSize: '13px', textTransform:'capitalize' }}>{quotation.market} market</td>

              <td style={{ fontSize: '13px' }}>
                <button style={{ backgroundColor: quotation.status === 'active' ? 'green' : 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                  {quotation.status === 'active' ? 'Active' : 'Closed'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
))}
      </div>
      <nav>
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(quotations.length / ordersPerPage) }, (_, i) => i + 1)
            .map((pageNumber, index) => (
              <li key={index} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                <button onClick={() => paginate(pageNumber)} className='page-link'>
                  {pageNumber}
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default ActiveOrders;
