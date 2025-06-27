import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';

const AccountSecurityAgreements = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  const checkboxLabels = {
    twoStepAuthentication: "2-Step Authentication (OTP, Email verification, etc.)",
    termsConditionsAgreement: "Terms & Conditions Agreement",
    privacyPolicyAgreement: "Privacy Policy Agreement"
  };

  useEffect(() => {
    const fetchAgreementDetails = async () => {
      try {
        if (!userId) {
          console.warn("User ID is undefined. Cannot fetch agreement details.");
          return;
        }

        const url = `/auth/agreementdetails/${userId}`;
        const result = await getAPI(url);

        if (result && result.data && Array.isArray(result.data.agreements)) {
          const storedData = {};
          Object.keys(checkboxLabels).forEach(key => {
            storedData[key] = result.data.agreements.includes(checkboxLabels[key]);
          });
          setFormData(storedData);
        }
      } catch (error) {
        console.error("Error fetching agreement details:", error);
      }
    };
    fetchAgreementDetails();
  }, [userId]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const allSelected = Object.keys(checkboxLabels).every(key => formData[key]);

    if (!allSelected) {
      setLoading(false);
      toast.warn('Please agree to all agreements.');
      return;
    }

    const selectedAgreements = Object.keys(formData)
      .filter((key) => formData[key])
      .map((key) => checkboxLabels[key]);

    try {
      const url = `/auth/updateagreementdetails/${userId}`;
      const result = await putAPI(url, { agreements: selectedAgreements });

      if (result) {
        setLoading(false);
        toast.success('Agreement details updated successfully');
      } else {
        toast.error('Failed to update agreement details');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error updating agreement details');
    }
  };

  return (
  <form onSubmit={handleSubmit} className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 space-y-6 text-gray-800">
    <h2 className="text-2xl font-semibold text-gray-950">Account Security and Agreements</h2>

    <ul className="space-y-4 text-[16px] font-medium">
      <li className="flex items-center gap-3">
        <input
          type="checkbox"
          name="twoStepAuthentication"
          checked={formData.twoStepAuthentication || false}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="twoStepAuthentication">
          2-Step Authentication (OTP, Email verification, etc.)
        </label>
      </li>

      <li className="flex items-center gap-3">
        <input
          type="checkbox"
          name="termsConditionsAgreement"
          checked={formData.termsConditionsAgreement || false}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="termsConditionsAgreement">
          Terms & Conditions Agreement
        </label>
      </li>

      <li className="flex items-center gap-3">
        <input
          type="checkbox"
          name="privacyPolicyAgreement"
          checked={formData.privacyPolicyAgreement || false}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="privacyPolicyAgreement">
          Privacy Policy Agreement
        </label>
      </li>
    </ul>

    <button
      type="submit"
      disabled={loading}
      className="bg-[#6F4D34] text-white text-base font-semibold px-6 py-2 rounded-full disabled:opacity-60"
    >
      {loading ? 'Updating...' : 'Update'}
    </button>
  </form>
);

};

export default AccountSecurityAgreements;

