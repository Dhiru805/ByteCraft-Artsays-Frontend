import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import AccountSidebar from '../../MyAccountSidebar';

const headingMap = {
  'personal-info': 'My Account',
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

  'track-your-order': 'Track Your Order'
};

export const AccountPage = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const path = pathname === '/my-account' ? 'my-account' : pathname.split('/').pop();
  const heading = headingMap[path] || 'My Account';

  const isTrackOrder = path === 'track-your-order';

  return (
    <>
      {/* Top Section */}
      <div className="h-[300px] w-full px-[5rem] bg-[#E8E8E8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-zinc-900">{heading}</h2>
          <p className="text-sm text-gray-500 mt-4">
            <Link to="/" className="text-gray-500 hover:underline cursor-pointer">
              Home
            </Link> &gt; {heading}
          </p>

        </div>
      </div>

      {/* Main Layout */}
      {!isTrackOrder && (

        <div className=" w-[1440px] pt-[80px] pl-[116px] flex bg-white">
          <AccountSidebar />
          <div className="w-[1208px] pl-[40px]">
            <Outlet />
          </div>
        </div>
      )}

      {isTrackOrder && (
        <div className="pt-[80px] px-[116px] bg-white">
          <Outlet />
        </div>
      )}
    </>
  );
};
