import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

const WarehouseDashboard = () => {
  const baseUrl = BASE_URL;
  const authToken = Cookies.get('authToken');
  const navigate = useNavigate();

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
      const currentInventoryResponse = await axios.get(`${baseUrl}/api/inventory-breed-sales/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      // Get the existing inventory item for the submitted partName
      const existingInventoryItem = currentInventoryResponse.data.find(
        (item) => item.partName === inventoryBreedData.partName
      );

      if (existingInventoryItem) {
        // Calculate the new quantity in inventory after the sale
        const newQuantity = existingInventoryItem.quantity - inventoryBreedData.quantity;

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
        setInventoryBreedData({
          partName: 'ribs',
          saleType: 'export_cut',
          status: 'in_the_warehouse',
          quantity: 20, // Set the default quantity or you can set it to null
        });
      }
    } catch (error) {
      console.error('Error making sale and updating inventory:', error.response);
    }
  };

  const [invoiceData, setInvoiceData] = useState({
    partName: 'ribs',
    saleType: 'export_cut',
    quantity: 20,
    unitPrice: 0,
    clientName: '',
    clientEmail: '',
  });
  const [inventoryData, setInventoryData] = useState({
    totalBreeds: 0,
    totalSlaughtered: 0,
    inWarehouse: 0,
    status: null,
    quantitySupplied: 0,
    breedTotals: {},
    breedPartsInWarehouse: {},
  });
  const handleInvoiceInputChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleGenerateInvoice = async () => {
    // Validate the invoice data (add your own validation logic)
  
    // Calculate total price
    const totalPrice = invoiceData.quantity * invoiceData.unitPrice;
  
    // Prepare data for the invoice
    const invoiceDetails = {
      partName: invoiceData.partName,
      saleType: invoiceData.saleType,
      quantity: invoiceData.quantity,
      unitPrice: invoiceData.unitPrice,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      totalPrice: totalPrice,
    };
  
    try {
      // Make a POST request to your Django API endpoint for invoice generation
      const response = await axios.post(`${baseUrl}/generate-invoice/`, invoiceDetails, {
        headers: {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Handle the response as needed
      console.log('Invoice generation response:', response.data);
  
      // Optionally, you can update the state or perform any other actions upon successful invoice generation
    } catch (error) {
      console.error('Error generating invoice:', error.response);
      // Handle the error, show a message, etc.
    }
  };
  

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    // Fetch initial data and update state
  }, [authToken, baseUrl]);

  return (
    <div className='main-container warehouse-container' style={{ minHeight: '85vh', background: 'rgb(249, 250, 251' }}>
      <h2 className='mb-2'>The XYZ Warehouse</h2>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <div className="card border-success mb-3 mt-4" style={{ maxWidth: '18rem' }}>
              <div className="card-header bg-success text-white">Buyer Invoice Generator</div>
              <div className="card-body">
                <form onSubmit={handleInventorySubmit}>
                  {/* Inventory Form Fields */}
                  {/* ... */}
                  <button type="submit" className="btn btn-success">
                    Make Sale
                  </button>
                </form>
                <hr />
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleGenerateInvoice();
                }}>
            <div className="mb-3">
              <label className="form-label">Part Name:</label>
              <select
                style={{background:'#001f33', padding:'0.2rem', borderRadius:'30px'}}
                className="form-select mx-2"
                name="partName"
                value={invoiceData.partName}
                onChange={handleInvoiceInputChange}
                required
              >
                <option className='mx-1' value="ribs">Ribs</option>
                <option className='mx-1' value="thighs">Thighs</option>
                <option className='mx-1' value="loin">Loin</option>
                <option className='mx-1' value="thighs">Thighs</option>
                <option className='mx-1' value="shoulder">Shoulder</option>
                <option className='mx-1' value="shanks">Shanks</option>
                <option className='mx-1' value="organ_meat">Organ Meat</option>
                <option className='mx-1' value="intestines">Intestines</option>
                <option className='mx-1' value="tripe">Tripe</option>
                <option className='mx-1' value="sweetbreads">sweetbreads</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sale Type:</label>
              <select
                style={{background:'#001f33', padding:'0.2rem', borderRadius:'30px'}}
                className="form-select mx-2"
                name="saleType"
                value={invoiceData.saleType}
                onChange={handleInvoiceInputChange}
                required
              >
                <option value="export_cut">Export Cut</option>
                <option value="local_sale">Local Sale Cut</option>
                {/* Add more options as needed */}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={invoiceData.quantity}
                onChange={handleInvoiceInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Unit Price:</label>
              <input
                type="number"
                className="form-control"
                name="unitPrice"
                value={invoiceData.unitPrice}
                onChange={handleInvoiceInputChange}
                required
              />
            </div>

            <div className="mb-3">
    <label className="form-label">Client Name:</label>
    <input
      type="text"
      className="form-control"
      name="clientName"
      value={invoiceData.clientName}
      onChange={handleInvoiceInputChange}
      required
    />
  </div>
  <div className="mb-3">
    <label className="form-label">Client Email:</label>
    <input
      type="email"
      className="form-control"
      name="clientEmail"
      value={invoiceData.clientEmail}
      onChange={handleInvoiceInputChange}
      required
    />
  </div>

            <button type="submit" className="btn btn-success">Generate Invoice</button>
          </form>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
          <Card className="weather-card" style={{ background: 'transparent' }}>
            <Card.Body>

              <Card.Title className='text-center mb-3' style={{ color: '#A9A9A9', fontSize: '1.5rem', marginBottom: '1rem' }}>Breed parts in the warehouse</Card.Title>

              <Row>
                {Object.entries(inventoryData.breedPartsInWarehouse).map(([breed, parts]) => (
                  <Col key={breed} md={4}>
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

export default WarehouseDashboard;
