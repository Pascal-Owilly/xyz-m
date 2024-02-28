import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaTimes } from 'react-icons/fa';
import { useNavigate,useParams } from 'react-router-dom';
import defaultIng from '../../../images/profile.webp';

const BreaderInfo = () => {
  const navigate = useNavigate();
  const baseUrl = BASE_URL;
  const { buyerId } = useParams();
  const [breaderData, setBreaderData] = useState({});
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/buyers/${buyerId}/`)
        setBreaderData(response.data);
        console.log('buyer info', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) {
      fetchData();
    }
  }, [buyerId]);

 
  return (
    <div className='' style={{
      background: 'rgb(248, 250, 251)', 
      color: '#111',
      padding: '5px',
      minHeight: '100vh',
    }}>
    <div className='main-container' style={{
    width: '100%',
    backgroundColor: 'rgb(249, 250, 251)', // Corrected syntax for rgb
    color: 'rgb(153, 153, 153)' // Corrected syntax for rgb
  }}>
    <div 
    
  >
    <div className='container'>
      <h2 className=' ' style={{color:'#999999'}}>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', textTransform:'capitalize' }}>{breaderData.full_name}'s profile</td>

      </h2>


      <div className='row mt-4' >
  
      <div className='col-md-4'>
     

      <img src={defaultIng} className='img img-rounded'  alt="Profile" />
    </div>
    <div className='col-md-8'>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '8px',
          padding: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          // marginTop:'10vh'

        }}
      >
        <div style={{ display: '', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              {/* Profile Name */}

              {/* Role */}
                      </div>
<table  style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd', borderRadius: '5px' }}>
          <tbody>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Joined on:</td>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{breaderData.formatted_created_at}</td>
    </tr>
    <tr style={{ backgroundColor: '#f2f2f2' }}>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Company name:</td>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{breaderData.formatted_created_at}</td>
    </tr>
           <tr>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email:</td>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}></td>
    </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>First Name:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Last Name:</td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{}</td>
            </tr>
  
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Country:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}></td>
            </tr>

          </tbody>
        </table>
      </div>
        </div>
    </div>
      </div>
    </div>
   
  </div> 
  </div>
  );
};

export default BreaderInfo;
