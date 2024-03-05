import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';

const RemoveConfirmationForm = () => {
  const [confirmationData, setConfirmationData] = useState([]);
  const [confirmedIds, setConfirmedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const baseUrl = BASE_URL;

  useEffect(() => {
    const fetchConfirmationData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/slaughtered-list`);
        setConfirmationData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching confirmation data:', error);
      }
    };

    fetchConfirmationData();
  }, [baseUrl]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = confirmationData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleConfirmStatus = async (id) => {
    const shouldConfirm = window.confirm("Are you sure you want to confirm the removal of this item from the inventory?");
    if (shouldConfirm) {
      try {
        await axios.patch(`${baseUrl}/api/slaughtered-list/${id}/`, { confirm: true });
        setConfirmedIds([...confirmedIds, id]);
      } catch (error) {
        console.error('Error confirming status:', error);
      }
    }
  };

  return (
    <div className='main-container' style={{minHeight:'85vh'}}>
      <h5 style={{ color: '#666666' }}>Confirmation Status for inventory item removal</h5>
      <hr />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Breed</th>
            <th>Quantity</th>
            <th>Control center</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id} style={{ backgroundColor: item.confirm ? 'lightgreen' : (confirmedIds.includes(item.id) ? 'lightgreen' : '') }}>
              <td>{index + 1}</td>
              <td>{item.slaughter_date}</td>
              <td>{item.breed}</td>

              <td>{item.quantity}</td>
              <td>{item.control_center_name}</td>

              <td>{item.confirm ? 'Confirmed' : 'Pending'}</td>
              <td>
                {!item.confirm && (
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => handleConfirmStatus(item.id)}
                    disabled={confirmedIds.includes(item.id)}
                  >
                    Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="pagination">
        {Array.from({ length: Math.ceil(confirmationData.length / itemsPerPage) }, (_, i) => (
          <li key={i} className="page-item">
            <button onClick={() => paginate(i + 1)} className="page-link">
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemoveConfirmationForm;
