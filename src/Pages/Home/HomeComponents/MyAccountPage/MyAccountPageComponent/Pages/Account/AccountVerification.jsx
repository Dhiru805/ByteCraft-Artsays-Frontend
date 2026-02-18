import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';

const AccountVerification = () => {

  const [verificationType, setVerificationType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        const response = await getAPI(`/auth/verificationdetails/${userId}`, {}, true);
        const data = response.data.verification;

        if (data) {
          setVerificationType(data.documentType || '');
          setDocNumber(data.documentNumber || '');

          if (data.documentFile) {
            const normalizedPath = data.documentFile.replace(/\\/g, '/');

            setFilePreview(`${process.env.REACT_APP_API_URL_FOR_IMAGE}/${normalizedPath}`);
            setFileType(normalizedPath.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching verification details');
      }
    };

    fetchVerificationData();
  }, [userId]);




  const handleVerificationChange = (event) => {
    setVerificationType(event.target.value);
    setDocNumber('');
    setFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.warn('Only PDF, JPG, and PNG files are allowed');
        return;
      }
      setFile(selectedFile);
      setFileType(selectedFile.type);

      if (selectedFile.type === 'application/pdf') {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const validateDocumentNumber = () => {
    if (verificationType === 'Aadhar Card') {
      const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
      if (!aadhaarRegex.test(docNumber)) {
        toast.error('Please enter a valid 12-digit Aadhaar number');
        return false;
      }
    } else if (verificationType === 'Driving License') {
      const drivingLicenseRegex = /^[A-Z]{2}-\d{2}-\d{8}$/;
      if (!drivingLicenseRegex.test(docNumber)) {
        toast.error('Please enter a valid Driving License number (e.g., DL-01-12356458)');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  if (!validateDocumentNumber()) {
    setLoading(false);
    return;
  }

  if (!verificationType || !docNumber || (!file && !filePreview)) {
    toast.warn('Please complete all fields');
    setLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('verificationType', verificationType);
  formData.append('docNumber', docNumber);

  try {
    if (!file && filePreview) {
      const response = await fetch(filePreview);
      const blob = await response.blob();
      const filename = verificationType.replace(/\s+/g, '_') + '.' + blob.type.split('/')[1];
      const fileFromBlob = new File([blob], filename, { type: blob.type });
      formData.append('file', fileFromBlob);
    } else if (file) {
      formData.append('file', file);
    }

    const url = `/auth/updateverificationdetails/${userId}`;
    const response = await putAPI(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response) {
      toast.success('Verification details updated successfully');
    } else {
      toast.error('Failed to update verification details');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error updating verification details');
  } finally {
    setLoading(false);
  }
};

  const handleDocNumberChange = (e) => {
    setDocNumber(e.target.value);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Account Verification
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Verify Your Identity</h3>
            <p className="text-sm text-gray-500">Upload official documents to secure and verify your account</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Document Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={verificationType}
                  onChange={handleVerificationChange}
                  className="w-full appearance-none border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none cursor-pointer"
                >
                  <option value="">Select Document</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Aadhar Card">Aadhar Card</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {verificationType || 'Document'} Number <span className="text-rose-500">*</span>
              </label>
              <input
                value={docNumber}
                onChange={handleDocNumberChange}
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                placeholder={verificationType === 'Driving License' ? 'DL-45-67564567' : '2134 5678 9012'}
              />
            </div>

            {/* Upload Field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Document <span className="text-rose-500">*</span>
              </label>
              <div className="relative group/upload">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="docUpload"
                />
                <label 
                  htmlFor="docUpload"
                  className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 hover:bg-white hover:border-[#5C4033]/50 transition-all duration-300 cursor-pointer group-hover/upload:shadow-inner"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-gray-700">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (max. 5MB)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview & Submit */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-8">
            {filePreview && (
              <div className="relative group">
                {fileType.startsWith('image/') ? (
                  <div className="w-40 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                    <img
                      src={filePreview}
                      alt="Uploaded Document"
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <a
                    href={filePreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-all duration-300 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-bold">Document.pdf</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Click to view</p>
                    </div>
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {loading ? 'Updating...' : 'Update Verification'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && filePreview && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex justify-center items-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-[2rem] p-4 max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal} 
              className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-lg transition-all z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center">
              {fileType === 'application/pdf' ? (
                <iframe src={filePreview} width="100%" height="700" className="rounded-xl" title="PDF Preview" />
              ) : (
                <img src={filePreview} alt="Document Preview" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default AccountVerification;
