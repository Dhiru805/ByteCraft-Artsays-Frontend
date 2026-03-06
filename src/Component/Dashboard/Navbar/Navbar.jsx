import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faFile, faUser, faBox, faNewspaper, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import useSidebarToggle from '../Sidebar/Handletooglesidebar';
import { useNavigate } from "react-router-dom";
import { handleLogout } from '../LogoutConfirmation';
import { useAuth } from '../../../AuthContext';
import SellerNotificationDropdown from '../../Notifications/SellerNotificationDropdown';
import SuperAdminNotificationDropdown from '../../Notifications/SuperAdminNotificationDropdown';
import axiosInstance from '../../../api/axiosConfig';

// ─── Nav pages per role ───────────────────────────────────────────────────────
const NAV_MAP = {
  "Super-Admin": [
    { label: "Dashboard",              path: "/super-admin/dashboard" },
    { label: "Wallet Management",      path: "/super-admin/wallet-management" },
    { label: "Support / Tickets",      path: "/super-admin/support" },
    { label: "Admin",                  path: "/super-admin/admin" },
    { label: "Blogs",                  path: "/super-admin/blog" },
    { label: "Artist Management",      path: "/super-admin/artist/management" },
    { label: "Artist Blog Request",    path: "/super-admin/artist/blogrequest" },
    { label: "Artist Blogs",           path: "/super-admin/artist/blogs" },
    { label: "Artist Product Request", path: "/super-admin/artist/artistproductrequest" },
    { label: "Artist All Products",    path: "/super-admin/artist/allartistproduct" },
    { label: "Artist Sold Product",    path: "/super-admin/artist/sold-product" },
    { label: "Artist Transactions",    path: "/super-admin/artist/artisttransaction" },
    { label: "Artist Packaging Material", path: "/super-admin/artist/artistpackagingmaterial" },
    { label: "Buyer Management",       path: "/super-admin/buyer/management" },
    { label: "Buyer Product Purchased",path: "/super-admin/buyer/productpurchased" },
    { label: "Buyer Resell Product",   path: "/super-admin/buyer/resellproduct" },
    { label: "Buyer Sold Product",     path: "/super-admin/buyer/soldproduct" },
    { label: "Buyer Transactions",     path: "/super-admin/buyer/transaction" },
    { label: "Seller Management",      path: "/super-admin/seller/management" },
    { label: "Seller Products",        path: "/super-admin/seller/product" },
    { label: "Seller Product Request", path: "/super-admin/seller/productrequest" },
    { label: "Seller Sold Product",    path: "/super-admin/seller/soldproduct" },
    { label: "Seller Transactions",    path: "/super-admin/seller/transaction" },
    { label: "Seller Packaging Material", path: "/super-admin/seller/packagingmaterial" },
    { label: "Celebrities",            path: "/super-admin/celebrities" },
    { label: "Products",               path: "/super-admin/product-table" },
    { label: "Custom Orders",          path: "/super-admin/customordertable" },
    { label: "Product Purchased",      path: "/super-admin/purchasetable" },
    { label: "Bidding All Products",   path: "/super-admin/bidding/allproduct" },
    { label: "Bidded Product",         path: "/super-admin/bidding/bidded-product" },
    { label: "Bidding Pass",           path: "/super-admin/bidding/pass-table" },
    { label: "Bidding Pass Orders",    path: "/super-admin/bidding/pass-order-table" },
    { label: "Certification Services", path: "/super-admin/certification" },
    { label: "Challenges",             path: "/super-admin/challenges" },
    { label: "Challenge Entries",      path: "/super-admin/challenges-entries" },
    { label: "Sponsor / Advertise",    path: "/super-admin/advertise" },
    { label: "FAQ",                    path: "/super-admin/faq" },
    { label: "Arty CMS",               path: "/super-admin/artCMS" },
    { label: "Career Openings",        path: "/super-admin/career" },
    { label: "Career Applications",    path: "/super-admin/career/applications" },
    { label: "Exhibition",             path: "/super-admin/exhibition" },
    { label: "Exhibition Request",     path: "/super-admin/exhibition-request" },
    { label: "Enquiry",                path: "/super-admin/enquiry" },
    { label: "Newsletter",             path: "/super-admin/newsletter" },
    { label: "Art Gallery",            path: "/super-admin/art-gallery" },
    { label: "Product Type",           path: "/super-admin/product-settings/product-type" },
    { label: "Product Medium",         path: "/super-admin/product-settings/product-medium" },
    { label: "Product Material",       path: "/super-admin/product-settings/product-material" },
    { label: "Product Edition Type",   path: "/super-admin/product-settings/product-edition-type" },
    { label: "Product Surface Type",   path: "/super-admin/product-settings/product-surface-type" },
    { label: "Product Coupon Code",    path: "/super-admin/product-settings/product-coupon-code" },
    { label: "Product Packaging Type", path: "/super-admin/product-settings/product-packaging-type" },
    { label: "Copyrights Rights",      path: "/super-admin/product-settings/copyrights-rights" },
    { label: "Period / Era",           path: "/super-admin/product-settings/period-era" },
    { label: "Blockchain Network",     path: "/super-admin/product-settings/blockchain-network" },
    { label: "Token Standard",         path: "/super-admin/product-settings/token-standard" },
    { label: "Homepage CMS",           path: "/super-admin/homepage" },
    { label: "About Us CMS",           path: "/super-admin/about-us" },
    { label: "Affiliate Program",      path: "/super-admin/affiliate" },
    { label: "Affiliate Brand Partner",path: "/super-admin/affiliate-bp" },
    { label: "How to Bid",             path: "/super-admin/how-to-bid" },
    { label: "How to Buy",             path: "/super-admin/how-to-buy" },
    { label: "How to Sell",            path: "/super-admin/how-to-sell" },
    { label: "How to Re-Sell",         path: "/super-admin/how-to-resell" },
    { label: "Why ArtSays",            path: "/super-admin/why-artsays" },
    { label: "Challenges CMS",         path: "/super-admin/challenge-CMS" },
    { label: "Blogs CMS",              path: "/super-admin/CMS-Blog" },
    { label: "Policies CMS",           path: "/super-admin/policy" },
    { label: "Commissions",            path: "/super-admin/commission" },
    { label: "Certificate CMS",        path: "/super-admin/certificate" },
    { label: "Partner",                path: "/super-admin/partner" },
    { label: "Insurance CMS",          path: "/super-admin/insurance" },
    { label: "Licensing Partner",      path: "/super-admin/licensing" },
    { label: "Art Gallery CMS",        path: "/super-admin/CMS-art-gallery" },
    { label: "Contact Us",             path: "/super-admin/contactus" },
    { label: "Career CMS",             path: "/super-admin/career-CMS" },
    { label: "Product Category",       path: "/super-admin/settings/product-category" },
    { label: "Blog Category",          path: "/super-admin/settings/blog-category" },
    { label: "Email Setting",          path: "/super-admin/settings/email-setting" },
    { label: "Storage Setting",        path: "/super-admin/settings/storage-setting" },
    { label: "Payment Gateway",        path: "/super-admin/settings/payment-getway" },
    { label: "Email Marketing",        path: "/super-admin/settings/marketing" },
    { label: "User Role",              path: "/super-admin/settings/user-role" },
    { label: "Certification Settings", path: "/super-admin/settings/certification" },
    { label: "GST Settings",           path: "/super-admin/settings/GST" },
    { label: "Insurance Settings",     path: "/super-admin/settings/insurance" },
    { label: "Exhibition Settings",    path: "/super-admin/settings/exhibition" },
    { label: "Sidebar Visibility",     path: "/super-admin/settings/sidebar-visibility" },
    { label: "Auto Targeting",         path: "/super-admin/settings/auto-targeting" },
    { label: "Google OAuth",           path: "/super-admin/settings/google-oauth" },
    { label: "Feedback Form",          path: "/super-admin/settings/feedback-form" },
    { label: "SMS Settings",           path: "/super-admin/sms-settings/signup-sms" },
    { label: "Community Policies",     path: "/super-admin/community-cms/policies" },
    { label: "Verification Badge",     path: "/super-admin/community-cms/verification-badge" },
    { label: "Reports",                path: "/super-admin/community-cms/reports" },
    { label: "Sponsors",               path: "/super-admin/community-cms/sponsors" },
    { label: "Purchase Badge",         path: "/super-admin/community-cms/purchase-badge" },
    { label: "Membership Orders",      path: "/super-admin/community-cms/membership-orders" },
    { label: "Packaging Material",     path: "/super-admin/packaging-material/material" },
    { label: "Packaging Orders",       path: "/super-admin/packaging-material/order" },
    { label: "Material Name",          path: "/super-admin/packaging-material-setting/material-name" },
    { label: "Material Size",          path: "/super-admin/packaging-material-setting/material-size" },
    { label: "Capacity",               path: "/super-admin/packaging-material-setting/capacity" },
    { label: "Stamp",                  path: "/super-admin/packaging-material-setting/stamp" },
    { label: "Stickers",               path: "/super-admin/packaging-material-setting/stickers" },
    { label: "Vouchers",               path: "/super-admin/packaging-material-setting/vouchers" },
    { label: "Card",                   path: "/super-admin/packaging-material-setting/card" },
  ],
  Artist: [
    { label: "Dashboard",              path: "/artist/dashboard" },
    { label: "Support / Tickets",      path: "/artist/support" },
    { label: "Blogs",                  path: "/artist/bloglist" },
    { label: "Products",               path: "/artist/product" },
    { label: "Custom Orders",          path: "/artist/custom-order" },
    { label: "Product Purchased",      path: "/artist/product-purchase" },
    { label: "Advertise",              path: "/artist/advertise" },
    { label: "Bidding All Products",   path: "/artist/bidding-products-table" },
    { label: "Bidded Products",        path: "/artist/bidded-products-table" },
    { label: "Bidding Pass",           path: "/artist/bidding-pass-table" },
    { label: "Certification Services", path: "/artist/certification" },
    { label: "Product Insurance",      path: "/artist/insurance" },
    { label: "Exhibition",             path: "/artist/exhibition" },
    { label: "Packaging Material",     path: "/artist/packaging-material" },
    { label: "Wallet",                 path: "/artist/wallet" },
    { label: "Notifications",          path: "/artist/notifications" },
  ],
  Buyer: [
    { label: "Dashboard",              path: "/buyer/dashboard" },
    { label: "Support / Tickets",      path: "/buyer/support" },
    { label: "Wallet",                 path: "/buyer/wallet" },
  ],
  Seller: [
    { label: "Dashboard",              path: "/seller/dashboard" },
    { label: "Support / Tickets",      path: "/seller/support" },
    { label: "Products",               path: "/seller/product-details" },
    { label: "Product Purchased",      path: "/seller/purchased-product" },
    { label: "Bidding All Products",   path: "/seller/bidding-products-table" },
    { label: "Bidded Products",        path: "/seller/bidded-products-table" },
    { label: "Bidding Pass",           path: "/seller/bidding-pass-table" },
    { label: "Advertise",              path: "/seller/advertise" },
    { label: "Certification Services", path: "/seller/certification" },
    { label: "Product Insurance",      path: "/seller/insurance" },
    { label: "Exhibition",             path: "/seller/exhibition" },
    { label: "Packaging Material",     path: "/seller/packaging-material" },
    { label: "Wallet",                 path: "/seller/wallet" },
    { label: "Product Coupon Code",    path: "/seller/products-settings/product-coupon-code" },
    { label: "Premium Badges",         path: "/seller/premium-badges" },
    { label: "Notifications",          path: "/seller/notifications" },
  ],
};

// type → icon + color
const TYPE_META = {
  Page:    { icon: faFile,       color: '#6c757d' },
  User:    { icon: faUser,       color: '#0d6efd' },
  Product: { icon: faBox,        color: '#198754' },
  Blog:    { icon: faNewspaper,  color: '#6f42c1' },
  Ticket:  { icon: faTicketAlt,  color: '#dc3545' },
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { handleToggleSidebar } = useSidebarToggle();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-brand">
          <button type="button" className="btn-toggle-offcanvas" onClick={handleToggleSidebar}>
            <i className="fa fa-bars"></i>
          </button>
          <button type="button" className="btn-toggle-fullwidth" onClick={handleToggleSidebar}>
            <i className="fa fa-bars"></i>
          </button>
          <a href="/" className="windhavi">Artsays</a>
        </div>

        <div className="navbar-right">
          <SearchForm navigate={navigate} />
          <NavbarMenu navigate={navigate} logout={logout} />
        </div>
      </div>
    </nav>
  );
};

// ─── Search Dropdown via Portal ───────────────────────────────────────────────
const SearchDropdown = ({ groups, focused, query, onSelect, onHover, anchorRef }) => {
  // Flat list for focus index tracking
  const flat = groups.flatMap(g => g.items);

  const highlight = (text) => {
    const q = query.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: '#FB5934', color: '#fff', borderRadius: 3, padding: '0 2px' }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const rect = anchorRef.current?.getBoundingClientRect();

  return createPortal(
    <div style={{
      position:     'fixed',
      top:          rect ? rect.bottom + 4 : 60,
      left:         rect ? rect.left : 0,
      width:        rect ? rect.width : 280,
      zIndex:       999999,
      background:   '#fff',
      border:       '1px solid #e2ddd4',
      borderRadius: 10,
      boxShadow:    '0 10px 32px rgba(10,10,48,0.18)',
      maxHeight:    400,
      overflowY:    'auto',
    }}>
      {flat.length === 0 ? (
        <div style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>No results found</div>
      ) : (
        groups.map((group) => (
          <div key={group.label}>
            {/* Group header */}
            <div style={{
              padding:      '6px 14px 4px',
              fontSize:     11,
              fontWeight:   700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color:         '#aaa',
              background:    '#fafafa',
              borderBottom:  '1px solid #f0ebe6',
              borderTop:     group.label !== groups[0].label ? '1px solid #f0ebe6' : 'none',
            }}>
              {group.label}
            </div>

            {group.items.map((item) => {
              const globalIdx = flat.indexOf(item);
              const meta = TYPE_META[item.type] || TYPE_META.Page;
              const isFocused = globalIdx === focused;
              return (
                <div
                  key={item.path + item.label}
                  onMouseDown={(e) => { e.preventDefault(); onSelect(item.path); }}
                  onMouseEnter={() => onHover(globalIdx)}
                  style={{
                    padding:      '8px 14px',
                    cursor:       'pointer',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          10,
                    background:   isFocused ? '#FB5934' : 'transparent',
                    color:        isFocused ? '#fff' : '#0A0A30',
                    transition:   'background 0.1s',
                    borderBottom: '1px solid #f7f3f0',
                  }}
                >
                  <FontAwesomeIcon
                    icon={meta.icon}
                    style={{
                      fontSize:  12,
                      color:     isFocused ? '#fff' : meta.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {highlight(item.label)}
                    </div>
                    {item.sublabel && (
                      <div style={{ fontSize: 11, color: isFocused ? 'rgba(255,255,255,0.8)' : '#888', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.sublabel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>,
    document.body
  );
};

// ─── Search Form ──────────────────────────────────────────────────────────────
const SearchForm = ({ navigate }) => {
  const [query,    setQuery]    = useState('');
  const [groups,   setGroups]   = useState([]);
  const [open,     setOpen]     = useState(false);
  const [focused,  setFocused]  = useState(0);
  const [loading,  setLoading]  = useState(false);

  const inputRef  = useRef(null);
  const formRef   = useRef(null);
  const debounce  = useRef(null);

  const userType  = localStorage.getItem('userType') || 'Buyer';
  const navItems  = NAV_MAP[userType] || [];

  // Flat list for keyboard nav
  const flat = groups.flatMap(g => g.items);

  // Main search — runs on every query change (debounced for API)
  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setGroups([]);
      setOpen(false);
      return;
    }

    // 1. Instantly show page matches
    const ql = q.toLowerCase();
    const pageMatches = navItems
      .filter(item => item.label.toLowerCase().includes(ql))
      .slice(0, 6)
      .map(item => ({ ...item, type: 'Page' }));

    const immediateGroups = pageMatches.length
      ? [{ label: 'Pages', items: pageMatches }]
      : [];

    setGroups(immediateGroups);
    setOpen(true);
    setFocused(0);

    // 2. Debounce API call for live data
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      if (q.length < 2) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/global-search?q=${encodeURIComponent(q)}`);
        const apiResults = res.data?.results || [];

        // Group API results by type
        const byType = {};
        apiResults.forEach(item => {
          if (!byType[item.type]) byType[item.type] = [];
          byType[item.type].push(item);
        });

        const apiGroups = Object.keys(byType).map(type => ({
          label: type + 's',
          items: byType[type],
        }));

        // Merge: pages first, then data
        const merged = [
          ...(pageMatches.length ? [{ label: 'Pages', items: pageMatches }] : []),
          ...apiGroups,
        ];

        setGroups(merged.length ? merged : []);
        setOpen(merged.length > 0 || q.length > 0); // keep open even with no results to show "No results"
      } catch (_) {
        // silently keep page results on API error
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce.current);
  }, [query, userType]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = useCallback((path) => {
    setQuery('');
    setGroups([]);
    setOpen(false);
    navigate(path);
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused(f => Math.min(f + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocused(f => Math.max(f - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[focused]) go(flat[focused].path);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={formRef} style={{ position: 'relative' }}>
      <form
        id="navbar-search"
        className="navbar-form search-form"
        onSubmit={e => { e.preventDefault(); if (flat[focused]) go(flat[focused].path); }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (groups.length || query.length > 1) setOpen(true); }}
          className="form-control"
          placeholder="Search pages, products..."
          type="text"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            className="btn btn-default"
            onClick={() => { setQuery(''); setGroups([]); setOpen(false); inputRef.current?.focus(); }}
            title="Clear"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        ) : (
          <button type="button" className="btn btn-default">
            {loading
              ? <span style={{ fontSize: 11, opacity: 0.6 }}>...</span>
              : <FontAwesomeIcon icon={faSearch} />
            }
          </button>
        )}
      </form>

      {open && query.trim().length > 0 && (
        <SearchDropdown
          groups={groups}
          focused={focused}
          query={query}
          onSelect={go}
          onHover={setFocused}
          anchorRef={formRef}
        />
      )}
    </div>
  );
};

// ─── Navbar Menu ──────────────────────────────────────────────────────────────
const NavbarMenu = ({ navigate, logout }) => {
  const userType = localStorage.getItem("userType");

  return (
    <div id="navbar-menu">
      <ul className="nav navbar-nav" style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
        <li style={{ display: "flex", alignItems: "center" }}>
          {userType === "Super-Admin" ? (
            <SuperAdminNotificationDropdown />
          ) : (
            <SellerNotificationDropdown />
          )}
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <a
            href="#"
            className="btn btn-secondary px-2 mx-2"
            onClick={() => {
              const role = localStorage.getItem("userType")?.toLowerCase() || 'buyer';
              const path = role === 'buyer' ? '/my-account/support' : `/${role}/support`;
              navigate(path);
            }}
            title="Help & Support"
          >
            Raise Ticket
          </a>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <a
            href="#"
            className="icon-menu"
            onClick={() => handleLogout(navigate, logout)}
            style={{ height: "34px", border: "1px solid rgb(226, 217, 212)", borderRadius: "10px" }}
          >
            <i className="fa fa-power-off"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
