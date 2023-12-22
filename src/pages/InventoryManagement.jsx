import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../pages/auth/config';
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

              <Card.Title className=' mb-3' style={{ color: '#A9A9A9', fontSize: '1rem', marginBottom: '1rem' }}>Inventory Information</Card.Title>
              <h2 style={{ fontSize: '1.5rem', color: '#3498db', fontWeight: 'bold' }}>
                Total Breeds in the Yard: <span style={{ color: 'green' }}>{inventoryData.totalBreeds}</span>
              </h2>
              <hr />
              <Row>
                <Col md={6}>
                  <h4 className='mb-2' style={{ fontSize: '1.5rem' }}>Total By Categories</h4>
                  <ul>
                    {Object.entries(inventoryData.breedTotals).map(([breed, total]) => (
                      <li key={breed} style={{ fontSize: '1.2rem' }}>{capitalizeFirstLetter(breed)}: {total}</li>
                    ))}
                  </ul>
                </Col>
                <Col md={6}>
                  <h4 style={{ fontSize: '1.5rem' }}>Slaughtered History</h4>
                  <ul>
                    <li style={{ fontSize: '1.2rem' }}>Total Slaughtered count: {inventoryData.totalSlaughtered}</li>
                    <li style={{ fontSize: '1.2rem' }}>Total breed parts category in warehouse: {inventoryData.inWarehouse}</li>
                    {/* <li style={{ fontSize: '1.2rem' }}>Quantity of Breeds Supplied: {inventoryData.quantitySupplied}</li> */}
                  </ul>
                </Col>
              </Row>
              <Col className='mb-2' md={12}>
                <hr />
                <h4 className='mb-4 text-center' style={{ fontSize: '1.5rem' }}>Breed Parts in Warehouse</h4>
              </Col>
              <Row>
                {Object.entries(inventoryData.breedPartsInWarehouse).map(([breed, parts]) => (
                  <Col key={breed} md={3}>
                    <Card style={{ marginBottom: '1.5rem' }}>
                      <Card.Header style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{capitalizeFirstLetter(breed)}</Card.Header>
                      <Card.Body>
                        <ul>
                        <li className='mb-2' style={{ fontSize: '1.2rem', fontFamily:'verdana', fontWeight:'bold' }}>Export Parts:</li>
                          {Object.entries(parts)
                            .filter(([partName, details]) => details.some(part => part.saleType === 'export_cut'))
                            .map(([partName, details]) => (
                              <li key={partName} style={{ fontSize: '1.2rem' }}>
                                {capitalizeFirstLetter(partName)}: {details.reduce((acc, part) => part.saleType === 'export_cut' ? acc + part.quantity : acc, 0)}
                              </li>
                            ))}
                            <hr />
                          <li className='mb-2'  style={{ fontSize: '1.2rem', fontFamily:'verdana', fontWeight:'bold' }}>Local Sale Parts:</li>
                          {Object.entries(parts)
                            .filter(([partName, details]) => details.some(part => part.saleType === 'local_sale'))
                            .map(([partName, details]) => (
                              <li key={partName} style={{ fontSize: '1.2rem' }}>
                                {capitalizeFirstLetter(partName)}: {details.reduce((acc, part) => part.saleType === 'local_sale' ? acc + part.quantity : acc, 0)}
                              </li>
                            ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
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
