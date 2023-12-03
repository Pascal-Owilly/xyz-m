import React, { useEffect } from 'react';
import { useSupplies } from '../../../src/SuppliesContext';

const SuppliedBreedsSingleUser = () => {
  const { suppliesData } = useSupplies();

  useEffect(() => {
    console.log('Supplies Data in SuppliedBreedsSingleUser:', suppliesData);
  }, [suppliesData]);

  if (!suppliesData) {
    return (
      <div className='main-container'>
        <p>No data available</p>
      </div>
    );
  }

  const tableStyle = {
    // width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333',
    width: '40%',
  };

  const valueStyle = {
    // width: '60%',
  };

  return (
    <div className='main-container' style={{ textAlign: 'left', marginBottom: '20px' }}>
      <h2>Supplied Breads to the Abattoir</h2>
      <table style={tableStyle}>
        <tbody>
         
          <tr>
            <td style={tdStyle}><span style={labelStyle}> Date Supplied:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{new Date(suppliesData.transaction_date).toLocaleString()}</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Name of breed:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.animal_name}</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Breads Supplied:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.breads_supplied}</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Bread Weight:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.goat_weight} kg</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Vaccinated:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.vaccinated ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Community:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.community}</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Market:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.market}</td>
          </tr>
          <tr>
            <td style={tdStyle}><span style={labelStyle}>Head of Family:</span></td>
            <td style={{ ...tdStyle, ...valueStyle }}>{suppliesData.head_of_family}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SuppliedBreedsSingleUser;
