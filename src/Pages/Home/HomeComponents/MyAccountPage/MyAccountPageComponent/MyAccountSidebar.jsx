import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { name: 'Personal Information', path: 'personal-info' },
  { name: 'My Orders', path: 'my-orders' },
  { name: 'Manage Address', path: 'manage-address' },
  { name: 'Payment Method', path: 'payment-method' },
  { name: 'Password Manager', path: 'password-manager' },
  { name: 'Account Verification', path: 'account-verification' },
  { name: 'Social Media Promotion', path: 'social-media-promotion' },
  { name: 'Custom Request', path: 'custom-request' },
  { name: 'Notification and Preferences', path: 'notification-preferences' },
  { name: 'Account Security and Agreements', path: 'security-agreements' },
  { name: 'Logout', path: 'logout' },
];

const MyAccountSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-white rounded shadow p-4 space-y-2">
      {links.map(({ name, path }) => {
        const fullPath = `/my-account/${path}`;
        const isPersonalInfo =
          path === 'personal-info' &&
          (currentPath === '/my-account' || currentPath === fullPath);

        const isActive = isPersonalInfo || currentPath === fullPath;

        return (
          <NavLink
            key={path}
            to={fullPath}
            className={`block w-full text-left px-4 py-2 rounded transition ${
              isActive
                ? 'bg-[#5F3E2D] text-white'
                : 'bg-white border text-gray-700'
            }`}
          >
            {name}
          </NavLink>
        );
      })}
    </div>
  );
};

export default MyAccountSidebar;
