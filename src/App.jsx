import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SuppliesProvider } from './SuppliesContext';
import Home from './pages/Home';
import Registration2 from './pages/auth/Registration';
import RegisterBuyer from './pages/auth/BuyerRegister';
import BuyerRegidterSuccess from './pages/auth/BuyerRegisterSuccess';
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import Footer from './pages/Footer';
import BuyerDashboard from './pages/BuyerDashboard';
import BreederPayment from './pages/breaders/BreederPayment';
import BreederDashboard from './pages/BreederDashboard';
import BreederMoreInfo from './pages/breaders/BreederMoreInfo'

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
import BreaderInfo from './pages/breaders/BreaderInfo';
import SuppliedBreedsSingleUser from './pages/breaders/SuppliedBreedsSingleUser';
import MpesaResponse from './pages/payment/MpesaResponse';
import FormSubmissionSuccess from './pages/forms/FormSubmissionSuccess';
// import SuperuserRoute from './pages/auth/SuperuserRole'; // Import the HOC
import Unauthorized from './pages/auth/Unauthorised';
import Inventory from './pages/inventory/Inventory';
import BankTeller from './pages/BankTeller';
import CustomerService from './pages/CustomerService'; 
// Export handling

import DispatchAndShipping from './pages/export_handling/DispatchAndShipping';
import Arrival from './pages/export_handling/Arrival';

import TrackInvoice from './pages/TrackInvoice';
import Buyer from './pages/buyers/Buyer';
import Sellers from './pages/seller_mng/Sellers';
import Quotation from './pages/seller_mng/Quotation';
import QuotationList from './pages/seller_mng/QuotationList';
import QuotationSuccess from './pages/seller_mng/QuotationSuccess';
import QuotationConfirmation from './pages/buyers/QuotationConfirmation';

import PurchaseOrderPage from './pages/buyers/PurchaseOrderPage';
import PurchaseOrderPageSeller from './pages/seller_mng/PurchaseOrdersSeller';
import ActiveOrders from './pages/breaders/ActiveOrders';
import DocumentScanner from './pages/DocScanner';

// Control centere
import ControlCenters from './pages/control_centers/ControlCenters';
import ControlCentersSingleTrader from './pages/control_centers/ControlCentersSingleTrader';
import InventoryCT from './pages/control_centers/Inventory';
import RegisterCollateralManager from './pages/auth/RegisterCollateralManager';
import RegisterBreeder from './pages/auth/RegisterBreeder';
import RegisterSeller from './pages/auth/RegisterSeller';

import SellersList from './pages/bank/SelersList';
import BuyersList from './pages/bank/BuyersList';
import CollateralManagersList from './pages/bank/CollateramManagersList';
import InventoryList from './pages/bank/Inventorylist';
import BuyersInfo from './pages/bank/BuyersInfo';
import CollateralManagerInfo from './pages/bank/CollateralManagerInfo';
import SellersInfo from './pages/bank/SellersInfo';
import ConfirmItemRemoval from './pages/ConfirmItemRemoval'

const App = () => {
  return (
    <Router>
      <SuppliesProvider>
        <div className="wrapper">
          <Home />
          <Routes>
            {/* Authentication */}
            <Route path="/" element={<HomeContent />} />
            <Route path="/register" element={<Registration2 />} />
            <Route path="/register-buyer" element={<RegisterBuyer />} />
            <Route path="/buyer-register-success" element={<BuyerRegidterSuccess />} />
            <Route path="/collateral-manager-register" element={<RegisterCollateralManager />} />
            <Route path="/supplier-register" element={<RegisterBreeder />} />
            <Route path="/register-seller" element={<RegisterSeller />} />

            <Route path="/login" element={<Login />} />
            <Route path="/password_reset" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            {/* Dashboards */}
            <Route path="/admin_dashboard" element={<AdministrationDashboard />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Sellers */}
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/quotation-list" element={<QuotationList />} />
            <Route path="/buyer-confirmation" element={<QuotationConfirmation />} />

            <Route path="/purchase-order-seller" element={<PurchaseOrderPageSeller />} />

          {/* Doc scanner */}
          <Route path="/document-scanner" element={<DocumentScanner />} />


            {/* Buyers */}

        <Route path="/purchase-order/:id"  element={<PurchaseOrderPage />}  />

            <Route path="/invoice_tracking" element={<BuyerDashboard />} />
            <Route path="/buyer_dashboard" element={<Buyer />} />

            <Route path="/supplier_dashboard" element={<BreederDashboard />} />
            <Route path="/inventory-record-forms" element={<SlaughterhouseDashboard />} />
            <Route path="/employee_dashboard" element={<EmployeeDashboard />} />
            <Route path="/integrated_banking" element={<IntegratedBanking />} />
            <Route path="/export_handling_dashboard" element={<ExportHandlingDashboard />} />
            {/* iNVOICE FORMS */}
            <Route path="/breeder_invoices" element={<InvoiceForms />} />
            <Route path="/track-invoice/:invoiceNumber" element={<TrackInvoice />} />

            {/* Payments */}
            <Route path="/breeder-payment" element={<BreederPayment />} />
          
            {/* Inventory */}
            <Route path="/inventory-dashboard" element={<InventoryManagement />} />
            <Route path="/warehouse-dashboard" element={<WarehouseManagement />} />
            <Route path="/bank_teller_dashboard" element={<BankTeller />} />
            <Route path="/customer_service_dashboard" element={<CustomerService />} />

            {/* Breaders */}
            <Route path="/breaders" element={<BreaderData />} />
            <Route path="/breader-info/:breaderId" element={<BreaderInfo />} />
            <Route path="/supplied-breeds" element={<SuppliedBreedsSingleUser />} />
            <Route path="/breader-more-info/:breaderId" element={<BreederMoreInfo />} />
            <Route path="/active-purchase-orders" element={<ActiveOrders />} />

            <Route path="/submission-successful" element={<FormSubmissionSuccess />} />
            {/* Payment */}
            {/* <Route path="/payment/response" element={<MpesaResponse paymentResponse={response} />} /> */}
            <Route path="/mpesa-payment-response" element={<MpesaResponse />} />

            {/* Inventory */}
 
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/warehouse" element={<WarehouseManagement />} />

            {/* Export handling */}
            <Route path="/dispatch_and_shipping" element={<DispatchAndShipping />} />
            <Route path="/arrival" element={<Arrival />} />

            {/* Control centers */}
            <Route path="/control-centers-list" element={<ControlCenters />} />
            <Route path="/control-centers-single-trader" element={<ControlCentersSingleTrader />} />
            <Route path="/control-centers-inventory" element={<InventoryCT />} />

            <Route path="/quotation-submission-success" element={<QuotationSuccess />} />

            {/* Bank list details */}
            <Route path="/sellers-list" element={<SellersList />} />
            <Route path="/buyers-list" element={<BuyersList />} />
            <Route path="/collateral-managers-list" element={<CollateralManagersList />} />
            <Route path="/Inventory-list" element={<InventoryList />} />

            <Route path="/buyer-info/:buyerId" element={<BuyersInfo />} />
            <Route path="/colateral-manager-info/:managerId" element={<CollateralManagerInfo />} />
            <Route path="/seller-info/:sellerId" element={<SellersInfo />} />
            <Route path="/inventory-confirmation" element={<ConfirmItemRemoval />} />

          </Routes>
        </div>
      </SuppliesProvider>
      <Footer />
    </Router>
  );
}

export default App;
