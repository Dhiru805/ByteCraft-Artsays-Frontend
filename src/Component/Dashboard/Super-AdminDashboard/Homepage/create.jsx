import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../api/axiosConfig";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "browseCategories", label: "Browse Categories" },
  { id: "whyFromArtsays", label: "Why Buy From Artsays" },
  { id: "biddingArena", label: "Bidding Arena" },
  { id: "howToBuy", label: "How To Buy" },
  { id: "discoverArtist", label: "Discover Artist" },
  { id: "whyArtsaysDifferent", label: "Why Artsays is Different" },
  { id: "homeChallenges", label: "Challenges" },
  { id: "artIcon", label: "Art Icon" },
  { id: "howToSell", label: "How To Sell" },
];

const sectionRoutes = {
  hero: "homepage/hero/create",
  browseCategories: "homepage/browse-categories/create",
  whyFromArtsays: "homepage/why-buy-artsays/create",
  biddingArena: "homepage/bidding-arena/create",
  howToBuy: "homepage/how-to-buy/create",
  discoverArtist: "homepage/discover-artist/create",
  whyArtsaysDifferent: "homepage/why-artsays-different/create",
  homeChallenges: "homepage/challenges/create",
  artIcon: "homepage/art-icon/create",
  howToSell: "homepage/how-to-sell/create",
};

const HomepageCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sectionsCreated, setSectionsCreated] = useState({});
  const [pageStatus, setPageStatus] = useState("draft");
  const [homepageId, setHomepageId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const initRef = useRef(false);

 
  useEffect(() => {
    const ensureDraftAndStatus = async () => {
      if (initRef.current) return;
      initRef.current = true;
      
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/api/homepage");
        const pages = Array.isArray(res.data.data) ? res.data.data : [];
        let page = pages[0] || null;

        if (!page) {
          const createRes = await axiosInstance.post("/api/homepage/create", {
            title: "Homepage",
            status: "draft",
          });
          page = createRes.data.data;
        }

        setHomepageId(page?._id || null);
        const created = {};
        sections.forEach(sec => {
          const keyMap = {
            hero: "heroSection",
            browseCategories: "browseCategories",
            whyFromArtsays: "whyBuyArtsays",
            biddingArena: "biddingArena",
            howToBuy: "howToBuyHP",
            discoverArtist: "discoverArtist",
            whyArtsaysDifferent: "whyArtsaysDifferent",
            homeChallenges: "challenges",
            artIcon: "artIcon",
            howToSell: "howToSellHP",
          };
          const backendKey = keyMap[sec.id] || sec.id;
          created[sec.id] = Boolean(page?.[backendKey]);
        });
        setSectionsCreated(created);
        setPageStatus(page?.status || "draft");
      } catch (err) {
        console.error("Failed to ensure Homepage draft/status", err);
        toast.error("Failed to load Homepage. Please refresh and try again.");
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
          const res = await axiosInstance.get("/api/homepage");
          const pages = Array.isArray(res.data.data) ? res.data.data : [];
          const page = pages[0] || null;
          
          if (page) {
            setHomepageId(page._id);
            const created = {};
            sections.forEach(sec => {
              const keyMap = {
                hero: "heroSection",
                browseCategories: "browseCategories",
                whyFromArtsays: "whyBuyArtsays",
                biddingArena: "biddingArena",
                howToBuy: "howToBuyHP",
                discoverArtist: "discoverArtist",
                whyArtsaysDifferent: "whyArtsaysDifferent",
                homeChallenges: "challenges",
                artIcon: "artIcon",
                howToSell: "howToSellHP",
              };
              const backendKey = keyMap[sec.id] || sec.id;
              created[sec.id] = Boolean(page?.[backendKey]);
            });
            setSectionsCreated(created);
            setPageStatus(page?.status || "draft");
          }
        } catch (err) {
          console.error("Failed to refresh Homepage data", err);
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
      toast.error("Please create all sections before finalizing the page.");
      return;
    }

    try {
      setIsCreating(true);

      if (homepageId) {
        const resUpdate = await axiosInstance.put(`/api/homepage/update/${homepageId}`, {
          status: pageStatus,
        });
        if (resUpdate.data.success) {
          toast.success("Homepage Updated Successfully!");
          navigate("/super-admin/homepage", { state: { reload: true } });
          return;
        }
      }

      const resCreate = await axiosInstance.post("/api/homepage/create", {
        title: "Homepage",
        status: pageStatus,
      });
      if (resCreate.data.success) {
        toast.success("Homepage Created Successfully!");
        navigate("/super-admin/homepage", { state: { reload: true } });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error finalizing Homepage.");
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
            <p className="mt-3">Loading Homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="block-header d-flex justify-content-between align-items-center">
        <h2>Create Homepage Sections</h2>
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
              "Final Create Homepage"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageCreate;
