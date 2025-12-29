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
  'my-cart': 'My Cart',
  'order-completed': 'Order Completed',
};

export const AccountPage = () => {
  const location = useLocation();
  // const pathname = location.pathname;
  // const path = pathname === '/my-account' ? 'my-account' : pathname.split('/').pop();
  // const heading = headingMap[path] || 'My Account';
const pathname = location.pathname;
const section = pathname.split('/')[2] || 'my-account';
const normalizedSection = section.split('?')[0];
const heading = headingMap[normalizedSection] || 'My Account';

  // const isTrackOrder = path === 'track-your-order';
  // const isWishlist = path === 'wishlist';
  // const isCheckOut = path === 'check-out';
  // const isMyCart = path === 'my-cart';
  // const isOrderCompleted = path === 'order-completed';
const isTrackOrder = pathname.startsWith('/my-account/track-your-order');
const isWishlist = pathname.startsWith('/my-account/wishlist');
const isCheckOut = pathname.startsWith('/my-account/check-out');
const isMyCart = pathname.startsWith('/my-account/my-cart');
const isOrderCompleted = pathname.startsWith('/my-account/order-completed');


  return (
    <>
      {/* Top Section */}
      <div className="h-full w-full p-4 md:p-12 bg-[#E8E8E8] flex items-center justify-center">
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
        <div className="w-full max-w-[1440px] mx-auto gap-6 bg-white grid grid-cols-8 py-4 px-3 md:px-0">
            <div className="hidden lg:block w-full col-span-2">
            <AccountSidebar />
          </div>
          <div className="w-full col-span-8 md:col-span-6">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1440px] mx-auto gap-6 bg-white py-4 px-3 md:px-0">
          <Outlet />
        </div>
      )}
    </>
  );
};
