import React, { useState } from 'react';
import './Jobs.css';

const jobs = {
  featured: [
    { title: 'Development Team Lead', location: 'Washington, D.C.', salary: '$1200 - $1300', logo: 'path/to/logo1.png' },
    { title: 'Make my website responsive device compatible', location: 'New York', salary: '$200 - $340', logo: 'path/to/logo2.png' },
  ],
  recent: [
    { title: 'Looking Graphic Designer (Logo + UI)', location: 'Washington, D.C.', salary: '$1200/mo', logo: 'path/to/logo3.png' },
    { title: 'Are you Typography Expert?', location: 'New York', salary: '$56 - $90', logo: 'path/to/logo4.png' },
    { title: 'Looking WordPress Developer for ThemeForest', location: 'Washington, D.C.', salary: '$400 - $540', logo: 'path/to/logo5.png' },
    { title: 'Hiring Web Designer for Project', location: 'Washington, D.C.', salary: '$350 - $450', logo: 'path/to/logo6.png' },
  ],
};

const Jobs = () => {
  const [filter, setFilter] = useState('all');
  const [displayedJobs, setDisplayedJobs] = useState(jobs.featured.concat(jobs.recent));

  const handleFilterChange = (filter) => {
    setFilter(filter);
    if (filter === 'all') {
      setDisplayedJobs(jobs.featured.concat(jobs.recent));
    } else {
      setDisplayedJobs(jobs[filter]);
    }
  };

  return (
    <div className="app">
      <h1>Recent & Featured Jobs</h1>
      <div>
        <button onClick={() => handleFilterChange('all')} className="view-all">View All</button>
        <button onClick={() => handleFilterChange('featured')} className="view-all">Featured Jobs</button>
        <button onClick={() => handleFilterChange('recent')} className="view-all">Recent Jobs</button>
      </div>
      <JobList title="Current Jobs" jobs={displayedJobs} />
    </div>
  );
};

const JobList = ({ title, jobs }) => {
  return (
    <div className="job-list">
      <h2>{title}</h2>
      <div className="job-cards">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <div className="job-logo">
        <img src={job.logo} alt={job.title + " logo"} />
      </div>
      <div className="job-details">
        <h3>{job.title}</h3>
        <p>{job.location}</p>
        <p>{job.salary}</p>
        <div className="job-actions">
          <button className="apply-now">Apply Now</button>
          <button className="save-job">❤️</button>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
