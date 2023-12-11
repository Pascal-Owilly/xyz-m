import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(Cookies.get('authToken'));
  const baseUrl = BASE_URL;

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
        // Define headers
        const headers = {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'application/json',
        };

        // Fetch data from the provided endpoints with headers
        const [breaderTrade, breederTotals, slaughteredData, partTotalsCount, breedSales, breedCut] = await Promise.all([
          axios.get(`${baseUrl}/api/breader-trade/`, { headers }),
          axios.get(`${baseUrl}/api/breeder_totals/`, { headers }),
          axios.get(`${baseUrl}/api/slaughtered-list/`, { headers }),
          axios.get(`${baseUrl}/api/part_totals_count/`, { headers }),
          axios.get(`${baseUrl}/api/inventory-breed-sales/`, { headers }),
          axios.get(`${baseUrl}/api/breed-cut/`, { headers }),
        ]);
        console.log(slaughteredData.data)
        console.log(breedCut.data)

        // Group breederTotals data by breed
        const breedTotalsMap = breederTotals.data.reduce((acc, item) => {
          const breed = item.breed.toLowerCase();
          acc[breed] = (acc[breed] || 0) + item.total_breed_supply;
          return acc;
        }, {});

        // Group breedCut data by breed and part name
        const breedPartsMap = breedCut.data.reduce((acc, item) => {
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

        // Process the data as needed and update the state
        setInventoryData({
          totalBreeds: Object.values(breedTotalsMap).reduce((acc, total) => acc + total, 0) || 0,
          totalSlaughtered: slaughteredData.data.length || 0,
          inWarehouse: breaderTrade.data.length || 0,
          quantitySupplied: breedSales.data.reduce((acc, item) => acc + item.quantity, 0) || 0,
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

  return (
    <div className='main-container'>
      <div className='container' style={{ minHeight: '75vh' }}>
        <div className='row'>
          <div className='col-md-12'>
            <Card className="weather-card" style={{ background: 'transparent' }}>
              <Card.Body>

                <Card.Title style={{ color: '#A9A9A9', fontSize: '2rem', marginBottom: '1rem' }}>Inventory Informaion</Card.Title>
                                <h2 style={{ fontSize: '1.7rem', color: '#3498db', fontWeight: 'bold' }}>
                                      Total Breeds in the Yard: <span style={{color:'green'}}>{inventoryData.totalBreeds}</span>
                                    </h2>
                                    <hr />
                  <Row>

                  <Col md={12}>
                    <h4 className='mb-2' style={{ fontSize: '1.5rem' }}>Total In Categories</h4>
                    </Col>
                    <Col md={3} className='mx-5 mb-3'>
                    <ul>
                      {Object.entries(inventoryData.breedTotals).map(([breed, total]) => (
                        <li key={breed} style={{ fontSize: '1.2rem' }}>{capitalizeFirstLetter(breed)}: {total}</li>
                      ))}
                    </ul>
                  </Col>
                  <Col className='mb-2' md={12}>
                    <h4 style={{ fontSize: '1.5rem' }}>Slaughtered History</h4>
                    </Col>
                    <Col md={3} className='mx-5 mb-3'>
                  
                    <ul>
                      <li style={{ fontSize: '1.2rem' }}>Total Slaughtered: {inventoryData.totalSlaughtered}</li>
                      <li style={{ fontSize: '1.2rem' }}>Total breed parts category in warehouse: {inventoryData.inWarehouse}</li>
                      <li style={{ fontSize: '1.2rem' }}>Quantity of Breeds Supplied: {inventoryData.quantitySupplied}</li>
                    </ul>
                  </Col>
                  <Col className='mb-2' md={12}>
                    <h4 style={{ fontSize: '1.5rem' }}>Breed Parts in Warehouse</h4>
                    </Col>
                    <Col md={12} className='mx-5'>
                    {Object.entries(inventoryData.breedPartsInWarehouse).map(([breed, parts]) => (
                      <div key={breed} style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ fontSize: '1.3rem' }}>{capitalizeFirstLetter(breed)}:</h5>
                        <ul>
                          {Object.entries(parts).map(([partName, details]) => (
                            <li key={partName} style={{ fontSize: '1.2rem' }}>
                              {capitalizeFirstLetter(partName)} - {details.map((detail) => (
                                <span key={detail.saleType} style={{ marginRight: '1rem' }}>
                                  {detail.quantity} parts ({capitalizeFirstLetter(detail.saleType)})
                                </span>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
