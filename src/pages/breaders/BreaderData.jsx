// Breader.js
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Breader = () => {
  const baseUrl = BASE_URL;
  const [breaderData, setBreaderData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed
  const authToken = Cookies.get('authToken');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = breaderData && breaderData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(breaderData?.length / itemsPerPage);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/breader-trade`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        setBreaderData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setBreaderData([]); // Set an empty array in case of an error
      }
    };

    fetchData();
}, [authToken]);



  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="main-container" style={{minHeight:'85vh'}}>
      {breaderData && (
        <div>
          <h2 className='mb-4'>Breaders List</h2>
          <div className="row">
          {currentItems && currentItems.map((breader) => (
  <div key={breader.id} className="col-lg-3 mb-4">
    <Link
   to={`/breader-info/${breader.id}`}
   style={{ textDecoration: 'none', color: 'inherit' }}
>

      <div className="card" style={{ borderRadius: '10px' }}>

        <div className="card-body">
          <h5 className="card-title">{breader.community} Community</h5>
          <div className="card-text">
            <strong>Breader:</strong> {breader.breader}
          </div>

          <div className="card-text">
            <strong>Market:</strong> {breader.market}
          </div>
          <p className="card-text" style={{float: 'right', backgroundColor: breader.isPaid ? 'green' : 'blue', color:'white', padding:'5px', borderRadius:'30px', fontSize:'11px', fontWeight:'800', width:'auto' }}>
          <span className='mx'> {breader.isPaid ? 'Paid' : 'Payment Pending'}</span>
          </p>
          
          {/* Add more information as needed */}
        </div>
      </div>
    </Link>
  </div>
))}

          </div>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className='bg-light text-primary mx-1'
                  key={page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Breader;
