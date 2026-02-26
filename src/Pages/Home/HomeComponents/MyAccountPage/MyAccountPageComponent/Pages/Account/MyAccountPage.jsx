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
      'support': 'Support Tickets',
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
      <div className="relative w-full h-[300px] sm:h-[250px] md:h-[300px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5C4033] via-[#4A3328] to-[#3D2920]"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B6914]/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#D4A574]/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#FFD700]/10 to-[#B8860B]/10 rounded-full blur-[150px]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#5C4033]/70 to-transparent flex items-center">
            <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
              <div className="w-full">
                <span className="inline-block px-3 py-1 bg-white text-[#000000] backdrop-blur-md rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase mb-4 animate-fade-in">
                  Account Dashboard
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                  {heading}
                </h1>
                <p className="text-sm sm:text-lg md:text-xl font-medium text-white leading-relaxed opacity-90 flex items-center gap-2">
                  <Link to="/" className="text-white/80 hover:text-white transition-colors">
                    Home
                  </Link>
                  <span className="text-white/60">/</span>
                  <span className="text-amber-300 font-medium">{heading}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      {!(isTrackOrder || isWishlist || isOrderCompleted || isMyCart || isCheckOut) ? (
        <div className="w-full max-w-[1440px] mx-auto gap-6 bg-white grid grid-cols-1 lg:grid-cols-12 py-8">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-10">
              <AccountSidebar />
            </div>
          </div>
          <div className="lg:col-span-9 px-3 md:!px-0">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1440px] mx-auto bg-white py-8 px-6 md:px-12">
          <Outlet />
        </div>
      )}
    </>
  );
};
