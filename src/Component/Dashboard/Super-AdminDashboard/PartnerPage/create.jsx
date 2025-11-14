// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";

// const PartnerCreate = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     mainHeading: "",
//     mainDescription: "",
//     buttonName: "",
//     buttonLink: "",
//     cards: [],
//     section1Heading: "",
//     section1Description: "",
//     section1Images: [],
//     section2Heading: "",
//     section2Description: "",
//     section2Cards: [],
//     status: "draft",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e, key, multiple = false) => {
//     const files = Array.from(e.target.files);
//     if (multiple) {
//       setFormData({ ...formData, [key]: files });
//     } else {
//       setFormData({ ...formData, [key]: files[0] });
//     }
//   };

//   const addSection1Image = () => {
//     setFormData({
//       ...formData,
//       section1Images: [...formData.section1Images, null],
//     });
//   };

//   const updateSection1Image = (index, file) => {
//     const updated = [...formData.section1Images];
//     updated[index] = file;
//     setFormData({ ...formData, section1Images: updated });
//   };

//   const removeSection1Image = (index) => {
//     const updated = [...formData.section1Images];
//     updated.splice(index, 1);
//     setFormData({ ...formData, section1Images: updated });
//   };

//   const addCard = () => {
//     setFormData({
//       ...formData,
//       cards: [
//         ...formData.cards,
//         {
//           title: "",
//           image: null,
//           sectionHeading: "",
//           sectionDescription: "",
//           sectionImage: null,
//         },
//       ],
//     });
//   };

//   const updateCard = (index, field, value) => {
//     const updated = [...formData.cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, cards: updated });
//   };

//   const removeCard = (index) => {
//     const updated = [...formData.cards];
//     updated.splice(index, 1);
//     setFormData({ ...formData, cards: updated });
//   };

//   const addSection2Card = () => {
//     setFormData({
//       ...formData,
//       section2Cards: [
//         ...formData.section2Cards,
//         { title: "", description: "", image: null },
//       ],
//     });
//   };

//   const updateSection2Card = (index, field, value) => {
//     const updated = [...formData.section2Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section2Cards: updated });
//   };

//   const removeSection2Card = (index) => {
//     const updated = [...formData.section2Cards];
//     updated.splice(index, 1);
//     setFormData({ ...formData, section2Cards: updated });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();

//       // Append simple fields
//       Object.keys(formData).forEach((key) => {
//         if (Array.isArray(formData[key])) return;
//         if (key !== "cards" && key !== "section1Images" && key !== "section2Cards") {
//           data.append(key, formData[key]);
//         }
//       });

//       // Append cards
//       formData.cards.forEach((card, i) => {
//         data.append(`cards[${i}][title]`, card.title);
//         data.append(`cards[${i}][image]`, card.image);
//         data.append(`cards[${i}][sectionHeading]`, card.sectionHeading);
//         data.append(`cards[${i}][sectionDescription]`, card.sectionDescription);
//         data.append(`cards[${i}][sectionImage]`, card.sectionImage);
//       });

//       // Append carousel images
//       formData.section1Images.forEach((img, i) => {
//         if (img) data.append(`section1Images[${i}]`, img);
//       });

//       // Append section2 cards
//       formData.section2Cards.forEach((card, i) => {
//         data.append(`section2Cards[${i}][title]`, card.title);
//         data.append(`section2Cards[${i}][description]`, card.description);
//         data.append(`section2Cards[${i}][image]`, card.image);
//       });

//       await postAPI("/api/partner/create", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Partner page created successfully!");
//       navigate("/super-admin/partner");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create partner page");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Partner Page</h2>
//       </div>

//       <form onSubmit={handleSubmit}>
//         
//         <div className="card p-3 mb-4">
//           <h5>Main Section</h5>
//           <input name="mainHeading" placeholder="Main Heading" className="form-control mb-2" onChange={handleChange} />
//           <textarea
//             name="mainDescription"
//             placeholder="Main Description"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//           <input name="buttonName" placeholder="Button Name" className="form-control mb-2" onChange={handleChange} />
//           <input name="buttonLink" placeholder="Button Link" className="form-control mb-2" onChange={handleChange} />
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Cards Section</h5>
//           {formData.cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Title"
//                 value={card.title}
//                 onChange={(e) => updateCard(index, "title", e.target.value)}
//               />
//               <label>Card Image</label>
//               <input
//                 type="file"
//                 className="form-control mb-2"
//                 onChange={(e) => updateCard(index, "image", e.target.files[0])}
//               />
//               <h6>Corresponding Section</h6>
//               <input
//                 className="form-control mb-2"
//                 placeholder="Section Heading"
//                 value={card.sectionHeading}
//                 onChange={(e) => updateCard(index, "sectionHeading", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Section Description"
//                 value={card.sectionDescription}
//                 onChange={(e) => updateCard(index, "sectionDescription", e.target.value)}
//               />
//               <label>Section Image</label>
//               <input
//                 type="file"
//                 className="form-control mb-2"
//                 onChange={(e) => updateCard(index, "sectionImage", e.target.files[0])}
//               />
//               <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCard(index)}>
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button type="button" className="btn btn-primary" onClick={addCard}>
//             + Add Card
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Section 1 (Carousel)</h5>
//           <input
//             name="section1Heading"
//             placeholder="Section 1 Heading"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//           <textarea
//             name="section1Description"
//             placeholder="Section 1 Description"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />

//           <h6>Carousel Images</h6>
//           {formData.section1Images.map((img, index) => (
//             <div key={index} className="d-flex align-items-center mb-2">
//               <input
//                 type="file"
//                 className="form-control me-2"
//                 onChange={(e) => updateSection1Image(index, e.target.files[0])}
//               />
//               <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection1Image(index)}>
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button type="button" className="btn btn-primary" onClick={addSection1Image}>
//             + Add Image
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Section 2</h5>
//           <input
//             name="section2Heading"
//             placeholder="Section 2 Heading"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//           <textarea
//             name="section2Description"
//             placeholder="Section 2 Description"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//           <h6>Section 2 Cards</h6>
//           {formData.section2Cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Title"
//                 value={card.title}
//                 onChange={(e) => updateSection2Card(index, "title", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) => updateSection2Card(index, "description", e.target.value)}
//               />
//               <label>Card Image</label>
//               <input
//                 type="file"
//                 className="form-control mb-2"
//                 onChange={(e) => updateSection2Card(index, "image", e.target.files[0])}
//               />
//               <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection2Card(index)}>
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button type="button" className="btn btn-primary" onClick={addSection2Card}>
//             + Add Section 2 Card
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Status</h5>
//           <select
//             name="status"
//             className="form-control mb-2"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <option value="draft">Draft</option>
//             <option value="published">Published</option>
//           </select>
//         </div>

//         <button type="submit" className="btn btn-success">
//           Save Page
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PartnerCreate;






import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";

const PartnerCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mainHeading: "",
    mainDescription: "",
    buttonName: "",
    buttonLink: "",
    cards: [],
    section1Heading: "",
    section1Description: "",
    section1Images: [],
    section2Heading: "",
    section2Description: "",
    section2Cards: [],
    status: "draft",
  });

  const [previews, setPreviews] = useState({
    section1Images: [],
    cards: [],
    section2Cards: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSection1Image = () => {
    setFormData({
      ...formData,
      section1Images: [...formData.section1Images, null],
    });
    setPreviews({
      ...previews,
      section1Images: [...previews.section1Images, null],
    });
  };

  const updateSection1Image = (index, file) => {
    const updated = [...formData.section1Images];
    updated[index] = file;
    setFormData({ ...formData, section1Images: updated });

    const previewURL = file ? URL.createObjectURL(file) : null;
    const updatedPreviews = [...previews.section1Images];
    updatedPreviews[index] = previewURL;
    setPreviews({ ...previews, section1Images: updatedPreviews });
  };

  const removeSection1Image = (index) => {
    const updated = [...formData.section1Images];
    updated.splice(index, 1);
    const updatedPreviews = [...previews.section1Images];
    updatedPreviews.splice(index, 1);
    setFormData({ ...formData, section1Images: updated });
    setPreviews({ ...previews, section1Images: updatedPreviews });
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [
        ...formData.cards,
        {
          title: "",
          image: null,
          sectionHeading: "",
          sectionDescription: "",
          sectionImage: null,
        },
      ],
    });
    setPreviews({
      ...previews,
      cards: [...previews.cards, { image: null, sectionImage: null }],
    });
  };

  const updateCard = (index, field, value) => {
    const updated = [...formData.cards];
    updated[index][field] = value;
    setFormData({ ...formData, cards: updated });

    if (field === "image" || field === "sectionImage") {
      const updatedPreviews = [...previews.cards];
      updatedPreviews[index] = {
        ...updatedPreviews[index],
        [field]: value ? URL.createObjectURL(value) : null,
      };
      setPreviews({ ...previews, cards: updatedPreviews });
    }
  };

  const removeCard = (index) => {
    const updated = [...formData.cards];
    const updatedPreviews = [...previews.cards];
    updated.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFormData({ ...formData, cards: updated });
    setPreviews({ ...previews, cards: updatedPreviews });
  };

  const addSection2Card = () => {
    setFormData({
      ...formData,
      section2Cards: [
        ...formData.section2Cards,
        { title: "", description: "", image: null },
      ],
    });
    setPreviews({
      ...previews,
      section2Cards: [...previews.section2Cards, null],
    });
  };

  const updateSection2Card = (index, field, value) => {
    const updated = [...formData.section2Cards];
    updated[index][field] = value;
    setFormData({ ...formData, section2Cards: updated });

    if (field === "image") {
      const updatedPreviews = [...previews.section2Cards];
      updatedPreviews[index] = value ? URL.createObjectURL(value) : null;
      setPreviews({ ...previews, section2Cards: updatedPreviews });
    }
  };

  const removeSection2Card = (index) => {
    const updated = [...formData.section2Cards];
    const updatedPreviews = [...previews.section2Cards];
    updated.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFormData({ ...formData, section2Cards: updated });
    setPreviews({ ...previews, section2Cards: updatedPreviews });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) return;
        if (key !== "cards" && key !== "section1Images" && key !== "section2Cards") {
          data.append(key, formData[key]);
        }
      });

      formData.cards.forEach((card, i) => {
        data.append(`cards[${i}][title]`, card.title);
        data.append(`cards[${i}][image]`, card.image);
        data.append(`cards[${i}][sectionHeading]`, card.sectionHeading);
        data.append(`cards[${i}][sectionDescription]`, card.sectionDescription);
        data.append(`cards[${i}][sectionImage]`, card.sectionImage);
      });

      formData.section1Images.forEach((img, i) => {
        if (img) data.append(`section1Images[${i}]`, img);
      });

      formData.section2Cards.forEach((card, i) => {
        data.append(`section2Cards[${i}][title]`, card.title);
        data.append(`section2Cards[${i}][description]`, card.description);
        data.append(`section2Cards[${i}][image]`, card.image);
      });

      await postAPI("/api/partner/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Partner page created successfully!");
      navigate("/super-admin/partner");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create partner page");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Partner Page</h2>
      </div>

      <form onSubmit={handleSubmit}>
        
        <div className="card p-3 mb-4">
          <h5>Main Section</h5>
          <input name="mainHeading" placeholder="Main Heading" className="form-control mb-2" onChange={handleChange} />
          <textarea
            name="mainDescription"
            placeholder="Main Description"
            className="form-control mb-2"
            onChange={handleChange}
          />
          <input name="buttonName" placeholder="Button Name" className="form-control mb-2" onChange={handleChange} />
          <input name="buttonLink" placeholder="Button Link" className="form-control mb-2" onChange={handleChange} />
        </div>

        <div className="card p-3 mb-4">
          <h5>Cards Section</h5>
          {formData.cards.map((card, index) => (
            <div key={index} className="border p-2 mb-3">
              <input
                className="form-control mb-2"
                placeholder="Card Title"
                value={card.title}
                onChange={(e) => updateCard(index, "title", e.target.value)}
              />
              <label>Card Image</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => updateCard(index, "image", e.target.files[0])}
              />
              {previews.cards[index]?.image && (
                <img
                  src={previews.cards[index].image}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{ width: "150px", height: "auto" }}
                />
              )}
              <h6>Corresponding Section</h6>
              <input
                className="form-control mb-2"
                placeholder="Section Heading"
                value={card.sectionHeading}
                onChange={(e) => updateCard(index, "sectionHeading", e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Section Description"
                value={card.sectionDescription}
                onChange={(e) => updateCard(index, "sectionDescription", e.target.value)}
              />
              <label>Section Image</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => updateCard(index, "sectionImage", e.target.files[0])}
              />
              {previews.cards[index]?.sectionImage && (
                <img
                  src={previews.cards[index].sectionImage}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{ width: "150px", height: "auto" }}
                />
              )}
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCard(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addCard}>
            + Add Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Section 1 (Carousel)</h5>
          <input
            name="section1Heading"
            placeholder="Section 1 Heading"
            className="form-control mb-2"
            onChange={handleChange}
          />
          <textarea
            name="section1Description"
            placeholder="Section 1 Description"
            className="form-control mb-2"
            onChange={handleChange}
          />

          <h6>Carousel Images</h6>
          {formData.section1Images.map((img, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="file"
                className="form-control me-2"
                onChange={(e) => updateSection1Image(index, e.target.files[0])}
              />
              {previews.section1Images[index] && (
                <img
                  src={previews.section1Images[index]}
                  alt="Preview"
                  className="img-thumbnail me-2"
                  style={{ width: "120px", height: "auto" }}
                />
              )}
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection1Image(index)}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" className="btn btn-primary" onClick={addSection1Image}>
            + Add Image
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Section 2</h5>
          <input
            name="section2Heading"
            placeholder="Section 2 Heading"
            className="form-control mb-2"
            onChange={handleChange}
          />
          <textarea
            name="section2Description"
            placeholder="Section 2 Description"
            className="form-control mb-2"
            onChange={handleChange}
          />
          <h6>Section 2 Cards</h6>
          {formData.section2Cards.map((card, index) => (
            <div key={index} className="border p-2 mb-3">
              <input
                className="form-control mb-2"
                placeholder="Card Title"
                value={card.title}
                onChange={(e) => updateSection2Card(index, "title", e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Card Description"
                value={card.description}
                onChange={(e) => updateSection2Card(index, "description", e.target.value)}
              />
              <label>Card Image</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => updateSection2Card(index, "image", e.target.files[0])}
              />
              {previews.section2Cards[index] && (
                <img
                  src={previews.section2Cards[index]}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{ width: "150px", height: "auto" }}
                />
              )}
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSection2Card(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addSection2Card}>
            + Add Section 2 Card
          </button>
        </div>

        <div className="card p-3 mb-4">
          <h5>Status</h5>
          <select
            name="status"
            className="form-control mb-2"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Save Page
        </button>
      </form>
    </div>
  );
};

export default PartnerCreate;
