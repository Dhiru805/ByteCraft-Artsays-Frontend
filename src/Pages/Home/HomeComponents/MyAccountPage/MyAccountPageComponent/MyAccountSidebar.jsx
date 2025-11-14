import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { name: 'Personal Information', path: 'personal-info' },
  { name: 'My Orders', path: 'my-orders' },
  { name: 'Manage Address', path: 'manage-address' },
  { name: 'Bank Payment Details', path: 'bank-payment-details' },
  { name: 'Payment Method', path: 'payment-method' },
  { name: 'Wallet', path: 'buyer-wallet' },
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
    <div className="bg-white h-[920px] w-[350px] flex flex-col space-y-[20px]">
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
            className={`block w-[340px] h-[60px] text-[18px] font-semibold text-left py-[15px] px-[20px] border-[0.6px] rounded-[14px] transition ${
              isActive
                ? 'bg-[#6F4D34] text-white'
                : 'bg-white text-[#7B7B7B]'
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
