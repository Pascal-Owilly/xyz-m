import React from 'react';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';

const Home = () => {
    return (
        <>
            <div className='main-container'>
                <h2 className='text-center'>XYZ Abattoir Employees Dashboard</h2>

                <div>
                    {/* Flash message */}
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <p className='text-center'>Good morning, Achienge!</p>
                    </div>

                    {/* Notifications */}
                    <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <HiBell size={20} color='white' />
                    </div>

                    {/* Status for received goat supplies */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Status for received goat supplies
                    </button>

                    {/* Alerts for pending actions in the abattoir */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCurrencyDollar className='mr-2' /> Alerts for pending actions in the abattoir
                    </button>

                    {/* Goat weight in the inventory */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiExclamation className='mr-2' /> Goat weight in the inventory
                    </button>

                    {/* Track payments */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Track payments
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;
