import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  return (
  <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 space-y-6 text-gray-800">
    <h2 className="text-2xl font-semibold text-gray-950">Logout</h2>
    <p className="text-gray-800 text-[16px] font-medium">
      Are you sure you want to logout?
    </p>
    <button
      onClick={handleLogout}
      className="bg-[#6F4D34] hover:bg-[#5a3e29] transition text-white px-6 py-2 rounded-full font-medium"
    >
      Yes, Logout
    </button>
  </div>
);

};

export default Logout;
