import React, { useState, useEffect } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import supplierImg from '../images/supplier1.jpeg';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';

const SupplierInsurance = () => {
    const [user, setUser] = useState({});
    const authToken = Cookies.get('authToken');
    const baseUrl = BASE_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/auth/user/`, {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                });
                const userData = response.data;
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (authToken) {
            fetchUserData();
        }
    }, [authToken, baseUrl]);

    const containerStyle = {
        backgroundColor: '#F29F67',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const supplierProfile = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
    };

    const profilePicStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        marginRight: '20px',
        overflow: 'hidden',
    };

    const profileImg = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const columnStyle = {
        flexBasis: '100%',
        marginBottom: '10px',
        marginLeft:'2rem'
    };

    const profileColumnStyle = {
        flexBasis: '100%',
        marginBottom: '10px',
        marginLeft:''
    };

    const dotsIconStyle = {
        fontSize: '24px',
        cursor: 'pointer',
        top: 0,
        right: '5px',

    };

    const containerWithDotsStyle = {
        position: '',
        marginBottom: '50px',
        marginLeft: '50px',

    };

    return (
        <div className='main-container' style={{ minHeight: '80vh' }}>
            <div className='container-fluid'>
                <h2 className='mb-5'>Supplier Insurance</h2>
                <div className='row'>
                    <div className='col-md-8'>
                        <div className='text-center' style={containerStyle}>
                            <div style={supplierProfile}>
                                <div className='col-md-2'>
                                    <div style={profilePicStyle}>
                                        <img src={supplierImg} alt='Supplier' style={profileImg} />
                                    </div>
                                </div>
                                <div className='col-md-3'>
                                <div style={{ ...profileColumnStyle , flexBasis: 'auto' }}>
                                    <span>Supplier: Jane Doe</span> <br />
                                    <span>Email: marial@gmail.com</span>
                                </div>
                                </div>
                                <div className='col-md-3'>

                                <div style={{...columnStyle, flexBasis: 'auto'}}>
                                    <span>Date of Supplies: January 1, 2023</span>
                                </div>
                                </div>
                                <div className='col-md-3'>

                                <div style={{...columnStyle, flexBasis: 'auto'}}>
                                    <p>Revenue Collected: $5000</p>
                                </div>
                                   {/* More actions */}
                          
                                </div>
                                <div style={containerWithDotsStyle}>
                                <HiDotsHorizontal style={dotsIconStyle} />
                            </div>
                        </div>
                            </div>
                         
                    </div>
                    <div className='col-md-4'>
                        iuhduihui dkhjbui ui guib b iuhduihui dkhjbui ui guib b iuhduihui dkhjbui ui guib b iuhduihui dkhjbui ui guib b iuhduihui dkhjbui ui guib b
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierInsurance;
