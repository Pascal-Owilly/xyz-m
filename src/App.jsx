import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SuppliesProvider } from './SuppliesContext'; // Import the SuppliesProvider
import Home from './pages/Home';
import Registration from './pages/auth/Registration';
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import Footer from './pages/Footer';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import SlaughterhouseDashboard from './pages/SlaughterHouseDashboard';
import InventoryManagement from './pages/InventoryManagement';
import AdministrationDashboard from './pages/AdministrationDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ExportHandlingDashboard from './pages/ExportHandlingDashboard';
import IntegratedBanking from './pages/IntegratedBanking';
import WarehouseManagement from './pages/WarehouseManagement';
import HomeContent from './pages/HomeContent';
import ForgotPassword from './pages/auth/ForgotPassword';
import InvoiceForms from './pages/forms/InvoiceForm';
import BreaderData from './pages/breaders/BreaderData';
import BreaderInfo from './pages/breaders/BreaderInfo'; // Update the path accordingly
import SuppliedBreedsSingleUser from './pages/breaders/SuppliedBreedsSingleUser';
import MpesaResponse from './pages/payment/MpesaResponse';
const App = () => {

  // const response = {
  //   data: {
  //     msg: "M-Pesa payment initiated successfully",
  //     response: {
  //       CheckoutRequestID: "ws_CO_15102023102931234725276739",
  //       CustomerMessage: "Success. Request accepted for processing",
  //       MerchantRequestID: "92646-150652872-1",
  //       ResponseCode: "0",
  //       ResponseDescription: "Enter your pin to confirm payment upon reception of an Stk Push"
  //     }
  //   },
  //   status: 201,
  //   statusText: 'Created'
  // };

  return (
    <Router>
            <SuppliesProvider>

      <div className="wrapper">
<Home />
        <Routes>
        {/* Authentication */}
          <Route path="/" element={<HomeContent />} /> 
          <Route path="/register" element={<Registration />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/password_reset" element={<ForgotPassword />} /> 
          <Route path="/profile" element={<Profile />} /> 
          {/* Dashboards */}
          <Route path="/admin_dashboard" element={<AdministrationDashboard />} /> 
          <Route path="/buyer_dashboard" element={<BuyerDashboard />} /> 
          <Route path="/supplier_dashboard" element={<SupplierDashboard />} /> 
          <Route path="/slaughterhouse-dashboard" element={<SlaughterhouseDashboard />} /> 
          <Route path="/employee_dashboard" element={<EmployeeDashboard />} /> 
          <Route path="/integrated_banking" element={<IntegratedBanking />} /> 
          <Route path="/export_handling_dashboard" element={<ExportHandlingDashboard />} /> 
          {/* iNVOICE FORMS */}
          <Route path="/invoices" element={<InvoiceForms />} /> 

          {/* Inventory */}
          <Route path="/inventory-dashboard" element={<InventoryManagement />} /> 
          <Route path="/warehouse-dashboard" element={<WarehouseManagement />} /> 

        {/* Breaders */}
        <Route path="/breaders" element={<BreaderData />} /> 
        <Route path="/breader-info/:breaderId" element={<BreaderInfo />} />
        <Route path="/supplied-breeds" element={<SuppliedBreedsSingleUser />} />

        {/* Payment */}
        {/* <Route path="/payment/response" element={<MpesaResponse paymentResponse={response} />} />  */}
        <Route path="/mpesa-payment-response" element={<MpesaResponse />} />                  
                 
        </Routes>
      </div>
      </SuppliesProvider>

      <Footer  />

    </Router>
  );
}

export default App;
