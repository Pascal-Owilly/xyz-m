import React from 'react';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar } from 'react-icons/hi';

const cardStyle = {
  minHeight: '170px',
  margin: '0',
  padding: '1.7rem 1.2rem',
  border: 'none',
  borderRadius: '0',
  color: 'rgba(0,0,0,1)',
  letterSpacing: '.05rem',
  fontFamily: "'Oswald', sans-serif",
  boxShadow: '0 0 21px rgba(0,0,0,.27)',
};

const textContainerStyle = {
  marginLeft: '-3rem',
  zIndex: '1',
};

const headingStyle = {
  fontSize: '1.5rem',
  fontWeight: '300',
  textTransform: 'uppercase',
};

const paragraphStyle = {
  fontSize: '.7rem',
  fontFamily: "'Open Sans', sans-serif",
  letterSpacing: '0rem',
  marginTop: '33px',
  opacity: '0',
  color: 'rgba(255,255,255,1)',
};

const linkStyle = {
  zIndex: '3',
  fontSize: '.7rem',
  color: 'rgba(0,0,0,1)',
  marginLeft: '1rem',
  position: 'relative',
  bottom: '-.5rem',
  textTransform: 'uppercase',
};

const iconContainerStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  bottom: '0',
  right: '0',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

const iconStyle = {
  position: 'relative',
  right: '-50%',
  top: '60%',
  fontSize: '12rem',
  lineHeight: '0',
  opacity: '.2',
  color: 'rgba(255,255,255,1)',
  zIndex: '0',
};

const Home = () => {
  return (
    <div className="container h-100 main-container" style={{minHeight:'85vh'}}>
      <h2>Export Handling</h2>
      <hr />

      <div>
        <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <HiBell size={20} color='white' />
        </div>

        <div className="row align-middle p-2 m-1">
          <div className="col-md-6 col-lg-4 column">
            <div className='m-2' style={{ ...cardStyle, background: 'linear-gradient(170deg, #01E4F8 0%, #1D3EDE 100%)' }}>
              <div style={textContainerStyle}>
                <h1 style={headingStyle}>Warehouse Management</h1>
                <p style={paragraphStyle}>Efficient management of warehouse operations.</p>
              </div>
              <a href="#" style={linkStyle}>more</a>
              <div style={iconContainerStyle}>
                <HiCube size={30} style={iconStyle} />
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 column">
            <div style={{ ...cardStyle, background: 'linear-gradient(170deg, #B4EC51 0%, #429321 100%)' }}>
              <div style={textContainerStyle}>
                <h1 style={headingStyle}>Shipping and Logistics</h1>
                <p style={paragraphStyle}>Effective handling of shipping and logistics processes.</p>
              </div>
              <a href="#" style={linkStyle}>more</a>
              <div style={iconContainerStyle}>
                <HiCurrencyDollar size={30} style={iconStyle} />
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 column">
            <div style={{ ...cardStyle, background: 'linear-gradient(170deg, #C86DD7 0%, #3023AE 100%)' }}>
              <div style={textContainerStyle}>
                <h1 style={headingStyle}>Export Order Fulfillment</h1>
                <p style={paragraphStyle}>Efficient fulfillment of export orders.</p>
              </div>
              <a href="#" style={linkStyle}>more</a>
              <div style={iconContainerStyle}>
                <HiExclamation size={30} style={iconStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
