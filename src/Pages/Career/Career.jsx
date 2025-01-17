import React from 'react';
import './Career.css';
import Jobs from './Jobs';

const Career = () => {
  return (
    <>
      <div className="page-wrapper">
        <div className="heroBanner d-flex w-100" >
          <div className="searchSection">
            <h1 id='h1'>BUILD YOUR POWERFUL CAREER</h1>
            <p>Find the perfect job or project to advance your career with our powerful search tools.</p>
            <div className="searchFormess">
              <input type="text" placeholder="Keywords" />
              <select>
                <option>New York</option>
                <option>San Francisco</option>
                <option>Los Angeles</option>
              </select>
              <select>
                <option>SEO Specialist</option>
                <option>SEO Manager</option>
                <option>SEO Analyst</option>
              </select>
              <button>SUBMIT NOW</button>
            </div>
            <div className="filters">
              <label><input type="checkbox" /> Freelancer</label>
              <label><input type="checkbox" /> Part Time</label>
              <label><input type="checkbox" /> Full Time</label>
            </div>
          </div>
        </div>
        <section className="categoriesList">
          <div className="categoryCard">
            <i className="fas fa-laptop-code"></i>
            <p>Web Design</p>
          </div>
          <div className="categoryCard">
            <i className="fas fa-code"></i>
            <p>Web Development</p>
          </div>
          <div className="categoryCard">
            <i className="fas fa-pencil-ruler"></i>
            <p>Graphic Design</p>
          </div>
          <div className="categoryCard">
            <i className="fas fa-chart-line"></i>
            <p>SEO Marketing</p>
          </div>
          <div className="categoryCard">
            <i className="fas fa-calculator"></i>
            <p>Accounting</p>
          </div>
          <div className="categoryCard">
            <i className="fas fa-edit"></i>
            <p>Content Writing</p>
          </div>
        </section>
        <Jobs />
      </div>
    </>
  );
};

export default Career;
