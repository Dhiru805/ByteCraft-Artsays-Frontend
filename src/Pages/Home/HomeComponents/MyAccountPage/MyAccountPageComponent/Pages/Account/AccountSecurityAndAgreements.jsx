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
    <form onSubmit={handleSubmit} className="w-[1208px]">
      <h2 className="text-xl font-semibold pb-4 text-gray-950">Account Security and Agreements</h2>
      <ul className="space-y-2 text-[16px] font-medium text-gray-800 mb-4">
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="twoStepAuthentication"
            checked={formData.twoStepAuthentication || false}
            onChange={handleChange}
            className={`form-checkbox rounded-full h-5 w-5 
              ${formData.twoStepAuthentication ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <span>2-Step Authentication (OTP, Email verification, etc.)</span>
        </li>
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsConditionsAgreement"
            checked={formData.termsConditionsAgreement || false}
            onChange={handleChange}
            className={`form-checkbox rounded-full h-5 w-5 
              ${formData.termsConditionsAgreement ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <span>Terms & Conditions Agreement</span>
        </li>
        <li className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="privacyPolicyAgreement"
            checked={formData.privacyPolicyAgreement || false}
            onChange={handleChange}
            className={`form-checkbox rounded-full h-5 w-5 
              ${formData.privacyPolicyAgreement ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <span>Privacy Policy Agreement</span>
        </li>
      </ul>

      <button
        type="submit"
        className="bg-[#6F4D34] text-white text-[16px] text-semibold px-5 py-2 rounded-3xl"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
};

export default AccountSecurityAgreements;

