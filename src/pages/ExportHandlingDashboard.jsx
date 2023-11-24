import React from 'react';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';

const Home = () => {
    return (
        <>
            <div className='main-container'>
                <h2 className='text-center'> Export Handling Dashboard</h2>

                <div>
                    {/* Flash message */}
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <p className='text-center'>Good morning, Mel!</p>
                    </div>

                    {/* Notifications */}
                    <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <HiBell size={20} color='white' />
                    </div>

                    {/* Warehouse Management */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Warehouse Management
                    </button>

                    {/* Shipping and Logistics */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCurrencyDollar className='mr-2' /> Shipping and Logistics
                    </button>

                    {/* Export Order Fulfillment */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiExclamation className='mr-2' /> Export Order Fulfillment
                    </button>

                </div>
            </div>
        </>
    );
}

export default Home;
