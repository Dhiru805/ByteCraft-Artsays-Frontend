import React from 'react';
import { Link } from "react-router-dom";
import { User } from 'lucide-react';

export function NavUserState() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/profile" className="nav-link icon-link">
        <User className="h-5 w-5" />
      </Link>
      <style jsx>{`
        .nav-link {
          color: #48372d !important;
          font-weight: bold;
          font-size: 20px;
          padding: 8px 25px !important;
        }
        .icon-link {
          font-size: 18px;
          padding: 8px 25px !important;
        }
        .nav-link:not(.logo):hover,
        .nav-link:not(.logo):focus,
        .nav-link:not(.logo).active {
          border: 1px solid #48372d;
          border-radius: 30px;
          background-color: #ffffff;
          color: #2a1e17 !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  )
}
