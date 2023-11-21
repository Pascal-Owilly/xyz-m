import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/auth/Registration';
import Login from './pages/auth/Login';
import Footer from './pages/Footer';


const App = () => {
  return (
    <Router>
      <div className="wrapper">

        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="register" element={<Registration />} /> 
          <Route path="login" element={<Login />} /> 
        </Routes>

      </div>
      <Footer  />
    </Router>
  );
}

export default App;
