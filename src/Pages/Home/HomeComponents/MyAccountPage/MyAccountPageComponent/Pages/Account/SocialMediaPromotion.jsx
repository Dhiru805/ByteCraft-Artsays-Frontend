import React from 'react';

const SocialMediaPromotion = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Social Media Promotion</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded w-full" placeholder="Instagram" defaultValue="https://instagram.com/nikita" />
        <input className="border p-2 rounded w-full" placeholder="YouTube" />
        <input className="border p-2 rounded w-full" placeholder="Facebook" />
        <input className="border p-2 rounded w-full" placeholder="LinkedIn" />
        <div className="md:col-span-2">
          <button className="bg-[#5F3E2D] text-white px-6 py-2 rounded">Update</button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaPromotion;
