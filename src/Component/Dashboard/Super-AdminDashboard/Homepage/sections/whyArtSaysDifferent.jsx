import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";
import getAPI from "../../../../../api/getAPI";

const WhyArtsaysDifferentCreate = () => {
    const navigate = useNavigate();

    const [heading, setHeading] = useState("");
    const [description, setDescription] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [buttonLink, setButtonLink] = useState("");

    const [cards, setCards] = useState([{ title: "", description: "", hexColor: "#000000", icon: null }]);
    const [iconPreviews, setIconPreviews] = useState([null]);

    const [loading, setLoading] = useState(false);
    const [homepageId, setHomepageId] = useState(null);

    useEffect(() => {
        const ensureHomePage = async () => {
            try {
                const res = await getAPI("/api/homepage");
                let page = res.data.data?.[0];
                if (!page) {
                    const createRes = await postAPI("/api/homepage/create", { title: "Homepage", status: "draft" });
                    page = createRes.data.data;
                }
                setHomepageId(page._id);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load Homepage");
            }
        };
        ensureHomePage();
    }, []);

    const validateImageFile = (file) => {
        if (!file.type.match(/image\/(jpeg|png|svg|jpg)/)) {
            toast.error("Icon must be JPEG, PNG or SVG");
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Icon must be less than 5MB");
            return false;
        }
        return true;
    };

    const handleChange = (e, index, field) => {
        const { files, value } = e.target;
        const updatedCards = [...cards];
        const updatedIconPreviews = [...iconPreviews];

        if (files && files[0]) {
            const file = files[0];
            if (!validateImageFile(file)) return;
            updatedCards[index][field] = file;
            updatedIconPreviews[index] = URL.createObjectURL(file);
        } else {
            updatedCards[index][field] = value;
        }

        setCards(updatedCards);
        setIconPreviews(updatedIconPreviews);
    };

    const addCard = () => {
        setCards([...cards, { title: "", description: "", color: "#000000", icon: null }]);
        setIconPreviews([...iconPreviews, null]);
    };

    const removeCard = (idx) => {
        setCards(cards.filter((_, i) => i !== idx));
        setIconPreviews(iconPreviews.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!homepageId) {
                toast.error("Homepage not ready yet. Please wait.");
                setLoading(false);
                return;
            }

            if (!heading.trim() || !description.trim() || !buttonName.trim() || !buttonLink.trim()) {
                toast.error("Heading, description, button name and button link are required");
                setLoading(false);
                return;
            }

            for (let i = 0; i < cards.length; i++) {
                const c = cards[i];
                if (!c.title.trim() || !c.description.trim() || !c.hexColor.trim() || !c.icon) {
                    toast.error(`Card ${i + 1} requires all fields (title, description, color, icon)`);
                    setLoading(false);
                    return;
                }
            }

            const submissionData = new FormData();
            submissionData.append("homepageId", homepageId);
            submissionData.append("heading", heading.trim());
            submissionData.append("description", description.trim());
            submissionData.append("buttonName", buttonName.trim());
            submissionData.append("buttonLink", buttonLink.trim());

            cards.forEach((c, idx) => {
                submissionData.append(`cards[${idx}][title]`, c.title.trim());
                submissionData.append(`cards[${idx}][description]`, c.description.trim());
                submissionData.append(`cards[${idx}][hexColor]`, c.hexColor.trim());
                if (c.icon) submissionData.append(`cards[${idx}][icon]`, c.icon);
            });

            const res = await postAPI("/api/homepage-sections/why-artsays-different/create", submissionData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.data) {
                toast.success(res.data.message || "Why Artsays section saved successfully!");
                navigate("/super-admin/homepage/create", { state: { reload: true } });
            } else {
                toast.error(res.data.message || "Failed to save section");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="block-header">
                <h2>Create Why Artsays Section</h2>
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                
                                <div className="form-group">
                                    <label>Heading *</label>
                                    <input type="text" className="form-control" value={heading} onChange={(e) => setHeading(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Button Name *</label>
                                    <input type="text" className="form-control" value={buttonName} onChange={(e) => setButtonName(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Button Link *</label>
                                    <input type="text" className="form-control" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} required />
                                </div>

                               
                                {cards.map((c, idx) => (
                                    <div key={idx} className="border mb-3 p-3 rounded shadow">
                                        <div className="form-group">
                                            <label>Card Title *</label>
                                            <input type="text" className="form-control" value={c.title} onChange={(e) => handleChange(e, idx, "title")} required />
                                        </div>

                                        <div className="form-group">
                                            <label>Card Description *</label>
                                            <textarea className="form-control" rows={3} value={c.description} onChange={(e) => handleChange(e, idx, "description")} required />
                                        </div>

                                        <div className="form-group">
                                            <label>Hex Color Code *</label>
                                        <input type="text" className="form-control" value={c.hexColor} onChange={(e) => handleChange(e, idx, "hexColor")} placeholder="#000000" required />
                                        </div>

                                        <div className="form-group">
                                            <label>Icon Image *</label>
                                            <input type="file" accept="image/jpeg,image/png,image/svg+xml" className="form-control" onChange={(e) => handleChange(e, idx, "icon")} required />
                                            {iconPreviews[idx] && (
                                                <img src={iconPreviews[idx]} alt="Icon Preview" style={{ maxWidth: "80px", maxHeight: "80px", marginTop: "5px" }} />
                                            )}
                                        </div>

                                        <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeCard(idx)}>Remove Card</button>
                                    </div>
                                ))}

                    
                                <div className="d-flex gap-2 mb-3">
                                    <button type="button" className="btn btn-secondary" onClick={addCard}>
                                        Add Card
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save Section"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyArtsaysDifferentCreate;
