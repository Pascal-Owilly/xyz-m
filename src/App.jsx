import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/auth/Registration';
import Login from './pages/auth/Login';
import Footer from './pages/Footer';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import SlaughterhouseDashboard from './pages/SlaughterHouseDashboard';
import InventoryManagement from './pages/InventoryManagement';
import AdministrationDashboard from './pages/AdministrationDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ExportHandlingDashboard from './pages/ExportHandlingDashboard';
import IntegratedBanking from './pages/IntegratedBanking';

const App = () => {
  return (
    <Router>
      <div className="wrapper">
<Home />
        <Routes>
        {/* Authentication */}
          <Route path="/" element={<Home />} /> 
          <Route path="/register" element={<Registration />} /> 
          <Route path="/login" element={<Login />} /> 
          {/* Dashboards */}
          <Route path="/admin_dashboard" element={<AdministrationDashboard />} /> 
          <Route path="/buyer_dashboard" element={<BuyerDashboard />} /> 
          <Route path="/supplier_dashboard" element={<SupplierDashboard />} /> 
          <Route path="/slaughterhouse-dashboard" element={<SlaughterhouseDashboard />} /> 
          <Route path="/employee_dashboard" element={<EmployeeDashboard />} /> 
          <Route path="/integrated_banking" element={<ExportHandlingDashboard />} /> 
          <Route path="/export_handling_dashboard" element={<IntegratedBanking />} /> 
          {/* Inventory */}
          <Route path="/inventory-dashboard" element={<InventoryManagement />} /> 
        </Routes>
      </div>
      <Footer  />

    </Router>
  );
}

export default App;
