import React, { useState, useEffect } from "react";
import axios from "../../../api/axiosConfig";
import { Clock, CheckCircle } from "lucide-react";
import { PolicyContentSkeleton } from "../../../Component/Skeleton/PolicySkeleton";

const TermsPolicyContent = ({ selectedPolicyId }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPolicyId) {
      setPolicy(null);
      return;
    }

    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/getPolicy/${selectedPolicyId}`);
        if (!res.data.hasError && res.data.data) {
          setPolicy(res.data.data);
        } else {
          setPolicy(null);
        }
      } catch (err) {
        setPolicy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [selectedPolicyId]);

  if (loading) {
    return <PolicyContentSkeleton />;
  }

  if (!policy) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 font-medium">Select a policy from the sidebar to view its details.</p>
      </div>
    );
  }

  return (
    <div id="printable-policy-content" className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 animate-fade-in printable-area">
      <div className="flex flex-wrap items-center gap-4 mb-8 no-print">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 shadow-sm">
          <CheckCircle size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Official Policy</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
          <Clock size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Last Updated: Jan 2026</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
        {policy.title}
      </h1>
      
      <div className="w-20 h-1.5 bg-[#6F4D34] rounded-full mb-12" />

      <style>
        {`
          .policy-rich-text h1, .policy-rich-text h2, .policy-rich-text h3 {
            font-weight: 800;
            color: #111827;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            letter-spacing: -0.025em;
            line-height: 1.2;
          }
          .policy-rich-text h1 { font-size: 2.25rem; }
          .policy-rich-text h2 { font-size: 1.875rem; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.75rem; }
          .policy-rich-text h3 { font-size: 1.5rem; }
          
          .policy-rich-text p {
            margin-bottom: 1.5rem;
            color: #374151;
            line-height: 1.8;
            font-size: 1.05rem;
          }
          
          .policy-rich-text ul, .policy-rich-text ol {
            margin-bottom: 2rem;
            padding-left: 1.5rem;
            color: #374151;
          }
          
          .policy-rich-text li {
            margin-bottom: 0.75rem;
            line-height: 1.6;
          }
          
          .policy-rich-text strong {
            color: #111827;
            font-weight: 700;
          }
          
          .policy-rich-text a {
            color: #6F4D34;
            text-decoration: underline;
            font-weight: 600;
            transition: color 0.2s;
          }
          
          .policy-rich-text a:hover {
            color: #4a3423;
          }

          .policy-rich-text blockquote {
            border-left: 4px solid #6F4D34;
            padding-left: 1.5rem;
            font-style: italic;
            color: #4b5563;
            margin: 2rem 0;
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 0 1rem 1rem 0;
          }

          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            
            body * {
              visibility: hidden !important;
              background-color: white !important;
            }
            
            #printable-policy-content, #printable-policy-content * {
              visibility: visible !important;
              color: black !important;
            }

            #printable-policy-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: white !important;
            }

            .no-print {
              display: none !important;
              visibility: hidden !important;
            }
            
            .policy-rich-text h2 {
              border-bottom: 1px solid #ddd !important;
            }
          }
        `}
      </style>

      <div
        className="policy-rich-text"
        dangerouslySetInnerHTML={{ __html: policy.description }}
      />
      
      <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
        <p className="text-sm text-gray-400">© 2026 ArtSays Platform. All rights reserved.</p>
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default TermsPolicyContent;
