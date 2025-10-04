import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../../api/putAPI';
import getAPI from '../../../../../../../api/getAPI';

const SocialMediaPromotion = () => {
  const [formData, setFormData] = useState({
    instagram: '',
    facebook: '',
    youtube: '',
    linkdin: ''
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  // Fetch user profile
  const fetchProfile = async () => {
    if (!userId) {
      toast.error('User not logged in.');
      return;
    }
    try {
      const response = await getAPI(`/auth/userid/${userId}`);
      console.log('Profile response:', response);
      const profile = response?.data?.user;

      if (profile) {
        setFormData({
          instagram: profile.instagram || '',
          facebook: profile.facebook || '',
          youtube: profile.youtube || '',
          linkdin: profile.linkdin || ''
        });
      } else {
        toast.warn('No profile data found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data.');
    }
  };

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.instagram && !formData.facebook && !formData.youtube && !formData.linkdin) {
      toast.error('Please enter at least one social media link.');
      return;
    }

    if (!userId) {
      toast.error('User not logged in.');
      return;
    }

    setLoading(true);
    try {
      const url = `/auth/updatesociallink/${userId}`;
      
      const result = await putAPI(url, formData);
      console.log("Update response:", result);

      // if (result?.data?.success || result?.success) {
      if (result) {
        toast.success('Social links updated successfully');
        await fetchProfile();
      } else {
        toast.error('Failed to update social links');
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      toast.error('Error updating social links');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full max-w-[1076px] mx-auto px-4 sm:px-6 lg:px-0 space-y-10">
    <h2 className="text-2xl text-gray-950 font-semibold">Social Media Promotion</h2>

    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
      {/* Instagram */}
      <div>
        <label className="block mb-2 font-medium">Instagram</label>
        <input
          name="instagram"
          type="url"
          value={formData.instagram}
          onChange={handleChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="Instagram"
        />
      </div>

      {/* YouTube */}
      <div>
        <label className="block mb-2 font-medium">YouTube</label>
        <input
          name="youtube"
          type="url"
          value={formData.youtube}
          onChange={handleChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="YouTube"
        />
      </div>

      {/* Facebook */}
      <div>
        <label className="block mb-2 font-medium">Facebook</label>
        <input
          name="facebook"
          type="url"
          value={formData.facebook}
          onChange={handleChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="Facebook"
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label className="block mb-2 font-medium">LinkedIn</label>
        <input
          name="linkdin"
          type="url"
          value={formData.linkdin}
          onChange={handleChange}
          className="border-2 px-3 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#6F3E2D]"
          placeholder="LinkedIn"
        />
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="bg-[#6F4D34] text-white px-10 py-2 rounded-full text-sm font-medium"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Changes'}
        </button>
      </div>
    </form>
  </div>
);

};

export default SocialMediaPromotion;
