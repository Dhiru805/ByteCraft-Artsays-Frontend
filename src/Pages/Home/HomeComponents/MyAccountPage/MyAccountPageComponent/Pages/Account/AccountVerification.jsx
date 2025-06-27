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
  <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
    <h2 className="text-2xl text-gray-950 pb-4 font-semibold">Account Verification</h2>

    <form className="space-y-8 text-sm font-semibold" onSubmit={handleSubmit}>
      {/* ID Type */}
      <div>
        <label className="block mb-2 font-medium">
          Select Document Type <span className="text-red-600">*</span>
        </label>
        <select
          value={verificationType}
          onChange={handleVerificationChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
        >
          <option value="">Select</option>
          <option value="Driving License">Driving License</option>
          <option value="Aadhar Card">Aadhar Card</option>
        </select>
      </div>

      {/* Document Number */}
      <div>
        <label className="block mb-2 font-medium">
          {verificationType || 'Document'} Number <span className="text-red-600">*</span>
        </label>
        <input
          value={docNumber}
          onChange={handleDocNumberChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder={verificationType === 'Driving License' ? 'DL-45-67564567' : '213456789012'}
        />
      </div>

      {/* Upload Field */}
      <div>
        <label className="block mb-2 font-medium">
          Upload Document <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
        />
      </div>

      {/* Preview & Submit */}
      <div className="flex flex-col gap-6 mt-4">
        {filePreview && fileType.startsWith('image/') && (
          <img
            src={filePreview}
            alt="Uploaded Document"
            className="max-w-[200px] h-auto rounded-lg border"
          />
        )}

        {filePreview && fileType === 'application/pdf' && (
          <a
            href={filePreview}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-200 text-sm w-[120px] px-6 py-2 rounded-xl border text-center"
          >
            View PDF
          </a>
        )}

        <button
          type="submit"
          className="bg-[#6F4D34] text-white w-[120px] px-8 py-2 rounded-full text-base font-medium"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>

    {/* Modal */}
    {isModalOpen && filePreview && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-xl p-4 max-w-[90%] max-h-[90%] overflow-auto relative">
          <button onClick={closeModal} className="absolute top-2 right-2 text-black">✖</button>
          {fileType === 'application/pdf' ? (
            <iframe src={filePreview} width="100%" height="600" title="PDF Preview" />
          ) : (
            <img src={filePreview} alt="Document Preview" className="max-w-full h-auto rounded-lg" />
          )}
        </div>
      </div>
    )}
  </div>
);

};

export default AccountVerification;
