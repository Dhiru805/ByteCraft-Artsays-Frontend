import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] text-gray-300">
      {/* Top Section */}
      <div className="max-w-[1440px] mx-auto py-10 space-y-4">
        {/* Header */}
        <section className="flex flex-col md:flex-row items-center justify-between px-4 md:px-4 py-4 bg-[#000000] rounded-xl gap-4">
          <div className="text-left w-full md:w-1/3">
            <h1 className="text-4xl sm:text-5xl text-[#FB5934] font-windhavi pb-2 sm:pb-3">
              <Link to="/">Artsays</Link>
            </h1>
            <p className="text-base sm:text-lg text-white">
              When Art Speaks, Value Grows
            </p>
          </div>

          <p className="md:w-2/3 text-sm sm:text-md text-white text-start md:text-end leading-relaxed">
            Artsays is a global art marketplace connecting artists, collectors,
            and galleries. Discover original paintings, sculptures, and digital
            art — authenticated, insured, and delivered with care.
          </p>
        </section>


        {/* Middle Content */}
        <section className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <div className="bg-[#000000] text-start rounded-2xl p-6">
              <div className="flex flex-col md:flex-col lg:flex-row items-center bg-transparent border border-gray-500 rounded-xl lg:!rounded-full px-2 py-2 w-full mx-auto">
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-400 text-lg px-3"
                />
                <button className="w-full lg:w-auto bg-[#FB5934] hover:bg-[#ffffff] !text-[#000000] font-semibold text-lg px-6 py-2 rounded-xl lg:rounded-full shadow-md transition-all duration-300 !mt-3 md:!mt-3 lg:!mt-0">
                  Subscribe
                </button>
              </div>
              <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold mt-8 pb-2 mb-3">
                CONTACT US
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <table>
                    <tbody>
                      <tr className="align-top">
                        <td className="pr-3">
                          <img src="/assets/footer/call.svg" alt="call" className="w-5 h-5" />
                        </td>
                        <td className="text-white">+91 8668 36 7265</td>
                      </tr>
                    </tbody>
                  </table>
                </li>

                <li>
                  <table>
                    <tbody>
                      <tr className="align-top">
                        <td className="pr-3">
                          <img src="/assets/footer/mail.svg" alt="mail" className="w-5 h-5" />
                        </td>
                        <td className="text-white">contact@artsays.in</td>
                      </tr>
                    </tbody>
                  </table>
                </li>

                <li>
                  <table>
                    <tbody>
                      <tr className="align-top">
                        <td className="pr-3">
                          <img
                            src="/assets/footer/location.svg"
                            alt="location"
                            className="w-5 h-5"
                          />
                        </td>
                        <td className="text-white leading-snug">
                          Pune, Pimpri Chinchwad, Maharashtra, India
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>

              <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold mt-8 pb-2 mb-3">
                FOLLOW US
              </h3>
              <ul className="flex gap-10 text-xl">
                <li className="flex items-center gap-2">
                  <FaFacebookF />
                </li>
                <li className="flex items-center gap-2">
                  <FaInstagram />
                </li>
                <li className="flex items-start gap-2">
                  <FaLinkedinIn />
                </li>
                <li className="flex items-start gap-2">
                  <FaXTwitter />
                </li>
                <li className="flex items-start gap-2">
                  <FaYoutube />
                </li>
              </ul>

            </div>
            <div className="bg-[#000000] rounded-2xl p-6 text-start">
              <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
                PARTNER WITH US
              </h3>

              <ul className="custom-bullet list-none text-sm flex flex-col md:flex-row gap-3">
                <li>Become a Gallery Partner</li>
                <li>Corporate Art Solutions</li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-3/5 bg-[#000000] rounded-2xl text-start p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* ABOUT */}
              <div>
                <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
                  ABOUT ARTSAYS
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/why-artsays">Why Artsays Different</Link></li>
                  <li><Link to="/benefits">Benefits of Choosing Artsays</Link></li>
                  <li><Link to="/blog">Blog / Art Journal</Link></li>
                </ul>
              </div>

              {/* FOR BUYERS */}
              <div>
                <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
                  FOR BUYERS
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/store">Store</Link></li>
                  <li><Link to="/gallery">Art Gallery</Link></li>
                  <li><Link to="/bidding">Bidding</Link></li>
                  <li><Link to="/artists">Discover Artists</Link></li>
                  <li><Link to="/challenges">Challenges</Link></li>
                  <li><Link to="/how-to-buy">How to Buy</Link></li>
                  <li><Link to="/icons">Art Icons</Link></li>
                  <li><Link to="/certificates">Certificates</Link></li>
                  <li><Link to="/insurance">Insurance</Link></li>
                </ul>
              </div>

              {/* FOR ARTISTS */}
              <div>
                <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
                  FOR ARTISTS
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/why-artsays">Why Artsays</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/how-to-sell">How to Sell</Link></li>
                  <li><Link to="/blog">Blog / Art Journal</Link></li>
                  <li><Link to="/affiliate">Affiliate Program</Link></li>
                  <li><Link to="/partnerships">Partnerships</Link></li>
                  <li><Link to="/commission">Commission</Link></li>
                </ul>
              </div>

              {/* HELP CENTER */}
              <div>
                <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
                  HELP CENTER
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/faqs">FAQs</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/terms">Terms of Use</Link></li>
                  <li><Link to="/shipping">Shipping & Returns</Link></li>
                  <li><Link to="/copyright">Copyright & Licensing</Link></li>
                  <li><Link to="/order-tracking">Order Tracking</Link></li>
                  <li><Link to="/payment-methods">Payment Methods</Link></li>
                  <li><Link to="/refund-policy">Refund Policy</Link></li>
                </ul>
              </div>
            </div>

            <div>
              {/* TRUST & PROMISE */}
              <div className="pt-3">
                <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
                  SECURE PAYMENTS & TRUST BADGES
                </h3>
                <ul className="custom-bullet list-none text-sm flex flex-col sm:flex-row gap-3">
                  <li>100% Safe Transactions</li>
                  <li>Verified Artworks & Sellers</li>
                  <li>Visa, MasterCard, PayPal, UPI, Net Banking</li>
                </ul>

                <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold mt-3 pb-2 mb-3">
                  ARTSAYS PROMISE
                </h3>
                <ul className="custom-bullet list-none text-sm flex flex-col sm:flex-row gap-3">
                  <li>Authenticity verified for every artwork</li>
                  <li>24/7 artist & buyer support</li>
                  <li>Transparent pricing & zero hidden charges</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bg-[#000000] rounded-2xl p-6 text-start">
          <h3 className="inline-block border-b-2 border-white text-[#FB5934] text-lg font-semibold pb-2 mb-3">
            CATEGORIES
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-y-2 text-sm">
            {[
              "Painting",
              "Sculpture",
              "Digital Art",
              "Artifact",
              "Handmade Crafts",
              "Photography",
            ].map((category, i) =>
              Array(8)
                .fill(null)
                .map((_, idx) => (
                  <p key={`${category}-${idx}`} className="text-white">
                    {category}
                  </p>
                ))
            )}
          </div>
        </section>

        {/* Bottom Bar */}
        <section className="flex flex-col md:flex-row justify-between items-center text-xs text-white gap-3 bg-[#000000] rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <img
              className="w-5 h-5 rounded-full"
              src="/assets/footer/ind.png"
              alt="India"
            />
            India | English (UK) | ₹ (INR)
          </div>
          <div className="text-center md:text-right">
            © 2025 Artsays Pvt. Ltd. All rights reserved. | Designed for Global
            Artists & Collectors |{" "}
            <Link to="/terms" className="hover:text-[#FB5934]">
              Terms
            </Link>{" "}
            •{" "}
            <Link to="/privacy" className="hover:text-[#FB5934]">
              Privacy
            </Link>{" "}
            • Cookies • Accessibility
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;