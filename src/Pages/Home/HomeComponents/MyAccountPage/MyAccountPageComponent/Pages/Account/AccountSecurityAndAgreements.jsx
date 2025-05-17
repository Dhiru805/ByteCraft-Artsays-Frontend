import React from 'react';

const checkedItems={
  auth: true,
  terms: true,
  privacy: false,
}
const AccountSecurityAgreements = () => {
  return (
    <div className="w-[856px] ">
      <h2 className="text-xl font-semibold pb-4 text-gray-950">Account Security and Agreements</h2>
      <ul className="space-y-2 text-[16px] font-medium text-gray-800">
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            disabled
            checked={checkedItems.auth}
            className="form-checkbox rounded-full text-blue-600 disabled:opacity-800"
          />
          <span>2-step Authentication (OTP, Email verification, etc.)</span>
        </li>
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            disabled
            checked={checkedItems.terms}
            className="form-checkbox rounded-full text-blue-600 disabled:opacity-800"
          />
          <span>Terms & Conditions Agreement</span>
        </li>
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            disabled
            checked={checkedItems.privacy}
            className="form-checkbox rounded-full text-blue-600 disabled:opacity-800"
          />
          <span>Privacy Policy Agreement</span>
        </li>
      </ul>
    </div>
  );
};

export default AccountSecurityAgreements;
