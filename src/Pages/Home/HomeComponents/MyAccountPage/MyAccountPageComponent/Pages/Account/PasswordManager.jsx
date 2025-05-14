import React from 'react';

const PasswordManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Password Manager</h2>
      <form className="space-y-4">
        <input className="border p-2 rounded w-full" placeholder="Enter Password" type="password" />
        <input className="border p-2 rounded w-full" placeholder="Enter New Password" type="password" />
        <input className="border p-2 rounded w-full" placeholder="Confirm New Password" type="password" />
        <button className="bg-[#5F3E2D] text-white px-6 py-2 rounded">Update Password</button>
      </form>
    </div>
  );
};

export default PasswordManager;
