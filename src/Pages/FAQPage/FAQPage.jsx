import React, { useState, useRef, useEffect } from "react";
import "./FAQPage.css";

const FAQPage = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // Default to first category
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // Default to first question in category
  const [heights, setHeights] = useState({});
  const refs = useRef([]);

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "Can I customize my Tiktok feed widget?",
          answer:
            "Absolutely! With Idukki's extensive customization features, you have full control over your widget's appearance. Let your creativity shine with custom CSS or easily adjust the card style and other options to make it uniquely yours.",
        },
        {
          question: "How do I generate a Tiktok embed code for a website?",
          answer: "You can generate an embed code by following the steps in our documentation or using our user-friendly widget editor.",
        },
        {
          question: "Is Idukki's Tiktok feed widget compatible with my website builder?",
          answer: "Our widget is compatible with most website builders, including WordPress, Wix, Squarespace, and more.",
        },
      ],
    },
    {
      category: "Pricing",
      questions: [
        {
          question: "What are the available pricing plans?",
          answer: "We offer several pricing plans, including a free plan, a basic plan, and a premium plan. Each plan has different features and limits. You can find more details on our pricing page.",
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes, we offer a 14-day free trial for our premium features. You can sign up for the trial on our website.",
        },
        {
          question: "Can I cancel my subscription at any time?",
          answer: "Yes, you can cancel your subscription at any time through your account settings. Your access to premium features will continue until the end of your billing cycle.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "How can I contact technical support?",
          answer: "You can contact our technical support team through our support page, where you can submit a ticket or use our live chat feature.",
        },
        {
          question: "What should I do if I encounter a bug?",
          answer: "If you encounter a bug, please report it to our technical support team with as much detail as possible, including screenshots and steps to reproduce the issue.",
        },
        {
          question: "Do you have a knowledge base or help center?",
          answer: "Yes, we have a comprehensive knowledge base and help center where you can find articles, tutorials, and FAQs to help you resolve common issues.",
        },
      ],
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions to reset your password via email.",
        },
        {
          question: "How do I update my account information?",
          answer: "You can update your account information, including your email address and payment details, through the account settings page.",
        },
        {
          question: "How do I delete my account?",
          answer: "If you wish to delete your account, please contact our support team for assistance. Note that deleting your account is irreversible and will remove all your data.",
        },
      ],
    },
    {
      category: "Integration",
      questions: [
        {
          question: "How do I integrate the Tiktok feed widget with my website?",
          answer: "You can integrate the Tiktok feed widget by following the instructions provided in our widget editor and pasting the generated code into your website's HTML.",
        },
        {
          question: "Do you support integration with other platforms?",
          answer: "Yes, we support integration with various platforms including WordPress, Wix, Shopify, and more.",
        },
        {
          question: "Can I use the widget on multiple websites?",
          answer: "Yes, you can use the widget on multiple websites. Our pricing plans include options for multi-site usage.",
        },
      ],
    },
    {
      category: "Security",
      questions: [
        {
          question: "How is my data protected?",
          answer: "We use industry-standard encryption and security protocols to protect your data. Our platform undergoes regular security audits and updates to ensure your information remains safe.",
        },
        {
          question: "Do you comply with data privacy regulations?",
          answer: "Yes, we comply with major data privacy regulations including GDPR and CCPA. We are committed to protecting your privacy and ensuring your data is handled responsibly.",
        },
        {
          question: "How can I report a security vulnerability?",
          answer: "If you discover a security vulnerability, please contact our security team immediately at security@idukki.com. We take all reports seriously and will investigate promptly.",
        },
      ],
    },
    {
      category: "Features",
      questions: [
        {
          question: "What features are included in the premium plan?",
          answer: "The premium plan includes advanced customization options, additional templates, priority support, and more. Check our features page for a detailed comparison of all plans.",
        },
        {
          question: "Can I request a new feature?",
          answer: "Yes, we welcome feedback and feature requests from our users. Please submit your request through our feature request form, and our team will review it for possible inclusion in future updates.",
        },
        {
          question: "Are there any upcoming features?",
          answer: "We regularly update our platform with new features and improvements. You can stay informed about upcoming features by subscribing to our newsletter or checking our blog.",
        },
      ],
    },
    {
      category: "Usage",
      questions: [
        {
          question: "How do I get started with Idukki?",
          answer: "Getting started with Idukki is easy. Simply sign up for an account, choose your widget, and follow the setup instructions. Our onboarding guide will help you through the process.",
        },
        {
          question: "Can I use Idukki for commercial purposes?",
          answer: "Yes, you can use Idukki for both personal and commercial purposes. Our widgets are designed to enhance your website, whether it's a personal blog or a business site.",
        },
        {
          question: "Is there a limit to the number of widgets I can create?",
          answer: "There is no limit to the number of widgets you can create. However, the number of active widgets may be limited by your subscription plan. Check our pricing page for details.",
        },
      ],
    },
  ];

  useEffect(() => {
    const newHeights = refs.current.map((ref) => (ref ? ref.scrollHeight : 0));
    setHeights(newHeights);
  }, [activeCategoryIndex]);

  const toggleFAQ = (index) => {
    setActiveQuestionIndex(activeQuestionIndex === index ? null : index);
  };

  const currentCategory = faqData[activeCategoryIndex];

  return (
    <div className="faq-page-container mx-2">
      <div className="faq-page-top">
        <h2 className="faq-page-title">Frequently Asked Questions</h2>
        <p className="faq-page-description">
          Get the answers to the most commonly asked questions.
        </p>
        <button className=" ci-notify-btn btn btn">View More FAQ's →</button>
      </div>

      <div className="faq-page-tabs">
        {faqData.map((category, index) => (
          <button
            key={index}
            className={`faq-tab-button  ${
              activeCategoryIndex === index ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategoryIndex(index);
              setActiveQuestionIndex(0); // Reset to the first question when category changes
            }}
          >
            {category.category}
          </button>
        ))}
      </div>

      <div className="faq-page-bottom">
        {currentCategory && (
          <div className="faq-page-list">
            {currentCategory.questions.map((faq, index) => (
              <div key={index} className="faq-page-item">
                <div
                  className={`faq-page-question ${
                    activeQuestionIndex === index ? "active" : ""
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span
                    className={`faq-page-icon ${
                      activeQuestionIndex === index ? "minus" : "plus"
                    }`}
                  >
                    {activeQuestionIndex === index ? "-" : "+"}
                  </span>
                </div>
                <div
                  ref={(el) => (refs.current[index] = el)}
                  className={`faq-page-answer ${
                    activeQuestionIndex === index ? "show" : ""
                  }`}
                  style={{
                    maxHeight:
                      activeQuestionIndex === index
                        ? `${heights[index] || 0}px`
                        : "0px",
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQPage;
