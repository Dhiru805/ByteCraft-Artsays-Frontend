import React, { useState } from 'react';
import './partnerfaqsection.css'

const PartnerFaqsection = () => {

   
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const accordionData = [
    {
      title: 'What is the Airtable Services Partner Program?',
      content: `The Airtable Services Partner Program provides accreditation and ongoing support for partner organizations to deliver implementation services on the Airtable platform. These services include workflow discovery, solution design, solution implementation, change management, training and ongoing support.

      Services Partners are accredited by Airtable after completing assigned trainings and testing. Once accredited, Services Partners are eligible for lead referrals and subcontracting with Airtable.`,
    },
    {
      title: 'What are the requirements of joining the Airtable Services Partner Program?',
      content: `Content for the requirements of joining the Airtable Services Partner Program.`,
    },
    {
      title: 'What are the benefits of joining the Airtable Services Partner Program?',
      content: `Content for the benefits of joining the Airtable Services Partner Program.`,
    },
    {
      title: 'What types of services can I offer as an Airtable Services Partner?',
      content: `Content for the types of services offered as an Airtable Services Partner.`,
    },
    {
      title: 'How do I apply to become an Airtable Services Partner?',
      content: `Content for applying to become an Airtable Services Partner.`,
    },
  ];

      
  return (
    <>
    <div className='partner-Faq-section'>
    <div className="accordion-container">
      <h1 className='main-container-heading'>FAQ</h1>
      <h1 className="accordion-title">You have questions? We have answers.</h1>
      {accordionData.map((item, index) => (
        <div key={index} className="accordion-item">
          <div className="accordion-header" onClick={() => toggleAccordion(index)}>
            <h2>{item.title}</h2>
            <span>{activeIndex === index ? '-' : '+'}</span>
          </div>
          <div className={`accordion-content ${activeIndex === index ? 'active' : ''}`}>
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>

    </div>
    </>
  )
}

export default PartnerFaqsection