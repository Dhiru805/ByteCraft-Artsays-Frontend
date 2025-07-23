// import React, { useState } from 'react';
// import './LiveDetails.css';

// const LiveDetails = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     thumbnail: null,
//     thumbnailPreview: null
//   });

//   const categories = [
//     'Gaming',
//     'Music',
//     'Education',
//     'Just Chatting',
//     'IRL',
//     'Creative',
//     'Esports',
//     'Science & Technology'
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           thumbnail: file,
//           thumbnailPreview: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission here
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="live-details-container">
//       <h1>Details</h1>
      
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">Title (required)</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             placeholder="Enter your stream title"
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Tell viewers more about your stream"
//             rows="4"
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="category">Category</label>
//           <select
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//           >
//             <option value="">Add your stream to a category so viewers can find it more easily</option>
//             {categories.map((cat, index) => (
//               <option key={index} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="form-group">
//           <label>Art</label>
//           <div className="thumbnail-section">
//             <div className="thumbnail-upload">
//               <label htmlFor="thumbnail" className="thumbnail-label">
//                 {formData.thumbnailPreview ? (
//                   <img src={formData.thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
//                 ) : (
//                   <div className="thumbnail-placeholder">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
//                     </svg>
//                     <span>Upload Thumbnail</span>
//                   </div>
//                 )}
//               </label>
//               <input
//                 type="file"
//                 id="thumbnail"
//                 name="thumbnail"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 style={{ display: 'none' }}
//               />
//             </div>
//             <div className="thumbnail-instructions">
//               <h4>Thumbnail</h4>
//               <p>Select or upload a picture that represents your stream.</p>
//               <p>Recommended size: 1280x720 pixels</p>
//             </div>
//           </div>
//         </div>
        
//         <button type="submit" className="next-button">Next</button>
//       </form>
//     </div>
//   );
// };

// export default LiveDetails;



import React, { useState } from 'react';
import DetailsTab from './DetailsTab';
import CustomizationTab from './CustomizationTab';
import './Form.css';

const LiveStreamForm = () => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="form-container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </div>
        <div
          className={`tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Customization
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'details' && <DetailsTab onNext={() => setActiveTab('custom')} />}
        {activeTab === 'custom' && <CustomizationTab />}
      </div>
    </div>
  );
};

export default LiveStreamForm;

