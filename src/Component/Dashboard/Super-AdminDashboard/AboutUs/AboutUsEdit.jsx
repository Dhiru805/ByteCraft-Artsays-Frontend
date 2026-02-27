

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const sections = [
  { id: "whoWeAre", label: "Who We Are" },
  { id: "whatWeDo", label: "What We Do" },
  { id: "missionVision", label: "Mission & Vision" },
  { id: "ourValues", label: "Our Values" },
  { id: "deliveryProcess", label: "Delivery Process" },
  { id: "meetTeam", label: "Meet the Team" },
  { id: "testimonials", label: "Testimonials" },
];

const sectionRoutes = {
  whoWeAre: "about-us/who-we-are/edit",
  whatWeDo: "about-us/what-we-do/edit",
  missionVision: "about-us/mission-vision/edit",
  ourValues: "about-us/our-values/edit",
  deliveryProcess: "about-us/delivery-process/edit",
  meetTeam: "about-us/meet-team/edit",
  testimonials: "about-us/testimonials/edit",
};

const AboutUsUpdate = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const [pageData, setPageData] = useState(null);
  const [pageStatus, setPageStatus] = useState("draft");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axiosInstance.get(`/api/about-us`);
        const pages = Array.isArray(res.data.data) ? res.data.data : [];
        const latest = pages[0] || null;
        setPageData(latest);
        setPageStatus(latest?.status || "draft");
        console.log("AboutUs page data:", latest); 
      } catch (err) {
        console.error("Failed to fetch page:", err);
      }
    };
    fetchPage();
  }, [pageId]);

  const handleSectionClick = (sectionId) => {
    const path = sectionRoutes[sectionId];
    if (path) {
      navigate(`/super-admin/${path}`, {
        state: {
          aboutUsId: pageData?._id,
          sectionId: pageData?.[sectionId] || null, 
          section: pageData?.[sectionId] || null, 
          data: pageData?.[sectionId] || null, 
        }
      });
    }
  };




  const handleFinalUpdate = async () => {
    if (!pageData) return;

    setLoading(true);
    try {
      const res = await axiosInstance.put(`/api/about-us/update/${pageData?._id}`, {
        status: pageStatus,
      });
      if (res.data.success) {
        toast.success("About Us Page Updated Successfully!");
        navigate("/super-admin/about-us", { state: { reload: true } });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating About Us page.");
    } finally {
      setLoading(false);
    }
  };

  if (!pageData) return <p>Loading...</p>;

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>Edit About Us Page Sections</h2>
      </div>

      <div className="form-group mb-4">
        <label>Page Status</label>
        <select
          className="form-control"
          value={pageStatus}
          onChange={(e) => setPageStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="row mt-4">
        {sections.map((section) => (
          <div key={section.id} className="col-lg-4 col-md-6 mb-3">
            <div
              className="card text-center p-4 shadow hover:shadow-lg cursor-pointer"
              onClick={() => handleSectionClick(section.id)}
            >
              <h5 className="font-bold">{section.label}</h5>
              <p className="text-sm text-gray-600 mt-2">Click to edit this section</p>
            </div>
          </div>
        ))}
      </div>

      <div className="col-12 mt-4">
        <button
          className="btn btn-primary w-full py-3 text-lg font-bold"
          onClick={handleFinalUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Final Update About Us Page"}
        </button>
      </div>
    </div>
  );
};

export default AboutUsUpdate;
