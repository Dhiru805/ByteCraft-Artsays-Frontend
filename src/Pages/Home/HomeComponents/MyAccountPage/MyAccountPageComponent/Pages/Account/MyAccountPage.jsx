import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AccountSidebar from '../../MyAccountSidebar';

const headingMap = {
  'personal-info': 'Personal Information',
  'my-orders': 'My Orders',
  'manage-address': 'Manage Address',
  'payment-method': 'Payment Method',
  'password-manager': 'Password Manager',
  'account-verification': 'Account Verification',
  'social-media-promotion': 'Social Media Promotion',
  'custom-request': 'Custom Request',
  'notification-preferences': 'Notification and Preferences',
  'security-agreements': 'Account Security and Agreements',
  'logout': 'Logout',
};

export const AccountPage = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const path = pathname === '/my-account' ? 'personal-info' : pathname.split('/').pop();
  const heading = headingMap[path] || 'My Account';

  return (
    <>
      {/* Top Section */}
      <div className="h-[300px] w-full bg-[#E8E8E8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-zinc-900">{heading}</h2>
          <p className="text-sm text-gray-500 mt-4">Home &gt; {heading}</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <AccountSidebar />
        <div className="md:col-span-3 bg-white p-6 rounded shadow">
          <Outlet />
        </div>
      </div>
    </>
  );
};
