import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiShieldCheck, HiCheckBadge } from "react-icons/hi2";
import { BsCreditCard2FrontFill, BsBank2 } from "react-icons/bs";
import { SiVisa, SiMastercard } from "react-icons/si";
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import "./FooterStyle.css";
import { toast } from "react-toastify";
import axios from "../../../api/axiosConfig";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [categoryData, setCategoryData] = useState({ mainCategories: [], categories: [], subCategories: [] });
  const [expandedMain, setExpandedMain] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/all-complete");
        if (res.data?.success) {
          setCategoryData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  const linkSections = [
    {
      title: "ABOUT ARTSAYS",
      links: [
        { label: "About us", to: "/about-us" },
        { label: "Contact Us", to: "/contact-us" },
        { label: "Careers", to: "/career" },
        { label: "Why Artsays Different", to: "/why-artsays" },
        { label: "Benefits of Choosing Artsays", to: "/why-artsays" },
        { label: "Blog / Art Journal", to: "/blogs" },
      ],
    },
    {
      title: "FOR BUYERS",
      links: [
        { label: "Store", to: "/store" },
        { label: "Art Gallery", to: "/art-gallery" },
        { label: "Bidding", to: "/bid" },
        { label: "Discover Artists", to: "/artist-card" },
        { label: "Challenges", to: "/challenge" },
        { label: "How to Buy", to: "/how-to-buy" },
        { label: "Art Icons", to: "/celebrity" },
        { label: "Certificates", to: "/certification" },
        { label: "Insurance", to: "/insurance" },
      ],
    },
    {
      title: "FOR ARTISTS",
      links: [
        { label: "Why Artsays", to: "/why-artsays" },
        { label: "Careers", to: "/career" },
        { label: "How to Sell", to: "/how-to-sell" },
        { label: "Blog / Art Journal", to: "/blogs" },
        { label: "Affiliate Program", to: "/affiliate-program" },
        { label: "Partnerships", to: "/partner" },
        { label: "Commission", to: "/commission" },
      ],
    },
    {
      title: "HELP CENTER",
      links: [
        { label: "FAQs", to: "/policy" },
        { label: "Privacy Policy", to: "/policy" },
        { label: "Terms of Use", to: "/policy" },
        { label: "Shipping & Returns", to: "/policy" },
        { label: "Copyright & Licensing", to: "/policy" },
        { label: "Order Tracking", to: "/my-account/my-orders" },
        { label: "Payment Methods", to: "/policy" },
        { label: "Refund Policy", to: "/policy" },
      ],
    },
  ];

  const socials = [
    { icon: FaFacebookF, url: "https://facebook.com/artsays" },
    { icon: FaInstagram, url: "https://instagram.com/artsays" },
    { icon: FaLinkedinIn, url: "https://linkedin.com/company/artsays" },
    { icon: FaXTwitter, url: "https://twitter.com/artsays" },
    { icon: FaYoutube, url: "https://youtube.com/artsays" },
  ];

  // Build category tree: mainCategory -> categories -> subCategories
  const getCategoryTree = () => {
    const { mainCategories, categories, subCategories } = categoryData;
    return mainCategories.map((main) => {
      const cats = categories.filter(
        (c) => c.mainCategoryId?._id === main._id || c.mainCategoryId === main._id
      );
      return {
        ...main,
        children: cats.map((cat) => {
          const subs = subCategories.filter(
            (s) => s.categoryId?._id === cat._id || s.categoryId === cat._id
          );
          return { ...cat, children: subs };
        }),
      };
    });
  };

  const categoryTree = getCategoryTree();

  const trustBadges = ["100% Safe Transactions", "Verified Artworks & Sellers", "Visa", "MasterCard", "RuPay", "UPI", "Net Banking"];
  const promises = ["Authenticity verified for every artwork", "24/7 artist & buyer support", "Transparent pricing & zero hidden charges"];

  return (
    <footer className="w-full bg-[#111111] text-white">
      <div className="max-w-[1440px] mx-auto py-12 space-y-5">

        {/* Brand Header */}
        <div className="footer-card bg-[#0a0a0a] rounded-[2rem] p-7 md:!p-8 border border-gray-800/60">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="w-full md:items-start sm:items-center">
              <Link to="/">
                <Logo className="logo h-10 w-auto mb-3" />
              </Link>
              <p className="text-white text-lg font-semibold tracking-tight">
                When Art Speaks, Value Grows
              </p>
            </div>
            <p className="md:max-w-2xl text-sm text-white leading-relaxed md:text-right">
              Artsays is a global art marketplace connecting artists, collectors,
              and galleries. Discover original paintings, sculptures, and digital
              art — authenticated, insured, and delivered with care.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Left Column - Newsletter, Contact, Social, Partners — Unified Card */}
            <div className="lg:col-span-4">
              <div className="footer-card bg-[#0a0a0a] rounded-[2rem] border border-gray-800/60 relative overflow-hidden group h-full">
                {/* Top accent line */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FB5934]/60 to-transparent"></div>

                {/* Decorative background glows */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FB5934]/5 rounded-full blur-2xl group-hover:bg-[#FB5934]/10 transition-all duration-500"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#FB5934]/3 rounded-full blur-xl"></div>

                <div className="relative p-7 space-y-0">

                  {/* ── Stay Updated ── */}
                  <div className="pb-3">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="w-8 h-8 rounded-xl bg-[#FB5934]/10 flex items-center justify-center group-hover:bg-[#FB5934]/20 transition-colors">
                        <svg className="w-4 h-4 text-[#FB5934]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <h3 className="footer-section-title text-xs font-bold uppercase tracking-[0.15em] text-[#FB5934] mb-0">
                        Stay Updated
                      </h3>
                    </div>
                    <p className="text-white text-sm mb-4 ml-[42px]">Get the latest art drops and exclusive offers.</p>
                    <form onSubmit={handleSubscribe} className="grid gap-3">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="abc@gmail.com"
                          className="w-full bg-[#161616] border border-gray-800/80 text-white placeholder-gray-600 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-[#FB5934]/50 focus:ring-1 focus:ring-[#FB5934]/20 focus:outline-none transition-all"
                        />
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#FB5934] to-[#e04a28] hover:from-[#e04a28] hover:to-[#c93d1e] text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-[#FB5934]/10 hover:shadow-[#FB5934]/25 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 whitespace-nowrap"
                      >
                        Subscribe
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </form>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-800/60 to-transparent"></div>

                  {/* ── Contact Us ── */}
                  <div className="py-3">
                    <h3 className="footer-section-title text-xs font-bold uppercase tracking-[0.15em] text-[#FB5934] mb-4">
                      Contact Us
                    </h3>
                    <div className="space-y-2.5">
                      <a href="tel:+918668367265" className="flex items-center gap-3 group/contact  hover:border-[#FB5934]/20 transition-all duration-200">
                        <span className="w-8 h-8 bg-[#161616] rounded-lg flex items-center justify-center flex-shrink-0 group-hover/contact:bg-[#FB5934]/10 transition-colors">
                          <img src="/assets/footer/call.svg" alt="call" className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <span className="text-gray-300 text-[10px] uppercase tracking-wider font-medium block leading-none mb-0.5">Phone</span>
                          <span className="text-white text-sm group-hover/contact:text-white transition-colors">+91 8668 36 7265</span>
                        </div>
                      </a>
                      <a href="mailto:contact@artsays.in" className="flex items-center gap-3 group/contact  hover:border-[#FB5934]/20 transition-all duration-200">
                        <span className="w-8 h-8 bg-[#161616] rounded-lg flex items-center justify-center flex-shrink-0 group-hover/contact:bg-[#FB5934]/10 transition-colors">
                          <img src="/assets/footer/mail.svg" alt="mail" className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <span className="text-gray-300 text-[10px] uppercase tracking-wider font-medium block leading-none mb-0.5">Email</span>
                          <span className="text-white text-sm group-hover/contact:text-white transition-colors">contact@artsays.in</span>
                        </div>
                      </a>
                      <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-[#161616] rounded-lg flex items-center justify-center flex-shrink-0">
                          <img src="/assets/footer/location.svg" alt="location" className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <span className="text-gray-300 text-[10px] uppercase tracking-wider font-medium block leading-none mb-0.5">Address</span>
                          <span className="text-white text-sm leading-snug">Pune, Pimpri Chinchwad, Maharashtra, India</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-800/60 to-transparent"></div>

                  {/* ── Follow Us ── */}
                  <div className="py-3">
                    <h3 className="footer-section-title text-xs font-bold uppercase tracking-[0.15em] text-[#FB5934] mb-3">
                      Follow Us
                    </h3>
                    <div className="flex gap-2">
                      {socials.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-social-icon w-9 h-9 bg-[#161616] rounded-lg flex items-center justify-center text-white hover:bg-[#FB5934] transition-all duration-200 border border-gray-800/30 hover:border-[#FB5934]/40"
                        >
                          <social.icon className="text-sm" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-800/60 to-transparent"></div>

                  {/* ── Partner With Us ── */}
                  <div className="pt-3">
                    <h3 className="footer-section-title text-xs font-bold uppercase tracking-[0.15em] text-[#FB5934] mb-3">
                      Partner With Us
                    </h3>
                    <div className="space-y-1.5">
                      <Link to="/partner" className="flex items-center gap-2 text-white hover:pl-2 text-sm transition-colors group/partner">
                        <svg className="w-3.5 h-3.5 text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Become a Gallery Partner
                      </Link>
                      <Link to="/corporate" className="flex items-center gap-2 text-white hover:pl-2 text-sm transition-colors group/partner">
                        <svg className="w-3.5 h-3.5 text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Corporate Art Solutions
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          {/* Right Column - Navigation Links */}
          <div className="lg:col-span-8">
            <div className="footer-card bg-[#0a0a0a] rounded-[2rem] p-7 md:p-8 border border-gray-800/60 h-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                {linkSections.map((section, sIdx) => (
                  <div key={sIdx}>
                    <h3 className="footer-section-title text-xs font-bold uppercase tracking-[0.15em] text-[#FB5934] mb-4 pb-2.5 border-b border-gray-800/40">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <Link
                            to={link.to}
                            className="footer-link text-white text-[13px] leading-relaxed transition-colors inline-block"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

                  {/* Trust & Promise - Unified */}
                    <div className="mt-8 pt-8 border-t border-gray-800/40">
                      <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0d] border border-gray-800/40 group hover:border-gray-700/50 transition-all duration-300">
                        {/* Top accent */}
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FB5934]/60 to-transparent"></div>

                        <div className="p-3 md:!p-6">
                          {/* Header row */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 md:!mb-8">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FB5934] to-[#e04a28] flex items-center justify-center">
                                  <HiShieldCheck className="text-white text-lg" />
                                </div>
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0d0d0d]"></span>
                              </div>
                              <div>
                                <h3 className="text-white text-lg font-bold">Secure Payments & Trust Badges</h3>
                                <p className="text-white text-[11px]">Your transactions are protected & verified</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded-full border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                100% Safe Transactions
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-semibold rounded-full border border-blue-500/20">
                                <HiCheckBadge className="text-xs" />
                                Verified Artworks & Sellers
                              </span>
                            </div>
                          </div>

                          {/* Content: Payments + Promise side by side */}
                          <div className="flex flex-col md:flex-row gap-5">
                            {/* Payment Methods */}
                            <div className="flex-1">
                              <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-3 md:!mb-5">Accepted Payment Methods</h4>
                              <div className="flex flex-wrap gap-3">
                                {[
                                  { icon: <SiVisa className="text-base text-[#1A1F71]" />, label: "Visa" },
                                  { icon: <SiMastercard className="text-base text-[#EB001B]" />, label: "MasterCard" },
                                  { icon: <span className="text-[10px] font-black text-[#6F3B8A]">RuPay</span>, label: "RuPay" },
                                  { icon: <BsCreditCard2FrontFill className="text-sm text-purple-400" />, label: "UPI" },
                                  { icon: <BsBank2 className="text-sm text-amber-400" />, label: "Net Banking" },
                                ].map((method, idx) => (
                                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-[#161616] rounded-lg border border-gray-800/30 hover:border-gray-700/50 hover:bg-[#1a1a1a] transition-all duration-200 cursor-default">
                                    {method.icon}
                                    <span className="text-gray-400 text-[11px] font-medium">{method.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-800/60 to-transparent"></div>
                            <div className="md:hidden h-px bg-gradient-to-r from-transparent via-gray-800/60 to-transparent"></div>

                            {/* Artsays Promise */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3 md:!mb-5">
                                <HiCheckBadge className="text-[#FB5934] text-sm" />
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">Artsays Promise</h4>
                              </div>
                              <div className="space-y-2">
                                {promises.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2.5 group/item">
                                    <span className="w-5 h-5 rounded-md bg-[#FB5934]/15 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#FB5934]/25 transition-colors">
                                      <svg className="w-2.5 h-2.5 text-[#FB5934]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                    <span className="text-white text-xs group-hover/item:pl-2 transition-colors">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
            </div>
          </div>
        </div>

        {/* Categories - Dynamic from Database */}
        <div className="footer-card bg-[#0a0a0a] rounded-[2rem] p-7 border border-gray-800/60">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-8 h-8 rounded-xl bg-[#FB5934]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#FB5934]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            <h3 className="footer-section-title text-xs font-bold uppercase tracking-[0.15em] text-[#FB5934] mb-0">
              Categories
            </h3>
          </div>

          {categoryTree.length > 0 ? (
            <div className="space-y-4">
              {categoryTree.map((main) => (
                <div key={main._id} className="rounded-xl bg-[#0d0d0d] border border-gray-800/30 overflow-hidden">
                  {/* Main Category Header */}
                  <button
                    onClick={() => setExpandedMain(expandedMain === main._id ? null : main._id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#161616] focus:outline-none transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#FB5934]/15 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-[#FB5934]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                          <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                        </svg>
                      </span>
                      <span className="text-white text-sm font-semibold">{main.mainCategoryName}</span>
                      <span className="text-[10px] text-gray-500 bg-[#161616] px-2 py-0.5 rounded-full">
                        {main.children.length} {main.children.length === 1 ? 'category' : 'categories'}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedMain === main._id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded: Categories & SubCategories */}
                  {expandedMain === main._id && main.children.length > 0 && (
                    <div className="px-4 pb-4 border-t border-gray-800/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3">
                        {main.children.map((cat) => (
                          <div key={cat._id} className="space-y-2">
                            <Link
                              to={`/store?category=${encodeURIComponent(cat.categoryName)}`}
                              className="text-[#FB5934] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-1.5"
                            >
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              {cat.categoryName}
                            </Link>
                            {cat.children.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pl-4">
                                {cat.children.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    to={`/store?category=${encodeURIComponent(sub.subCategoryName)}`}
                                    className="footer-category-tag px-2.5 py-1 text-white bg-[#161616] hover:!bg-[#ffffff] hover:!text-[#000000] border border-gray-800/40 rounded-lg text-[11px] transition-all duration-200"
                                  >
                                    {sub.subCategoryName}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collapsed: Show category tags inline */}
                  {expandedMain !== main._id && main.children.length > 0 && (
                    <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                      {main.children.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/store?category=${encodeURIComponent(cat.categoryName)}`}
                          className="footer-category-tag px-3 py-1 text-white bg-[#000000] hover:!bg-[#ffffff] hover:!text-[#000000] hover:border-[#FB5934]/30 border border-gray-800/40 rounded-xl text-xs transition-all duration-200"
                        >
                          {cat.categoryName}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {["Painting", "Sculpture", "Digital Art", "Artifact", "Handmade Crafts", "Photography", "Abstract", "Portrait", "Landscape", "Modern Art", "Contemporary", "Traditional", "Watercolor", "Oil Painting", "Acrylic", "Mixed Media"].map((category, idx) => (
                <Link
                  key={idx}
                  to={`/store?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="footer-category-tag px-3.5 py-1.5 text-white bg-[#000000] hover:!bg-[#ffffff] hover:!text-[#000000] hover:border-[#FB5934]/30 border border-gray-800/40 rounded-xl text-xs transition-all duration-200"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="footer-card bg-[#0a0a0a] rounded-[2rem] p-3 md:!p-6 border border-gray-800/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2.5 text-white text-xs">
              <img
                className="w-5 h-5 rounded-full"
                src="/assets/footer/ind.png"
                alt="India"
              />
              <span>India | English (UK) | &#8377; (INR)</span>
            </div>
            <div className="text-white text-[11px] md:text-xs text-center md:text-right">
              &copy; {new Date().getFullYear()} Artsays Pvt. Ltd. All rights reserved. | Designed for Global Artists &amp; Collectors |{" "}
              <Link to="/policy" className="text-white hover:text-[#FB5934] transition-colors">Terms</Link>
              {" \u2022 "}
              <Link to="/policy" className="text-white hover:text-[#FB5934] transition-colors">Privacy</Link>
              {" \u2022 "}
              <span className="text-white">Cookies</span>
              {" \u2022 "}
              <span className="text-white">Accessibility</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
