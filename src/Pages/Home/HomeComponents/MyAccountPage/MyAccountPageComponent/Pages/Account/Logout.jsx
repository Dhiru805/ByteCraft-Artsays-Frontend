import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 

    // localStorage.clear(); 

    navigate('/');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button
        onClick={handleLogout}
        className="bg-[#5F3E2D] text-white px-6 py-2 rounded"
      >
        Yes, Logout
      </button>
    </div>
  );
};

export default Logout;
