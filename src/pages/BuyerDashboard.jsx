import React from "react";

const BuyerDashboard = () => {

    return(
        <>
        <ul id="accordion-menu">
        <li className="dropdown">
          <a href="javascript:;" className="dropdown-toggle">
            <span className="micon bi bi-house"></span
            ><span className="mtext">Home</span>
          </a>
          <ul className="submenu">
            <li><a href="index.html">Supplier Dashboard</a></li>
            <li><a href="index2.html">Buyer Dashboard </a></li>
            <li><a href="index3.html">Bank Dashboard </a></li>
          </ul>
        </li>

        <li>
          <a href="calendar.html" className="dropdown-toggle no-arrow">
            <span className="micon bi bi-calendar4-week"></span
            ><span className="mtext">Calendar</span>
          </a>
        </li>

        <li>
          <a href="invoice.html" className="dropdown-toggle no-arrow">
            <span className="micon bi bi-receipt-cutoff"></span
            ><span className="mtext">Invoice</span>
          </a>
        </li>
        <li>
          <div className="dropdown-divider"></div>
        </li>
      </ul>
      </>
    )
}

export default BuyerDashboard;