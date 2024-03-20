import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../pages/auth/config';
import Cookies from 'js-cookie';
import { Card, Modal, Button, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(Cookies.get('authToken'));
  const baseUrl = BASE_URL;
  const [itemsReferencePerPage] = useState(3);

  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const handleReferenceClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

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

  const [currentReferencePage, setCurrentReferencePage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [inventoryData, setInventoryData] = useState({
    totalBreeds: 0,
    totalSlaughtered: 0,
    inWarehouse: 0,
    status: null,
    quantitySupplied: 0,
    breedTotals: {},
    breedPartsInWarehouse: {},
  });

  const [compareWeight, setCompareWeight] = useState([]);

  useEffect(() => {
    
    const fetchInventoryData = async () => {

      try {
        const accessToken = Cookies.get('accessToken');
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };

        
        const [breederTradeResponse, breederTotalsResponse, slaughteredDataResponse, partTotalsCountResponse, breedSalesResponse, breedCutResponse, compareWeightResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/breader-trade-to-seller/`, { headers }),
          axios.get(`${baseUrl}/api/breeder_totals/`, { headers }),
          axios.get(`${baseUrl}/api/all-breeder_totals/`, { headers }),
          axios.get(`${baseUrl}/api/slaughtered-list/`, { headers }),
          axios.get(`${baseUrl}/api/part_totals_count/`, { headers }),
          axios.get(`${baseUrl}/api/inventory-breed-sales/`, { headers }),
          axios.get(`${baseUrl}/api/breed-cut/`, { headers }),
          axios.get(`${baseUrl}/api/compare-weight-loss-after-slaughter/`, { headers }),
        ]);

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

        setCompareWeight(compareWeightResponse.data);
        setLoading(false);
        console.log('trades', breederTradeResponse)

      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setLoading(false);

      }
    };

    fetchInventoryData();
  }, [authToken, baseUrl]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Logic for displaying breeds
  const indexOfLastBreed = currentPage * itemsPerPage;
  const indexOfFirstBreed = indexOfLastBreed - itemsPerPage;
  const currentBreeds = Object.entries(inventoryData.breedTotals).slice(indexOfFirstBreed, indexOfLastBreed);

  // Logic for displaying compare weight
  const indexOfLastItem = currentReferencePage * itemsReferencePerPage;
  const indexOfFirstItem = indexOfLastItem - itemsReferencePerPage;
  const currentItems = compareWeight.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateReference = (pageNumber) => setCurrentReferencePage(pageNumber);

  return (
    <div className='main-container container-fluid'>
      <h5 style={{color:'#001b40'}}>Inventory information from all control centers
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div></div> {/* Empty div to push the link to the far right */}
  <a href="/inventory-record-forms" className='mx-1' style={{ color: '#3498db', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
    <i className="dw dw-edit" style={{ marginLeft: '5px' }}></i> &nbsp; Update inventory
  </a>
</div>
      </h5>
      <hr />
      <div className='container-fluid' style={{ minHeight: '', color:'#666666' }}>
        <div className='row'>
        <div className='col-md-4 card p-3' style={{ minHeight: '65vh', color: '#001b42', padding: '5px', display: 'flex', flexDirection: 'column', justifyContent: '', alignItems: '', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5' }}>
  {loading ? (
    <div>Loading...</div>
  ) : (
    <ul className='list-unstyled' style={{ minHeight: '60vh', padding: 0 }}> {/* Add padding: 0 */}
      <li className='mb-2 text-secondary' style={{ fontSize: '1rem', color: '#001b40', fontWeight: 'bold', padding: 0 }}> Raw materials by Category</li>
      
      {currentBreeds.length > 0 ? (
        currentBreeds.map(([breed, total]) => {
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
                      <p className=" mb-0" style={{ backgroundColor: '', color: '#666666', fontSize: '16px', fontWeight: 'bold' }}>{capitalizeFirstLetter(breed)}</p>
                    </div>
                    <div className="col-3">
                      <span className="mb-0" style={{ backgroundColor: '', color: '#666666', fontSize: '15px' }}>{total}</span>
                    </div>
                    <div className="col-3">
                      <span className="mb-0" style={{ backgroundColor: '', color: '#666666', fontSize: '15px' }}>{percentage.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-4">
                    </div>
                  </div>
                  <div className="progress " data-height="4" style={{ background: '', height: '8px' }}>
                    <div className={`progress-bar l-bg-${getColorClass(breed)}`} role="progressbar" style={{ width: percentage + "%", background: '#001b42', height: '8px' }} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <li className='mt-5' style={{ textAlign: 'center', color: '#666666', minHeight:'40vh' }}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }} />
          Your inventory is empty
        </li>
      )}

<nav style={{ color: '#666666', fontSize: '10px', marginTop: '20px' }}>
    <ul className="pagination justify-content-center">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
      </li>
      <li className="page-item">
        <span className="page-link">{currentPage}</span>
      </li>
      <li className={`page-item ${currentBreeds.length < itemsPerPage ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
      </li>
    </ul>
  </nav>
    </ul>
    
  )}
</div>

          <div className='col-md-8'>
            {/* <div className='container-fluid' style={{width:'100%'}}> */}
              <div className='row mt-2 mb-2'>
                <div className='col-sm-8 col-md-5 text-center my-auto'>
                <div className='card' style={{ minHeight: '20vh', color:'#001b42', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5' }}>
                <h6 style={{ marginBottom: '10px' }}>Cummulative raw materials available</h6> 
                <h2>{inventoryData.totalBreeds}</h2>
              </div>

              </div>

                <div className='col-sm-8 col-md-5 text-center my-auto'>
              <a href='/warehouse'>

                <div className='card' style={{ minHeight: '20vh', color:'#001b42', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5' }}>
                <h6 style={{ marginBottom: '10px' }}>Finished products
                <i className="icon-copy bi bi-arrow-90deg-right mx-3" style={{ fontSize: '20px', fontWeight: 900, marginRight: '3px', color: '#001b42' }}></i>
            </h6> 
              </div>
</a>

              </div>

            </div>  
            {/* </div> */}
            <Card className="p-3" style={{ minHeight: '20vh', color:'#001b42', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f5f5f5' }}>
            <Table striped responsive bordered hover style={{ color: '#666666', fontSize: '12px' }}>
  <thead className=" text-white" style={{backgroundColor:'#001b42'}}>
    <tr style={{fontSize: '12px' }}>
      <th style={{  fontSize: '12px' }}>#</th>
      <th style={{  fontSize: '12px' }}>Tag number</th>
      <th style={{  fontSize: '12px' }}>Breed</th>
      <th style={{  fontSize: '12px' }}>Trade Weight</th>
      <th style={{  fontSize: '12px' }}>Total Cut Weight</th>
      <th style={{  fontSize: '12px' }}>% Weight Loss</th>

      <th style={{  fontSize: '12px' }}>Classification</th>

    </tr>
  </thead>
  <tbody style={{ color: '#666666', fontSize: '10px' }}>
    {currentItems.map((item, index) => (
      <tr key={index}>
        <td  style={{ color: '#666666', fontSize: '12px' }}>{item.id}</td>
        <td  style={{ color: '#666666', fontSize: '12px', cursor: 'pointer' }} onClick={() => handleReferenceClick(item)} >{item.reference}</td>
        <td style={{ color: '#666666', fontSize: '12px' }}>{item.breed}</td>
        <td style={{ color: '#666666', fontSize: '12px' }}>{item.trade_weight} Kg</td>
        <td style={{ color: '#666666', fontSize: '12px' }}>{item.total_cut_weight} </td>
        <td style={{ color: '#666666', fontSize: '12px' }}>{item.weight_loss_percentage} </td>

        <td style={{ color: '#666666', fontSize: '12px' }}>{item.classification} </td>

      </tr>
    ))}
  </tbody>
</Table>
              <Pagination style={{ color: '#666666', fontSize: '10px' }}>
                <Pagination.Prev onClick={() => paginateReference(currentReferencePage - 1)} disabled={currentReferencePage === 1} />
                {[...Array(Math.ceil(compareWeight.length / itemsPerPage))].map((_, index) => (
                  <Pagination.Item key={index} active={index + 1 === currentReferencePage} onClick={() => paginateReference(index + 1)}>
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => paginateReference(currentReferencePage + 1)} disabled={currentItems.length < itemsPerPage} />
              </Pagination>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
