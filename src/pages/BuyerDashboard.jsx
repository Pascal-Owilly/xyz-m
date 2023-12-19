import React, { useState } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';

const styles = {
  invoiceContainer: {
    // backgroundColor: '#f5f5f5',
    padding: '20px',
    minHeight: '80vh',
  },
  invoiceItems: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
    overflow: 'hidden', // Hide content overflow during transition
    transition: 'height 0.3s ease-in-out', // Transition height property
  },
  tableCell: {
    border: 'none',
  },
  invoiceList: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
  },
};

const BuyerInvoice = () => {
  // Sample invoice data
  const invoices = [
    {
      invoiceNumber: 'INV-20230115',
      date: 'January 15, 2023',
      dueDate: 'February 1, 2023',
      billTo: {
        name: 'John Doe',
        address: '123 Main Street, City, State, ZIP',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
      },
      shipTo: 'Same as Bill To',
      items: [
        { title: 'Product 1', description: 'High-quality product with advanced features', quantity: 2, unitPrice: 19.99 },
        { title: 'Product 2', description: 'Top-of-the-line product with cutting-edge technology', quantity: 1, unitPrice: 29.99 },
      ],
      taxRate: 0.08,
    },

    {
        invoiceNumber: 'INV-20230115',
        date: 'January 15, 2023',
        dueDate: 'February 1, 2023',
        billTo: {
          name: 'John Doe',
          address: '123 Main Street, City, State, ZIP',
          email: 'john.doe@example.com',
          phone: '(123) 456-7890',
        },
        shipTo: 'Same as Bill To',
        items: [
          { title: 'Product 1', description: 'High-quality product with advanced features', quantity: 2, unitPrice: 19.99 },
          { title: 'Product 2', description: 'Top-of-the-line product with cutting-edge technology', quantity: 1, unitPrice: 29.99 },
        ],
        taxRate: 0.08,
      },
    // Add more invoice objects as needed
  ];

  // State to manage expanded/minimized state of invoices
  const [expandedInvoices, setExpandedInvoices] = useState({});

  const toggleInvoice = (invoiceNumber) => {
    setExpandedInvoices((prevExpanded) => ({
      ...prevExpanded,
      [invoiceNumber]: !prevExpanded[invoiceNumber],
    }));
  };

  return (
    <Container fluid className='main-container' style={{height: 'auto', backgroundColor: '#ddd'}}>
      <Row>


        {/* Column 8 (Invoice List and Details) */}
        <Col lg={8} style={styles.invoiceContainer}>
          <Container style={{ ...styles.invoiceItems, height: expandedInvoices ? 'auto' : '100%' }}>
            {/* Invoice List */}
            <ul style={styles.invoiceList}>
              {invoices.map((invoice, index) => (
                <li key={index} style={styles.listItem}>
                  <Button variant="link" onClick={() => toggleInvoice(invoice.invoiceNumber)}>
                    {expandedInvoices[invoice.invoiceNumber] ? 'Hide Invoice' : 'Show Invoice'} - {invoice.invoiceNumber}
                  </Button>
                  {expandedInvoices[invoice.invoiceNumber] && (
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td><strong>Invoice Number:</strong></td>
                          <td>{invoice.invoiceNumber}</td>
                          <td><strong>Date:</strong></td>
                          <td>{invoice.date}</td>
                        </tr>
                        <tr>
                          <td><strong>Due Date:</strong></td>
                          <td>{invoice.dueDate}</td>
                          <td colSpan="2"></td>
                        </tr>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2"></td>
                        </tr>
                        {/* Bill To */}
                        <tr>
                          <td colSpan="4">
                            <h5>Bill To:</h5>
                            <p>{invoice.billTo.name}</p>
                            <p>{invoice.billTo.address}</p>
                            <p>Email: {invoice.billTo.email}</p>
                            <p>Phone: {invoice.billTo.phone}</p>
                            <hr />
                          </td>
                        </tr>
                        {/* Ship To */}
                        <tr>
                          <td colSpan="4">
                            <h5>Ship To:</h5>
                            <p>{invoice.shipTo}</p>
                            <hr />
                          </td>
                        </tr>
                        {/* Items */}
                        <tr>
                          <td colSpan="4">
                            <h5>Items:</h5>
                            <Table>
                              <thead>
                                <tr>
                                  <th>Title</th>
                                  <th>Description</th>
                                  <th>Quantity</th>
                                  <th>Unit Price</th>
                                  <th>Total Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoice.items.map((item, itemIndex) => (
                                  <tr key={itemIndex}>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unitPrice}</td>
                                    <td>{item.quantity * item.unitPrice}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            <hr />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </Col>
                {/* Column 4 (Placeholder) */}
                <Col lg={4}>
          <div style={{  padding: '' }}>
<div>
                    {/* Flash message */}
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <p className='text-center'>Good morning, Achienge!</p>
                    </div>

                    {/* Notifications */}
                    <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <HiBell size={20} color='white' />
                    </div>

                    {/* Purchase Issuance */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Purchase Issuance
                    </button>

                    {/* Banking Transactions */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCurrencyDollar className='mr-2' /> Banking Transactions
                    </button>

                    {/* Cataloging live deals */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiExclamation className='mr-2' /> Cataloging live deals
                    </button>

                    {/* Management of deals at different stages */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Management of deals at different stages
                    </button>

                    {/* Tracking financed and paid-off deals */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', marginBottom: '10px', padding: '15px', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiChartBar className='mr-2' /> Tracking financed and paid-off deals
                    </button> 
                    </div>
                    </div>
        </Col>
      </Row>
    </Container>
    
  );
};

export default BuyerInvoice;
