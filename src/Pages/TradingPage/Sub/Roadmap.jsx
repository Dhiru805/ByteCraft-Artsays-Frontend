import React, { useEffect, useRef } from 'react';
import './Roadmap.css';
 
const Roadmap = () => {
  const phases = [
    { phase: "Phase 01", title: "Planning", description: "Quality comes first. We took our time to plan out everything and build our production pipeline for good quality artworks.", percentage: "0%" },
    { phase: "Phase 02", title: "Production", description: "Quality comes first. We took our time to plan out everything and build our production pipeline for good quality artworks.", percentage: "25%" },
    { phase: "Phase 03", title: "Launch", description: "Quality comes first. We took our time to plan out everything and build our production pipeline for good quality artworks.", percentage: "50%" },
    { phase: "Phase 04", title: "Minting", description: "Quality comes first. We took our time to plan out everything and build our production pipeline for good quality artworks.", percentage: "75%" },
    { phase: "Phase 05", title: "New NFTs", description: "Quality comes first. We took our time to plan out everything and build our production pipeline for good quality artworks.", percentage: "95%" },
    { phase: "Phase 06", title: "Metaverse", description: "Quality comes first. We took our time to plan out everything and build our production pipeline for good quality artworks.", percentage: "100%" },
  ];
 
  const roadmapRef = useRef();
 
  // 
  useEffect(() => {
    const roadmapItems = roadmapRef.current.querySelectorAll('.content');
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
  
    roadmapItems.forEach((item) => observer.observe(item));
  
    return () => observer.disconnect();
  }, []);
  
 
  return (
    <div className="roadmap-container">
      <h1>Nerko's Roadmap</h1>
      <div className="roadmap" ref={roadmapRef}>
        {phases.map((phase, index) => (
          <div key={index} className={`roadmap-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="roadmap-dot"></div>
            <div className="content">
              <h2>{phase.phase}</h2>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
              <div className="percentage-circle">{phase.percentage}</div>
            </div>
          </div>
        ))}
        <div className="roadmap-line"></div>
      </div>
    </div>
  );
};
 
export default Roadmap;