
// import React, { useState } from 'react';
// import './Form.css';

// const DetailsTab = ({ onNext }) => {
//   const [details, setDetails] = useState({
//     title: '',
//     description: '',
//     category: 'Art',
//     thumbnail: null
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setDetails((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };

//   return (
//     <div className="details-container">
//       <label className="form-label">
//         Title <span className="required">(required)</span>
//       </label>
//       <input
//         className="input-field"
//         type="text"
//         name="title"
//         placeholder="Title"
//         value={details.title}
//         onChange={handleChange}
//         required
//       />

//       <label className="form-label">Description</label>
//       <textarea
//         className="textarea-field"
//         name="description"
//         placeholder="Tell viewers more about your stream"
//         value={details.description}
//         onChange={handleChange}
//       />

//       <label className="form-label">Category</label>
//       <p className="form-description">
//         Add your stream to a category so viewers can find it more easily
//       </p>
//       <select
//         className="dropdown"
//         name="category"
//         value={details.category}
//         onChange={handleChange}
//       >
//         <option>Art</option>
//         <option>Music</option>
//         <option>Gaming</option>
//         <option>Education</option>
//       </select>

//       <label className="form-label">Thumbnail</label>
//       <p className="form-description">
//         Select or upload a picture that represents your stream.
//       </p>
//       <label className="upload-box">
//         <input
//           type="file"
//           accept="image/*"
//           name="thumbnail"
//           onChange={handleChange}
//           style={{ display: 'none' }}
//         />
//         <span role="img" aria-label="upload">🖼️</span>
//       </label>

//       <button className="next-btn" onClick={onNext}>
//         Next
//       </button>
//     </div>
//   );
// };

// export default DetailsTab;











// import React from 'react';

// const DetailsTab = ({ onNext }) => {
//   return (
//     <div className="details-tab">
//       <label>Title <span className="required">(required)</span></label>
//       <input type="text" placeholder="Title" />

//       <label>Description</label>
//       <textarea placeholder="Tell viewers more about your stream"></textarea>

//       <label>Category</label>
//       <select>
//         <option value="art">Art</option>
//         <option value="music">Music</option>
//         <option value="gaming">Gaming</option>
//       </select>

//       <label>Thumbnail</label>
//       <div className="thumbnail-upload">
//         <div className="upload-box">
//           <span role="img" aria-label="image">🖼️</span>
//         </div>
//       </div>

//       <button className="next-btn" onClick={onNext}>Next</button>
//     </div>
//   );
// };

// export default DetailsTab;





import React, { useState } from 'react';
import './Form.css';

const DetailsTab = ({ onNext }) => {
  const [details, setDetails] = useState({
    title: '',
    description: '',
    category: 'Art',
    thumbnail: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="details-container">
        <div className='details'>Details</div>
      {/* <label className="form-label">
        Title <span className="
        required">(required)</span>
      </label> */}
         
          <hr className="divider" />

      <input
        className="input-field"
        type="text"
        name="title"
        // <span className="Title">(required)</span>
        placeholder="Title (required)"
         rows={1}
        value={details.title}
        onChange={handleChange}
        required
      />

      {/* <label className="form-label">Description</label> */}
      <textarea
        className="textarea-field"
        // name="description"
        placeholder={"Description\nTell viewers more about your stream"}
        value={details.description}
        onChange={handleChange}
      />

      <label className="form-label">Category</label>
      <p className="form-description">
        Add your stream to a category so viewers can find it more easily
      </p>
      <select
        className="dropdown"
        name="category"
        value={details.category}
        onChange={handleChange}
      >
        <option>Art</option>
        <option>Music</option>
        <option>Gaming</option>
        <option>Education</option>
      </select>

      <label className="form-label">Thumbnail</label>
      <p className="form-description">
        Select or upload a picture that represents your stream.
      </p>
      <label className="upload-box">
        <input
          type="file"
          accept="image/*"
          name="thumbnail"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <span role="img" aria-label="upload">🖼️</span>
      </label>

      <button className="next-btn" onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export default DetailsTab;
