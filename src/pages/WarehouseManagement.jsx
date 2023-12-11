import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const WarehouseDashboard = () => {
  const baseUrl = BASE_URL;
  const authToken = Cookies.get('authToken');

  const [inventoryData, setInventoryData] = useState({
    partName: 'ribs',
    saleType: 'export_cut',
    status: 'in_the_warehouse',
    quantity: 20,
  });

  const handleInventoryInputChange = (e) => {
    setInventoryData({
      ...inventoryData,
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
        const updatedInventoryResponse = await axios.put(
          `${baseUrl}/api/inventory-breed-sales/${existingInventoryItem.id}/`,
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
          quantity: 20,
        });
      }
    } catch (error) {
      console.error('Error making sale and updating inventory:', error);
    }
  };

  return (
    <div className='main-container warehouse-container'>
      <h2 className='text-center'>Warehouse Dashboard</h2>
      <form onSubmit={handleInventorySubmit}>
        <label>
          Part Name:
          <select
            name="partName"
            value={inventoryData.partName}
            onChange={handleInventoryInputChange}
            required
          >
            <option value="ribs">Ribs</option>
            <option value="thighs">Thighs</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <br />
        <label>
          Sale Type:
          <select
            name="saleType"
            value={inventoryData.saleType}
            onChange={handleInventoryInputChange}
            required
          >
            <option value="export_cut">Export Cut</option>
            <option value="local_sale">Local Sale Cut</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <br />
        <label>
          Status:
          <select
            name="status"
            value={inventoryData.status}
            onChange={handleInventoryInputChange}
            required
          >
            <option value="in_the_warehouse">In the Warehouse</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={inventoryData.quantity}
            onChange={handleInventoryInputChange}
            required
          />
        </label>
        <br />
        <button type="submit">Make Sale</button>
      </form>
    </div>
  );
};

export default WarehouseDashboard;
