// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";

// const InsuranceCreate = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     section1Heading: "",
//     section1Description: "",
//     section1Cards: [],
//     section2Heading: "",
//     section2Description: "",
//     section2Cards: [],
//     section3Heading: "",
//     section3Description: "",
//     status: "draft",
//   });

//   const [previews, setPreviews] = useState({
//     section1Cards: [],
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const addSection1Card = () => {
//     setFormData({
//       ...formData,
//       section1Cards: [
//         ...formData.section1Cards,
//         { image: null, title: "", description: "" },
//       ],
//     });
//     setPreviews({
//       ...previews,
//       section1Cards: [...previews.section1Cards, null],
//     });
//   };

//   const updateSection1Card = (index, field, value) => {
//     const updated = [...formData.section1Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section1Cards: updated });

//     if (field === "image") {
//       const updatedPreviews = [...previews.section1Cards];
//       updatedPreviews[index] = value ? URL.createObjectURL(value) : null;
//       setPreviews({ ...previews, section1Cards: updatedPreviews });
//     }
//   };

//   const removeSection1Card = (index) => {
//     const updated = [...formData.section1Cards];
//     const updatedPreviews = [...previews.section1Cards];
//     updated.splice(index, 1);
//     updatedPreviews.splice(index, 1);
//     setFormData({ ...formData, section1Cards: updated });
//     setPreviews({ ...previews, section1Cards: updatedPreviews });
//   };

//   const addSection2Card = () => {
//     setFormData({
//       ...formData,
//       section2Cards: [
//         ...formData.section2Cards,
//         { title: "", description: "" },
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

//       Object.keys(formData).forEach((key) => {
//         if (
//           Array.isArray(formData[key]) ||
//           key === "section1Cards" ||
//           key === "section2Cards"
//         )
//           return;
//         data.append(key, formData[key]);
//       });

//       formData.section1Cards.forEach((card, i) => {
//         data.append(`section1Cards[${i}][title]`, card.title);
//         data.append(`section1Cards[${i}][description]`, card.description);
//         if (card.image) data.append(`section1Cards[${i}][image]`, card.image);
//       });

//       formData.section2Cards.forEach((card, i) => {
//         data.append(`section2Cards[${i}][title]`, card.title);
//         data.append(`section2Cards[${i}][description]`, card.description);
//       });

//       await postAPI("/api/insurance/create", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Insurance page created successfully!");
//       navigate("/super-admin/insurance");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create insurance page");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Insurance Page</h2>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* Section 1 */}
//         <div className="card p-3 mb-4">
//           <h5>Section 1</h5>
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
//           <h6>Cards (Image, Title, Description)</h6>
//           {formData.section1Cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <label>Card Image</label>
//               <input
//                 type="file"
//                 className="form-control mb-2"
//                 onChange={(e) =>
//                   updateSection1Card(index, "image", e.target.files[0])
//                 }
//               />
//               {previews.section1Cards[index] && (
//                 <img
//                   src={previews.section1Cards[index]}
//                   alt="Preview"
//                   className="img-thumbnail mb-2"
//                   style={{ width: "150px", height: "auto" }}
//                 />
//               )}
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Title"
//                 value={card.title}
//                 onChange={(e) => updateSection1Card(index, "title", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) =>
//                   updateSection1Card(index, "description", e.target.value)
//                 }
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeSection1Card(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={addSection1Card}
//           >
//             + Add Section 1 Card
//           </button>
//         </div>

//         {/* Section 2 */}
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
//           <h6>Cards (Title, Description)</h6>
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
//                 onChange={(e) =>
//                   updateSection2Card(index, "description", e.target.value)
//                 }
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeSection2Card(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={addSection2Card}
//           >
//             + Add Section 2 Card
//           </button>
//         </div>

//         {/* Section 3 */}
//         <div className="card p-3 mb-4">
//           <h5>Section 3</h5>
//           <input
//             name="section3Heading"
//             placeholder="Section 3 Heading"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//           <textarea
//             name="section3Description"
//             placeholder="Section 3 Description"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//         </div>

//         {/* Status */}
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

// export default InsuranceCreate;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import postAPI from "../../../../api/postAPI";

// const InsuranceCreate = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     section1Heading: "",
//     section1Description: "",
//     section1Cards: [],
//     section2Heading: "",
//     section2Description: "",
//     section2Cards: [],
//     section3Heading: "",
//     section3Description: "",
//     section3Cards: [],
//     status: "draft",
//   });

//   const [previews, setPreviews] = useState({
//     section1Cards: [],
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const addSection1Card = () => {
//     setFormData({
//       ...formData,
//       section1Cards: [
//         ...formData.section1Cards,
//         { image: null, title: "", description: "" },
//       ],
//     });
//     setPreviews({
//       ...previews,
//       section1Cards: [...previews.section1Cards, null],
//     });
//   };

//   const updateSection1Card = (index, field, value) => {
//     const updated = [...formData.section1Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section1Cards: updated });

//     if (field === "image") {
//       const updatedPreviews = [...previews.section1Cards];
//       updatedPreviews[index] = value ? URL.createObjectURL(value) : null;
//       setPreviews({ ...previews, section1Cards: updatedPreviews });
//     }
//   };

//   const removeSection1Card = (index) => {
//     const updated = [...formData.section1Cards];
//     const updatedPreviews = [...previews.section1Cards];
//     updated.splice(index, 1);
//     updatedPreviews.splice(index, 1);
//     setFormData({ ...formData, section1Cards: updated });
//     setPreviews({ ...previews, section1Cards: updatedPreviews });
//   };

//   const addSection2Card = () => {
//     setFormData({
//       ...formData,
//       section2Cards: [...formData.section2Cards, { title: "", description: "" }],
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

//   const addSection3Card = () => {
//     setFormData({
//       ...formData,
//       section3Cards: [
//         ...formData.section3Cards,
//         {
//           heading: "",
//           description: "",
//           price: "",
//           cancelCondition: "",
//           eligibility: "",
//           pointers: [""],
//         },
//       ],
//     });
//   };

//   const updateSection3Card = (index, field, value) => {
//     const updated = [...formData.section3Cards];
//     updated[index][field] = value;
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const removeSection3Card = (index) => {
//     const updated = [...formData.section3Cards];
//     updated.splice(index, 1);
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const addPointer = (cardIndex) => {
//     const updated = [...formData.section3Cards];
//     updated[cardIndex].pointers.push("");
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const updatePointer = (cardIndex, pointerIndex, value) => {
//     const updated = [...formData.section3Cards];
//     updated[cardIndex].pointers[pointerIndex] = value;
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const removePointer = (cardIndex, pointerIndex) => {
//     const updated = [...formData.section3Cards];
//     updated[cardIndex].pointers.splice(pointerIndex, 1);
//     setFormData({ ...formData, section3Cards: updated });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();

//       Object.keys(formData).forEach((key) => {
//         if (
//           Array.isArray(formData[key]) ||
//           key === "section1Cards" ||
//           key === "section2Cards" ||
//           key === "section3Cards"
//         )
//           return;
//         data.append(key, formData[key]);
//       });

//       formData.section1Cards.forEach((card, i) => {
//         data.append(`section1Cards[${i}][title]`, card.title);
//         data.append(`section1Cards[${i}][description]`, card.description);
//         if (card.image) data.append(`section1Cards[${i}][image]`, card.image);
//       });

//       formData.section2Cards.forEach((card, i) => {
//         data.append(`section2Cards[${i}][title]`, card.title);
//         data.append(`section2Cards[${i}][description]`, card.description);
//       });

//       formData.section3Cards.forEach((card, i) => {
//         data.append(`section3Cards[${i}][heading]`, card.heading);
//         data.append(`section3Cards[${i}][description]`, card.description);
//         data.append(`section3Cards[${i}][price]`, card.price);
//         data.append(`section3Cards[${i}][cancelCondition]`, card.cancelCondition);
//         data.append(`section3Cards[${i}][eligibility]`, card.eligibility);
//         card.pointers.forEach((pointer, j) => {
//           data.append(`section3Cards[${i}][pointers][${j}]`, pointer);
//         });
//       });

//       await postAPI("/api/insurance/create", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Insurance page created successfully!");
//       navigate("/super-admin/insurance");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create insurance page");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <h2>Create Insurance Page</h2>
//       </div>

//       <form onSubmit={handleSubmit}>
//        {/* Section 1 */}
//         <div className="card p-3 mb-4">
//            <h5>Section 1</h5>
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
//           <h6>Cards (Image, Title, Description)</h6>
//           {formData.section1Cards.map((card, index) => (
//             <div key={index} className="border p-2 mb-3">
//               <label>Card Image</label>
//               <input
//                 type="file"
//                 className="form-control mb-2"
//                 onChange={(e) =>
//                   updateSection1Card(index, "image", e.target.files[0])
//                 }
//               />
//               {previews.section1Cards[index] && (
//                 <img
//                   src={previews.section1Cards[index]}
//                   alt="Preview"
//                   className="img-thumbnail mb-2"
//                   style={{ width: "150px", height: "auto" }}
//                 />
//               )}
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Title"
//                 value={card.title}
//                 onChange={(e) => updateSection1Card(index, "title", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) =>
//                   updateSection1Card(index, "description", e.target.value)
//                 }
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeSection1Card(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={addSection1Card}
//           >
//             + Add Section 1 Card
//           </button>
//         </div>

//         {/* Section 2 */}
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
//           <h6>Cards (Title, Description)</h6>
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
//                 onChange={(e) =>
//                   updateSection2Card(index, "description", e.target.value)
//                 }
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeSection2Card(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={addSection2Card}
//           >
//             + Add Section 2 Card
//           </button>
//         </div>

//         <div className="card p-3 mb-4">
//           <h5>Section 3</h5>
//           <input
//             name="section3Heading"
//             placeholder="Section 3 Heading"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />
//           <textarea
//             name="section3Description"
//             placeholder="Section 3 Description"
//             className="form-control mb-2"
//             onChange={handleChange}
//           />

//           <h6>Cards (Heading, Description, Price, Cancel Condition, Eligibility, Pointers)</h6>
//           {formData.section3Cards.map((card, index) => (
//             <div key={index} className="border p-3 mb-3">
//               <input
//                 className="form-control mb-2"
//                 placeholder="Card Heading"
//                 value={card.heading}
//                 onChange={(e) => updateSection3Card(index, "heading", e.target.value)}
//               />
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Card Description"
//                 value={card.description}
//                 onChange={(e) =>
//                   updateSection3Card(index, "description", e.target.value)
//                 }
//               />
//               <input
//                 className="form-control mb-2"
//                 placeholder="Price"
//                 value={card.price}
//                 onChange={(e) => updateSection3Card(index, "price", e.target.value)}
//               />

//               {/* ✅ New Cancel Condition field */}
//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Cancel Condition (small text)"
//                 style={{ fontSize: "13px" }}
//                 value={card.cancelCondition}
//                 onChange={(e) =>
//                   updateSection3Card(index, "cancelCondition", e.target.value)
//                 }
//               />

//               <textarea
//                 className="form-control mb-2"
//                 placeholder="Eligibility Description"
//                 value={card.eligibility}
//                 onChange={(e) =>
//                   updateSection3Card(index, "eligibility", e.target.value)
//                 }
//               />

//               <div className="pointers-section">
//                 <strong>Pointers:</strong>
//                 {card.pointers.map((pointer, pIndex) => (
//                   <div key={pIndex} className="d-flex align-items-center mb-2">
//                     <input
//                       className="form-control me-2"
//                       placeholder={`Pointer ${pIndex + 1}`}
//                       value={pointer}
//                       onChange={(e) =>
//                         updatePointer(index, pIndex, e.target.value)
//                       }
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-danger btn-sm"
//                       onClick={() => removePointer(index, pIndex)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   className="btn btn-secondary btn-sm"
//                   onClick={() => addPointer(index)}
//                 >
//                   + Add Pointer
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm mt-3"
//                 onClick={() => removeSection3Card(index)}
//               >
//                 Remove Card
//               </button>
//             </div>
//           ))}

//           <button
//             type="button"
//             className="btn btn-primary mt-2"
//             onClick={addSection3Card}
//           >
//             + Add Section 3 Card
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

// export default InsuranceCreate;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postAPI from "../../../../api/postAPI";

const InsuranceCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    section1Heading: "",
    section1Description: "",
    section1Cards: [],
    section2Heading: "",
    section2Description: "",
    section2Cards: [],
    section3Heading: "",
    section3Description: "",
    section3Cards: [],
    status: "draft",
  });

  const [previews, setPreviews] = useState({
    section1Cards: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSection1Card = () => {
    setFormData({
      ...formData,
      section1Cards: [
        ...formData.section1Cards,
        { image: null, title: "", description: "" },
      ],
    });
    setPreviews({
      ...previews,
      section1Cards: [...previews.section1Cards, null],
    });
  };

  const updateSection1Card = (index, field, value) => {
    const updated = [...formData.section1Cards];
    updated[index][field] = value;
    setFormData({ ...formData, section1Cards: updated });

    if (field === "image") {
      const updatedPreviews = [...previews.section1Cards];
      updatedPreviews[index] = value ? URL.createObjectURL(value) : null;
      setPreviews({ ...previews, section1Cards: updatedPreviews });
    }
  };

  const removeSection1Card = (index) => {
    const updated = [...formData.section1Cards];
    const updatedPreviews = [...previews.section1Cards];
    updated.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFormData({ ...formData, section1Cards: updated });
    setPreviews({ ...previews, section1Cards: updatedPreviews });
  };

  const addSection2Card = () => {
    setFormData({
      ...formData,
      section2Cards: [
        ...formData.section2Cards,
        { title: "", description: "" },
      ],
    });
  };

  const updateSection2Card = (index, field, value) => {
    const updated = [...formData.section2Cards];
    updated[index][field] = value;
    setFormData({ ...formData, section2Cards: updated });
  };

  const removeSection2Card = (index) => {
    const updated = [...formData.section2Cards];
    updated.splice(index, 1);
    setFormData({ ...formData, section2Cards: updated });
  };

  const addSection3Card = () => {
    setFormData({
      ...formData,
      section3Cards: [
        ...formData.section3Cards,
        {
          heading: "",
          description: "",
          price: "",
          cancelCondition: "",
          eligibility: "",
          pointers: [""],
          buttonName: "",
          buttonLink: "",
        },
      ],
    });
  };

  const updateSection3Card = (index, field, value) => {
    const updated = [...formData.section3Cards];
    updated[index][field] = value;
    setFormData({ ...formData, section3Cards: updated });
  };

  const removeSection3Card = (index) => {
    const updated = [...formData.section3Cards];
    updated.splice(index, 1);
    setFormData({ ...formData, section3Cards: updated });
  };

  const addPointer = (cardIndex) => {
    const updated = [...formData.section3Cards];
    updated[cardIndex].pointers.push("");
    setFormData({ ...formData, section3Cards: updated });
  };

  const updatePointer = (cardIndex, pointerIndex, value) => {
    const updated = [...formData.section3Cards];
    updated[cardIndex].pointers[pointerIndex] = value;
    setFormData({ ...formData, section3Cards: updated });
  };

  const removePointer = (cardIndex, pointerIndex) => {
    const updated = [...formData.section3Cards];
    updated[cardIndex].pointers.splice(pointerIndex, 1);
    setFormData({ ...formData, section3Cards: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          Array.isArray(formData[key]) ||
          key === "section1Cards" ||
          key === "section2Cards" ||
          key === "section3Cards"
        )
          return;
        data.append(key, formData[key]);
      });

      formData.section1Cards.forEach((card, i) => {
        data.append(`section1Cards[${i}][title]`, card.title);
        data.append(`section1Cards[${i}][description]`, card.description);
        if (card.image) data.append(`section1Cards[${i}][image]`, card.image);
      });

      formData.section2Cards.forEach((card, i) => {
        data.append(`section2Cards[${i}][title]`, card.title);
        data.append(`section2Cards[${i}][description]`, card.description);
      });

      formData.section3Cards.forEach((card, i) => {
        data.append(`section3Cards[${i}][heading]`, card.heading);
        data.append(`section3Cards[${i}][description]`, card.description);
        data.append(`section3Cards[${i}][price]`, card.price);
        data.append(
          `section3Cards[${i}][cancelCondition]`,
          card.cancelCondition
        );
        data.append(`section3Cards[${i}][eligibility]`, card.eligibility);
        data.append(`section3Cards[${i}][buttonName]`, card.buttonName);
        data.append(`section3Cards[${i}][buttonLink]`, card.buttonLink);
        card.pointers.forEach((pointer, j) => {
          data.append(`section3Cards[${i}][pointers][${j}]`, pointer);
        });
      });

      await postAPI("/api/insurance/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Insurance page created successfully!");
      navigate("/super-admin/insurance");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create insurance page"
      );
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Insurance Page</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1 */}
        <div className="card p-3 mb-4">
          <h5>Section 1</h5>
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
          <h6>Cards (Image, Title, Description)</h6>
          {formData.section1Cards.map((card, index) => (
            <div key={index} className="border p-2 mb-3">
              <label>Card Image</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) =>
                  updateSection1Card(index, "image", e.target.files[0])
                }
              />
              {previews.section1Cards[index] && (
                <img
                  src={previews.section1Cards[index]}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{ width: "150px", height: "auto" }}
                />
              )}
              <input
                className="form-control mb-2"
                placeholder="Card Title"
                value={card.title}
                onChange={(e) =>
                  updateSection1Card(index, "title", e.target.value)
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Card Description"
                value={card.description}
                onChange={(e) =>
                  updateSection1Card(index, "description", e.target.value)
                }
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeSection1Card(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSection1Card}
          >
            + Add Section 1 Card
          </button>
        </div>

        {/* Section 2 */}
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
          <h6>Cards (Title, Description)</h6>
          {formData.section2Cards.map((card, index) => (
            <div key={index} className="border p-2 mb-3">
              <input
                className="form-control mb-2"
                placeholder="Card Title"
                value={card.title}
                onChange={(e) =>
                  updateSection2Card(index, "title", e.target.value)
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Card Description"
                value={card.description}
                onChange={(e) =>
                  updateSection2Card(index, "description", e.target.value)
                }
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeSection2Card(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSection2Card}
          >
            + Add Section 2 Card
          </button>
        </div>

        {/* Section 3 */}
        <div className="card p-3 mb-4">
          <h5>Section 3</h5>
          <input
            name="section3Heading"
            placeholder="Section 3 Heading"
            className="form-control mb-2"
            onChange={handleChange}
          />
          <textarea
            name="section3Description"
            placeholder="Section 3 Description"
            className="form-control mb-2"
            onChange={handleChange}
          />

          <h6>
            Cards (Heading, Description, Price, Cancel Condition, Eligibility,
            Pointers, Button)
          </h6>
          {formData.section3Cards.map((card, index) => (
            <div key={index} className="border p-3 mb-3">
              <input
                className="form-control mb-2"
                placeholder="Card Heading"
                value={card.heading}
                onChange={(e) =>
                  updateSection3Card(index, "heading", e.target.value)
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Card Description"
                value={card.description}
                onChange={(e) =>
                  updateSection3Card(index, "description", e.target.value)
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Price"
                value={card.price}
                onChange={(e) =>
                  updateSection3Card(index, "price", e.target.value)
                }
              />

              <textarea
                className="form-control mb-2"
                placeholder="Cancel Condition (small text)"
                style={{ fontSize: "13px" }}
                value={card.cancelCondition}
                onChange={(e) =>
                  updateSection3Card(index, "cancelCondition", e.target.value)
                }
              />

              <textarea
                className="form-control mb-2"
                placeholder="Eligibility Description"
                value={card.eligibility}
                onChange={(e) =>
                  updateSection3Card(index, "eligibility", e.target.value)
                }
              />

              <div className="pointers-section">
                <strong>Pointers:</strong>
                {card.pointers.map((pointer, pIndex) => (
                  <div key={pIndex} className="d-flex align-items-center mb-2">
                    <input
                      className="form-control me-2"
                      placeholder={`Pointer ${pIndex + 1}`}
                      value={pointer}
                      onChange={(e) =>
                        updatePointer(index, pIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removePointer(index, pIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => addPointer(index)}
                >
                  + Add Pointer
                </button>
              </div>
              <br />
              <input
                className="form-control mb-2"
                placeholder="Button Name"
                value={card.buttonName}
                onChange={(e) =>
                  updateSection3Card(index, "buttonName", e.target.value)
                }
              />
              <input
                className="form-control mb-2"
                placeholder="Button Link"
                value={card.buttonLink}
                onChange={(e) =>
                  updateSection3Card(index, "buttonLink", e.target.value)
                }
              />

              <button
                type="button"
                className="btn btn-danger btn-sm mt-3"
                onClick={() => removeSection3Card(index)}
              >
                Remove Card
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={addSection3Card}
          >
            + Add Section 3 Card
          </button>
        </div>

        {/* Status */}
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

export default InsuranceCreate;
