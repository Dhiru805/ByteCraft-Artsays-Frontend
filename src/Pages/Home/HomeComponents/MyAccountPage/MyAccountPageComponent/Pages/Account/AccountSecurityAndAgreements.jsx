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
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Account Security & Agreements
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Security & Privacy</h3>
            <p className="text-sm text-gray-500">Protect your account and review our latest policies</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            {Object.entries(checkboxLabels).map(([key, label]) => (
              <div 
                key={key}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  formData[key] 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => handleChange({ target: { name: key, checked: !formData[key] } })}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key] || false}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border border-gray-300 checked:border-emerald-500 checked:bg-emerald-500 transition-all duration-300"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${formData[key] ? 'text-emerald-900' : 'text-gray-700'}`}>{label}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold opacity-50 mt-0.5">
                    {formData[key] ? 'Accepted' : 'Action Required'}
                  </p>
                </div>
                {formData[key] && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? 'Updating...' : 'Update Agreements'}
          </button>
        </form>
      </div>
    </div>
  );

};

export default AccountSecurityAgreements;

