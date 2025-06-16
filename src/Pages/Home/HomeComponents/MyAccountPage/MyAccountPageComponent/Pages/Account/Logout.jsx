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
    <div className="space-y-4 w-[856px]">
      <h2 className="text-2xl text-gray-950 font-semibold">Logout</h2>
      <p className='text-[#4F3E2D] text-[15px] font-semibold'>Are you sure you want to logout?</p>
      <button
        onClick={handleLogout}
        className="bg-[#6F4D34] text-white px-6 py-2 rounded-full"

      >
        Yes, Logout
      </button>
    </div>
  );
};

export default Logout;
