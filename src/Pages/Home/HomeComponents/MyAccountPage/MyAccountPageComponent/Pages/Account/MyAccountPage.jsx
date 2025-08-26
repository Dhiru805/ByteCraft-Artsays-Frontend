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

  'track-your-order': 'Track Your Order',
  'wishlist': 'Wishlist',
  'check-out': 'Checkout',
  'my-cart': 'MyCart',
  'order-completed': 'Order Completed',
};

export const AccountPage = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const path = pathname === '/my-account' ? 'my-account' : pathname.split('/').pop();
  const heading = headingMap[path] || 'My Account';

  const isTrackOrder = path === 'track-your-order';
  const isWishlist = path === 'wishlist';
  const isCheckOut = path === 'check-out';
  const isMyCart = path === 'my-cart';
  const isOrderCompleted = path === 'order-completed';

  return (
    <>
      {/* Top Section */}
      <div className="h-[300px] w-full px-4 sm:px-12 md:px-20 lg:px-[5rem] bg-[#E8E8E8] flex items-center justify-center">
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
      {!(isTrackOrder || isWishlist || isOrderCompleted || isMyCart || isCheckOut) ? (
        <div className="w-full max-w-[1464px] mx-auto px-4 sm:px-8 md:px-12 lg:px-[116px] py-10 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-[40px] bg-white overflow-x-hidden">
            <div className="hidden lg:block w-full lg:w-[300px]">
            <AccountSidebar />
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1464px] mx-auto px-4 sm:px-8 md:px-12 lg:px-[116px] py-10 bg-white overflow-x-hidden">
          <Outlet />
        </div>
      )}
    </>
  );
};
