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
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Social Media Promotion
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#5C4033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Connect Your Socials</h3>
            <p className="text-sm text-gray-500">Link your social media profiles to boost your presence</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
              <div className="relative">
                <input
                  name="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-5 py-3 pl-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="https://instagram.com/username"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.058 2.633.304 3.511 1.182.888.888 1.134 2.145 1.182 3.511.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.366-.304 2.633-1.182 3.511-.888.888-2.145 1.134-3.511 1.182-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.058-2.633-.304-3.511-1.182-.888-.888-1.134-2.145-1.182-3.511C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.058-1.366.304-2.633 1.182-3.511.888-.888 2.145-1.134 3.511-1.182 1.266-.058 1.646-.07 4.85-.07ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 4.69.073 9.053.014 10.333 0 10.741 0 12s.014 1.667.072 2.947c.2 4.363 4.618 6.781 8.981 6.981 1.28.058 1.688.072 2.947.072s1.667-.014 2.947-.072c4.363-.2 6.781-4.618 6.981-8.981.058-1.28.072-1.688.072-2.947s-.014-1.667-.072-2.947c-.2-4.363-4.618-6.781-8.981-6.981C13.667.014 13.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4.162 4.162 0 1 1 0-8.324 4.162 4.162 0 0 1 0 8.324Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/></svg>
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Channel URL</label>
              <div className="relative">
                <input
                  name="youtube"
                  type="url"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-5 py-3 pl-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="https://youtube.com/c/channelname"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Profile URL</label>
              <div className="relative">
                <input
                  name="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-5 py-3 pl-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="https://facebook.com/username"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 10.995 9 11.835V15.47H6.33V12.07h2.67V9.473c0-2.635 1.568-4.085 3.966-4.085 1.15 0 2.351.205 2.351.205v2.584h-1.324c-1.305 0-1.707.81-1.707 1.64v1.97h2.912l-.465 3.4H12.24v8.438c5.344-.84 9-5.845 9-11.835Z"/></svg>
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile URL</label>
              <div className="relative">
                <input
                  name="linkdin"
                  type="url"
                  value={formData.linkdin}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-5 py-3 pl-12 rounded-2xl bg-gray-50 focus:bg-white focus:border-[#5C4033] focus:ring-2 focus:ring-[#5C4033]/10 transition-all duration-300 outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065ZM7.119 20.452H3.554V9h3.565v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center gap-3 bg-[#5C4033] hover:bg-[#4b3327] text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-[#5C4033]/20 transition-all transform active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? 'Updating...' : 'Update Social Links'}
          </button>
        </form>
      </div>
    </div>
  );

};

export default SocialMediaPromotion;
