import React, { useEffect, useState, useRef } from 'react';
// import './Counter.css';
 
const Counter = () => {
  const [year, setYear] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [countries, setCountries] = useState(0);
  const [rating, setRating] = useState(0);
 
  const sectionRef = useRef(null);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const targetYear = 2020;
          const targetCustomers = 25;
          const targetCountries = 14;
          const targetRating = 5;
          const duration = 1.5 * 1000; // 5 seconds
 
          const startTimestamp = Date.now();
 
          const updateNumbers = () => {
            const progress = (Date.now() - startTimestamp) / duration;
            if (progress < 1) {
              setYear(Math.floor(progress * targetYear));
              setCustomers(Math.floor(progress * targetCustomers));
              setCountries(Math.floor(progress * targetCountries));
              setRating(Math.floor(progress * targetRating));
            } else {
              setYear(targetYear);
              setCustomers(targetCustomers);
              setCountries(targetCountries);
              setRating(targetRating);
              clearInterval(interval);
            }
          };
 
          const interval = setInterval(updateNumbers, 30);
 
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );
 
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
 
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
 
  return (
    <div ref={sectionRef} className="container-fluid bg-dark text-white py-5 me-2 ms-2" >
      <div className="rows pl-0 pr-0 text-center">
        <div className="col-12">
          <h1 className="fade-in">We develop strategic software solutions for businesses.</h1>
        </div>
      </div>
      <div className="rows d-flex flex-wrap pl-0 pr-0 text-center my-4">
        <div className="col-md-3 col-sm-6 my-3">
          <h1 className="drop-in number">{year}</h1>
          <p className='count-font'>Year of Establishment</p>
        </div>
        <div className="col-md-3 col-sm-6 my-3">
          <h1 className="drop-in number">{customers}+</h1>
          <p className='count-font'>of Customers Worldwide</p>
        </div>
        <div className="col-md-3 col-sm-6 my-3">
          <h1 className="drop-in number">{countries}+</h1>
          <p className='count-font'>Countries with Active Client Base</p>
        </div>
        <div className="col-md-3 col-sm-6 my-3">
          <h1 className="drop-in number">{rating}</h1>
          <p className='count-font'>Star Customer Rating</p>
        </div>
      </div>
      <div className="rows pl-0 pr-0 text-center">
        <div className="col-12">
          <p className="fade-in count-font">
            You have better things to do than worry about IT for your small business.{' '}
            <a href="#" className="text-white">
              <u>Let's Discuss about Project.</u>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Counter;