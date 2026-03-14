import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import getAPI from '../../../../../api/getAPI';

const links = [
  { name: 'Personal Information', path: 'personal-info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: 'My Orders', path: 'my-orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { name: 'Notifications', path: 'notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { name: 'Manage Address', path: 'manage-address', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Bank Payment Details', path: 'bank-payment-details', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { name: 'Payment Method', path: 'payment-method', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { name: 'Wallet', path: 'buyer-wallet', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { name: 'Password Manager', path: 'password-manager', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { name: 'Account Verification', path: 'account-verification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'Social Media Promotion', path: 'social-media-promotion', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
    { name: 'Custom Request', path: 'custom-request', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { name: 'Support Tickets', path: 'support', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { name: 'Notification and Preferences', path: 'notification-preferences', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },

  { name: 'Account Security and Agreements', path: 'security-agreements', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'Logout', path: 'logout', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
];

const MyAccountSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const userId = localStorage.getItem('userId');

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUnread = async () => {
      try {
        const [generalRes, communityRes] = await Promise.allSettled([
          getAPI(`/api/buyer-notifications/${userId}?page=1&limit=50`, {}, false, true),
          getAPI(`/api/notifications/${userId}?page=1&limit=50`, {}, false, true),
        ]);

        let count = 0;

        if (generalRes.status === 'fulfilled' && generalRes.value?.data?.success) {
          const all = generalRes.value.data.data || [];
          count += all.filter((n) => !n.isRead).length;
        }

        setUnreadCount(count);
      } catch {}
    };

    fetchUnread();
  }, [userId]);

return (
<div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-lg shadow-gray-100/50 max-h-[calc(100vh-100px)] overflow-y-auto custom-sidebar-scroll">
<style>{`
.custom-sidebar-scroll{
scrollbar-width: none;
}
.custom-sidebar-scroll::-webkit-scrollbar {
width: 4px;
}
.custom-sidebar-scroll::-webkit-scrollbar-track {
background: transparent;
}
.custom-sidebar-scroll::-webkit-scrollbar-thumb {
background: #E5E7EB;
border-radius: 10px;
}
.custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
background: #D1D5DB;
}
`}</style>
<div className="space-y-2">
        {links.map(({ name, path, icon }) => {
          const fullPath = `/my-account/${path}`;
          const isPersonalInfo =
            path === 'personal-info' &&
            (currentPath === '/my-account' || currentPath === fullPath);

          const isActive = isPersonalInfo || currentPath === fullPath;
          const isLogout = path === 'logout';
          const isNotifications = path === 'notifications';

          return (
            <NavLink
              key={path}
              to={fullPath}
              className={`group flex items-center gap-3 w-full text-sm font-semibold text-left py-3 px-2 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-[#5C4033] text-white shadow-lg shadow-[#5C4033]/20'
                  : isLogout
                  ? 'bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : isLogout ? 'text-rose-400' : 'text-gray-400 group-hover:text-[#5C4033]'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              <span className="truncate">{name}</span>

              {isNotifications && unreadCount > 0 && (
                <span className={`ml-auto mr-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-white text-[#5C4033]' : 'bg-[#5C4033] text-white'
                }`}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}

              {isActive && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 ${!(isNotifications && unreadCount > 0) ? 'ml-auto' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MyAccountSidebar;
