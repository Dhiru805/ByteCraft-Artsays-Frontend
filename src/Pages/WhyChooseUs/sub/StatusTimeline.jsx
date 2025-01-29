import React, { useState } from 'react';
import './StatusTimeline.css';

const StatusTimeline = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = [
    "Our company can provide an Average Annual Return ranging from 18% to 20% annually",
    "Our team has received a Recognition for Excellence Award in 20XX & 20XX",
    "Provides 100+ Custom Design Retirement Plans",
    "Serving more than 1 million customers by continually monitoring the market & customer’s plan"
  ];

  return (
    <div className="timeline-container">
      {data.map((item, index) => (
        <div
          key={index}
          className={`timeline-item ${hoveredIndex === index ? 'highlight' : ''}`}
        >
          <div
            className="circle"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {index + 1}
          </div>
          <div className={`content-box ${hoveredIndex === index ? 'highlight' : ''}`}>
            <div className="content">{item}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
