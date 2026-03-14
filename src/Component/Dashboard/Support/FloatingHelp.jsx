import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQuestionCircle, FaTimes, FaTicketAlt, FaInfoCircle, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../../AuthContext';

const FloatingHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useAuth();
  const role = userType?.toLowerCase();

  if (!['artist', 'seller', 'buyer'].includes(role)) return null;

  const pathPrefix = role === 'buyer' ? '/my-account/support' : `/${role}/support`;

  const getSuggestions = () => {
    if (location.pathname.includes('order')) {
      return [
        { label: "Track shipment", action: () => {} },
        { label: role === 'buyer' ? "Cancel order" : "Order dispute", action: () => navigate(`${pathPrefix}/raise`, { state: { order_id: 'context' } }) }
      ];
    }
    if (location.pathname.includes('wallet')) {
      return [
        { label: "Withdrawal rules", action: () => {} },
        { label: "Report balance issue", action: () => navigate(`${pathPrefix}/raise`, { state: { wallet: true } }) }
      ];
    }
    return [
      { label: "How to use dashboard", action: () => {} },
      { label: "Payment security", action: () => {} }
    ];
  };

  const suggestions = getSuggestions();

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end">
      {/* Help Panel */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-72 mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#5C4033] p-6 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FaQuestionCircle /> Quick Help
            </h3>
            <p className="text-xs text-white/70 mt-1">We're here to assist you 24/7</p>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-2">Suggestions</label>
              <div className="space-y-1">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={s.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors group"
                  >
                    <span>{s.label}</span>
                    <FaChevronRight className="text-gray-300 group-hover:text-[#5C4033] text-xs" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <button 
                onClick={() => {
                  navigate(`${pathPrefix}/raise`);
                  setIsOpen(false);
                }}
                className="w-full bg-[#5C4033]/5 text-[#5C4033] hover:bg-[#5C4033] hover:text-white p-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-sm shadow-sm"
              >
                <FaTicketAlt /> Raise a Ticket
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 flex gap-3 items-center">
            <FaInfoCircle className="text-blue-500 shrink-0 text-xs" />
            <p className="text-[10px] text-blue-700 leading-tight">
              Tickets are auto-linked to your current page context.
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-[#5C4033] hover:bg-[#4A3328]'
        }`}
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaQuestionCircle className="text-2xl" />}
      </button>
    </div>
  );
};

export default FloatingHelp;
