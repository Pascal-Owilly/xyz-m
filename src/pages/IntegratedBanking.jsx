import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { HiBell, HiCube, HiCurrencyDollar, HiExclamation, HiChartBar } from 'react-icons/hi';

const InventoryTransactionCard = ({ title, icon, amount, percentage }) => {
  return (
    <Col md={6}>
      <Card style={{ marginBottom: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <div className="row align-items-center mb-2 d-flex">
            <div className="col-8">
              <h2 className="d-flex align-items-center mb-0">
                {amount}
              </h2>
            </div>
            <div className="col-4 text-right">
              <span>{percentage}% <i className="fa fa-arrow-up"></i></span>
            </div>
          </div>
          <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
            <div className="progress-bar" role="progressbar" data-width={`${percentage}%`} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" style={{ width: `${percentage}%` }}></div>
          </div>
        </Card.Body>
        <Card.Footer style={{ fontSize: '1rem', fontWeight: 'bold', backgroundColor: 'linear-gradient(to right, green, green)' }}>
          {icon} {title}
        </Card.Footer>
      </Card>
    </Col>
  );
};

const InventoryManagement = () => {
  // Sample data for transactions
  const transactions = [
    { title: 'New Orders', icon: <HiCube />, amount: 3243, percentage: 12.5 },
    { title: 'Banking Transactions', icon: <HiCurrencyDollar />, amount: 584, percentage: 8.3 },
    { title: 'Cataloging Live Deals', icon: <HiExclamation />, amount: 125, percentage: 5.2 },
    { title: 'Management of Deals', icon: <HiCube />, amount: 790, percentage: 15.9 },
    { title: 'Financed and Paid-off Deals', icon: <HiChartBar />, amount: 432, percentage: 20.1 },
  ];

  return (
    <div className='main-container'>
      <h4 className='mb-2' style={{ fontSize: '1.5rem' }}>
        Banking Transactions
      </h4>
      <Row>
        {transactions.map((transaction, index) => (
          <InventoryTransactionCard key={index} {...transaction} />
        ))}
      </Row>
    </div>
  );
};

export default InventoryManagement;
