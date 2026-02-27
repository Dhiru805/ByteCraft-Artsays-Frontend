import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../../api/axiosConfig";

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
  whoWeAre: "about-us/who-we-are/create",
  whatWeDo: "about-us/what-we-do/create",
  missionVision: "about-us/mission-vision/create",
  ourValues: "about-us/our-values/create",
  deliveryProcess: "about-us/delivery-process/create",
  meetTeam: "about-us/meet-team/create",
  testimonials: "about-us/testimonials/create",
};

const AboutUsCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sectionsCreated, setSectionsCreated] = useState({});
  const [pageStatus, setPageStatus] = useState("draft");
  const [aboutUsId, setAboutUsId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    const ensureDraftAndStatus = async () => {
      if (initRef.current) return;
      initRef.current = true;
      
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/api/about-us");
        const pages = Array.isArray(res.data.data) ? res.data.data : [];
        let page = pages[0] || null;

        if (!page) {
          const createRes = await axiosInstance.post("/api/about-us/create", {
            title: "About Us",
            status: "draft",
          });
          page = createRes.data.data;
        }

        setAboutUsId(page?._id || null);
        const created = {
          whoWeAre: Boolean(page?.whoWeAre),
          whatWeDo: Boolean(page?.whatWeDo),
          missionVision: Boolean(page?.missionVision),
          ourValues: Boolean(page?.ourValues),
          deliveryProcess: Boolean(page?.deliveryProcess),
          meetTeam: Boolean(page?.meetTeam),
          testimonials: Boolean(page?.testimonials),
        };
        setSectionsCreated(created);
        setPageStatus(page?.status || "draft");
      } catch (err) {
        console.error("Failed to ensure About Us draft/status", err);
        alert("Failed to load About Us page. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    ensureDraftAndStatus();
  }, []);

  useEffect(() => {
    if (location.state?.reload) {

      const refreshData = async () => {
        try {
          const res = await axiosInstance.get("/api/about-us");
          const pages = Array.isArray(res.data.data) ? res.data.data : [];
          const page = pages[0] || null;
          
          if (page) {
            setAboutUsId(page._id);
            const created = {
              whoWeAre: Boolean(page?.whoWeAre),
              whatWeDo: Boolean(page?.whatWeDo),
              missionVision: Boolean(page?.missionVision),
              ourValues: Boolean(page?.ourValues),
              deliveryProcess: Boolean(page?.deliveryProcess),
              meetTeam: Boolean(page?.meetTeam),
              testimonials: Boolean(page?.testimonials),
            };
            setSectionsCreated(created);
            setPageStatus(page?.status || "draft");
          }
        } catch (err) {
          console.error("Failed to refresh About Us data", err);
        }
      };
      
      refreshData();
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.reload]);

  const handleSectionClick = (sectionId) => {
    navigate(`/super-admin/${sectionRoutes[sectionId]}`);
  };

  const handleFinalCreate = async () => {
    if (isCreating) return;
    
    const allCreated = sections.every((s) => sectionsCreated[s.id]);
    if (!allCreated) {
      alert("Please create all sections before finalizing the page.");
      return;
    }

    try {
      setIsCreating(true);
      
      if (aboutUsId) {
        const resUpdate = await axiosInstance.put(`/api/about-us/update/${aboutUsId}`, {
          status: pageStatus,
        });
        if (resUpdate.data.success) {
          alert("About Us Page Updated Successfully!");
          navigate("/super-admin/about-us", { state: { reload: true } });
          return;
        }
      }

      const resCreate = await axiosInstance.post("/api/about-us/create", {
        title: "About Us",
        status: pageStatus,
      });
      if (resCreate.data.success) {
        alert("About Us Page Created Successfully!");
        navigate("/super-admin/about-us", { state: { reload: true } });
      }
    } catch (err) {
      console.error(err);
      alert("Error finalizing About Us page.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading About Us page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>Create About Us Page Sections</h2>
      </div>

      <div className="form-group mb-4">
        <label>Page Status</label>
        <select
          className="form-control"
          value={pageStatus}
          onChange={(e) => setPageStatus(e.target.value)}
          disabled={isCreating}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="row mt-4">
        {sections.map((section) => (
          <div key={section.id} className="col-lg-4 col-md-6 mb-3">
            <div
              className={`card text-center p-4 shadow hover:shadow-lg ${
                sectionsCreated[section.id] ? "border-2 border-success" : ""
              } ${isCreating ? "opacity-50" : ""}`}
              onClick={() => !isCreating && handleSectionClick(section.id)}
              style={{ cursor: isCreating ? "not-allowed" : "pointer" }}
            >
              <h5 className="font-bold">{section.label}</h5>
              <p className="text-sm text-gray-600 mt-2">
                {sectionsCreated[section.id] ? "Section Created" : "Click to create this section"}
              </p>
            </div>
          </div>
        ))}

        <div className="col-12 mt-4">
          <button
            className={`btn btn-primary w-full py-3 text-lg font-bold ${isCreating ? "disabled" : ""}`}
            onClick={handleFinalCreate}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              "Final Create About Us Page"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsCreate;
