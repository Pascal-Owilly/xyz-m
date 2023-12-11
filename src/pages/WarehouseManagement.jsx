// WarehouseDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

const WarehouseDashboard = () => {
  const baseUrl = BASE_URL;
  const authToken = Cookies.get('authToken');

  const [inventoryBreedData, setInventoryBreedData] = useState({
    partName: 'ribs',
    saleType: 'export_cut',
    status: 'in_the_warehouse',
    quantity: 20,
  });

  const handleInventoryInputChange = (e) => {
    setInventoryBreedData({
      ...inventoryBreedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the current inventory data
      const currentInventoryResponse = await axios.get(
        `${baseUrl}/api/inventory-breed-sales/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log('breed sales data', currentInventoryResponse);

      // Get the existing inventory item for the submitted partName
      const existingInventoryItem = currentInventoryResponse.data.find(
        (item) => item.partName === inventoryData.partName
      );

      if (existingInventoryItem) {
        // Calculate the new quantity in inventory after the sale
        const newQuantity = existingInventoryItem.quantity - inventoryData.quantity;

        // Submit the updated data back to the server
        const updatedInventoryResponse = await axios.post(
          `${baseUrl}/api/inventory-breed-sales/`,
          {
            ...existingInventoryItem,
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        console.log('Updated Inventory response:', updatedInventoryResponse.data);

        // Clear the form fields after successful submission
        setInventoryData({
          partName: 'ribs',
          saleType: 'export_cut',
          status: 'in_the_warehouse',
          quantity: null,
        });
      }
    } catch (error) {
      console.error('Error making sale and updating inventory:', error.response);
    }
  };

  const navigate = useNavigate();

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
    <div className='main-container warehouse-container' style={{minHeight:'85vh', background:'lightgreen'}}>
                <h2 className='mb-2'>The XYZ Warehouse</h2>

        <div className='container'>
            <div className='row'>
                <div className='col-md-4'>
                <div className="card border-success mb-3 mt-4" style={{ maxWidth: '18rem' }}>
        <div className="card-header bg-success text-white">Buyer Invoice Generator</div>
        <div className="card-body">
        <form onSubmit={handleInventorySubmit}>
            <div className="mb-3">
              <label className="form-label">Part Name:</label>
              <select
                className="form-select"
                name="partName"
                value={inventoryData.partName}
                onChange={handleInventoryInputChange}
                required
              >
                <option value="ribs">Ribs</option>
                <option value="thighs">Thighs</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sale Type:</label>
              <select
                className="form-select"
                name="saleType"
                value={inventoryData.saleType}
                onChange={handleInventoryInputChange}
                required
              >
                <option value="export_cut">Export Cut</option>
                <option value="local_sale">Local Sale Cut</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Status:</label>
              <select
                className="form-select"
                name="status"
                value={inventoryData.status}
                onChange={handleInventoryInputChange}
                required
              >
                <option value="in_the_warehouse">In the Warehouse</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={inventoryData.quantity}
                onChange={handleInventoryInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Generate Invoice</button>
          </form>
        </div>
      </div>
                </div>
                <div className='col-md-8'>
                <Card className="" style={{ background: 'transparent' }}>
              <Card.Body>

                <Card.Title className='text-center mb-3' style={{ color: '#A9A9A9', fontSize: '2rem', marginBottom: '1rem' }}>
                <h4 className='mb-4' style={{ fontSize: '1.5rem' }}>Breed Parts in Warehouse</h4>

                </Card.Title>
                
                <Row>
                  <Col md={12} className=''>
                    {Object.entries(inventoryData.breedPartsInWarehouse).map(([breed, parts]) => (
                      <Col key={breed} md={12}>
                        <Card style={{ marginBottom: '1.5rem' }}>
                          <Card.Header style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{capitalizeFirstLetter(breed)}</Card.Header>
                          <Card.Body>
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
                          </Card.Body>
                        </Card>
                      </Col>
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

export default WarehouseDashboard;
