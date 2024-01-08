import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const NotFoundMessage = () => (
  <div className="text-center mt-5">
    <HiOutlineExclamationCircle size={50} color="red" />
    <h3 className="mt-3">No inventory found</h3>
    <p className="text-muted">Sorry, but it seems that the inventory is empty or the breed parts are not found.</p>
  </div>
);

export default NotFoundMessage;
