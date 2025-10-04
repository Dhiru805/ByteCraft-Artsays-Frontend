import React, { useState, useRef, useEffect } from 'react';
// import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Default to first tab
  const [heights, setHeights] = useState({});
  const refs = useRef([]);

  const faqs = [
    {
      question: "What is User-Generated Content (UGC), and how can it benefit my business?",
      answer: "User-Generated Content (UGC) includes reviews, images, and videos created by your customers. This authentic content boosts trust, enhances engagement, and drives higher conversions for your brand."
    },
    {
      question: "How does Idukki identify and curate UGC for my brand?",
      answer: "Idukki uses advanced algorithms and human review to identify and curate the most relevant and high-quality UGC for your brand."
    },
    {
      question: "How Does Idukki Improve My SEO Rankings?",
      answer: "UGC improves SEO rankings by providing fresh, relevant content that is highly valued by search engines."
    },
    {
      question: "How Does Idukki Help to Use UGC with Permissions?",
      answer: "Idukki ensures that all UGC is used with proper permissions, protecting your brand from legal issues."
    },
    {
      question: "Is it possible to integrate Idukki UGC widget into my existing marketing workflows and tech stack?",
      answer: "Yes, Idukki's UGC widget can be easily integrated into your existing marketing workflows and tech stack."
    },
    {
      question: "How can I measure the impact of Idukki's UGC on my sales and marketing performance?",
      answer: "Idukki provides detailed analytics and reporting to measure the impact of UGC on your sales and marketing performance."
    }
  ];

  useEffect(() => {
    const heights = refs.current.map(ref => ref.scrollHeight);
    setHeights(heights);
  }, []);

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-left">
        <h2>Frequently Asked Questions</h2>
        <p>Get the answers to the most commonly asked questions.</p>
        <button className="ci-notify-btn btn btn">View More FAQ's →</button>
      </div>
      <div className="faq-right">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div
                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className={`faq-icon ${activeIndex === index ? 'minus' : 'plus'}`}>
                  {activeIndex === index ? '-' : '+'}
                </span>
              </div>
              <div
                ref={el => (refs.current[index] = el)}
                className={`faq-answer ${activeIndex === index ? 'show' : ''}`}
                style={{ maxHeight: activeIndex === index ? `${heights[index]}px` : '0px' }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
