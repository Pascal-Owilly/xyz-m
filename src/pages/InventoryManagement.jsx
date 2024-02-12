import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../pages/auth/config';
import Cookies from 'js-cookie';
import { Card, Row, Col, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(Cookies.get('authToken'));
  const baseUrl = BASE_URL;

  const getColorClass = (breed) => {
    switch (breed.toLowerCase()) {
      case 'cherry':
        return 'cherry';
      case 'blue-dark':
        return 'blue-dark';
      case 'green-dark':
        return 'green-dark';
      case 'orange-dark':
        return 'orange-dark';
      default:
        return 'cyan'; // Default color
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const breedsPerPage = 4;

  // Function to handle opening modal and setting selected data
  const handleCardClick = (breed) => {
    // Retrieve the details of the clicked breed from inventoryData
    const breedDetails = inventoryData.breedTotals[breed];
    
    // Log the details to the console
    console.log('Breed Details:', breedDetails);
    
    // Show the modal if needed
    setShowModal(true);
  };

  const [inventoryData, setInventoryData] = useState({
    totalBreeds: 0,
    totalSlaughtered: 0,
    inWarehouse: 0,
    status: null,
    quantitySupplied: 0,
    breedTotals: {},
    breedPartsInWarehouse: {},
  });

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const headers = {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'application/json',
        };

        const [breederTradeResponse, breederTotalsResponse, slaughteredDataResponse, partTotalsCountResponse, breedSalesResponse, breedCutResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/breader-trade/`, { headers }),
          axios.get(`${baseUrl}/api/breeder_totals/`, { headers }),
          axios.get(`${baseUrl}/api/slaughtered-list/`, { headers }),
          axios.get(`${baseUrl}/api/part_totals_count/`, { headers }),
          axios.get(`${baseUrl}/api/inventory-breed-sales/`, { headers }),
          axios.get(`${baseUrl}/api/breed-cut/`, { headers }),
        ]);

        console.log('breederTradeResponse:', breederTradeResponse);
        console.log('breederTotalsResponse:', breederTotalsResponse);
        console.log('slaughteredDataResponse:', slaughteredDataResponse);
        console.log('partTotalsCountResponse:', partTotalsCountResponse);
        console.log('breedSalesResponse:', breedSalesResponse);
        console.log('breedCutResponse:', breedCutResponse);

        const breedTotalsMap = breederTotalsResponse.data.reduce((acc, item) => {
          const breed = item.breed.toLowerCase();
          acc[breed] = (acc[breed] || 0) + item.total_breed_supply;
          return acc;
        }, {});

        const breedPartsMap = breedCutResponse.data.reduce((acc, item) => {
          const breed = item.breed.toLowerCase();
          const partName = item.part_name.toLowerCase();
          const saleType = item.sale_type.toLowerCase();
          if (!acc[breed]) {
            acc[breed] = {};
          }
          if (!acc[breed][partName]) {
            acc[breed][partName] = [];
          }
          acc[breed][partName].push({ quantity: item.quantity, saleType });
          return acc;
        }, {});

        setInventoryData({
          totalBreeds: Object.values(breedTotalsMap).reduce((acc, total) => acc + total, 0) || 0,
          totalSlaughtered: slaughteredDataResponse.data.length || 0,
          inWarehouse: breederTradeResponse.data.length || 0,
          quantitySupplied: breedSalesResponse.data.reduce((acc, item) => acc + item.quantity, 0) || 0,
          breedTotals: breedTotalsMap,
          breedPartsInWarehouse: breedPartsMap,
        });
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, [authToken, baseUrl]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Logic for displaying breeds
  const indexOfLastBreed = currentPage * breedsPerPage;
  const indexOfFirstBreed = indexOfLastBreed - breedsPerPage;
  const currentBreeds = Object.entries(inventoryData.breedTotals).slice(indexOfFirstBreed, indexOfLastBreed);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='main-container container-fluid'>
      <div className='container-fluid' style={{ minHeight: '75vh', color:'#666666' }}>
        <div className='row'>
        <div className='col-md-4 card p-3' style={{ minHeight: '75vh' }}>
          <ul className='list-unstyled'>
            <li className='mb-2 text-secondary' style={{ fontSize: '.8rem', color:'#001b40' }}>Total By Category</li>
            <ul className="list-unstyled">
              {currentBreeds.map(([breed, total]) => {
                const percentage = (total / inventoryData.totalBreeds) * 100;
                return (
                  <li key={breed} className="mb-4">
                    <div className={` l-bg-${getColorClass(breed)}`} onClick={() => handleCardClick(breed)}>
                      <div className="car-statistic-3 ">
                        <div className="card-icon card-icon-large">
                          <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div className="mb-">
                        </div>
                        <div className="row align-items-center d-fle">
                          <div className="col-4">
                            <p className=" mb-0" style={{backgroundColor:'', color:'#666666', fontSize:'12px', fontWeight:'bold'}}>{capitalizeFirstLetter(breed)}</p>
                          </div>
                          <div className="col-3">
                            <span className="mb-0" style={{backgroundColor:'', color:'#666666', fontSize:'12px'}}>{total}</span>
                          </div>
                          <div className="col-3">
                            <span className="mb-0" style={{backgroundColor:'', color:'#666666', fontSize:'12px'}}>{percentage.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="row align-items-center mb-2 d-flex">
                          <div className="col-4">
                          </div>
                        </div>
                        <div className="progress " data-height="4" style={{  background:'', height:'8px'}}>
                          <div className={`progress-bar l-bg-${getColorClass(breed)}`} role="progressbar" style={{ width: percentage + "%", background:'#00142b', height:'8px' }} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ul>
          <ul>
            {/* Additional information */}
          </ul>
          <ul>
            {/* Additional rows for finished products */}
          </ul>
          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
              </li>
              <li className="page-item">
                <span className="page-link">{currentPage}</span>
              </li>
              <li className={`page-item ${currentBreeds.length < breedsPerPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
        <div className='col-md-2'>
            <div className='card' style={{minHeight:'75vh'}}>

            </div>
          </div>
          <div className='col-md-6'>
            <div className='card' style={{minHeight:'75vh'}}>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InventoryPage;
