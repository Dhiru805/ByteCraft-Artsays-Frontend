import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <footer className="  w-full bg-[#111111] ">
      <div className="max-w-[1440px] mx-auto py-8">
        <section className="flex flex-row items-center justify-between px-4 py-4 bg-[#000000] rounded-xl">
          <div>
            <h1 className="text-5xl text-[#FB5934] font-windhavi pb-3"><a href="/">Artsays</a></h1>
            <p className="text-lg text-white">When Art Speaks, Value Grows</p>
          </div>
          <p className="w-[70%] text-md text-white text-end">
            Artsays is powered by 100% authenticity, transparency, and innovation,
            ensuring a secure marketplace for curated artworks, rare artifacts,
            and seamless transactions.
          </p>
        </section>

        <section className="py-4 ">
          <section className="flex flex-row   justify-between">
            <section>
              <h3 className="text-center text-lg text-black-400 mb-2 ">
                SHOP BY CATEGORY
              </h3>
              <ul className="gap-2 flex-col flex  text-sm text-base">
                <li>
                  <Link>Paintings</Link>
                </li>
                <li>
                  <Link>Sculptures</Link>
                </li>
                <li>
                  <Link>Artifacts</Link>
                </li>
                <li>
                  <Link>Handmade Crafts</Link>
                </li>

                <li>
                  <Link>Bidding Deals</Link>
                </li>
              </ul>
            </section>
            <section className="">
              <h3 className=" text-lg text-black-400 mb-2 ">EXPLORE</h3>
              <ul className="gap-2 flex-col flex  text-sm text-base">
                <li>
                  <Link>Filter</Link>
                </li>
                <li>
                  <Link>Featured Collections</Link>
                </li>
                <li>
                  <Link>Artist Profiles</Link>
                </li>
                <li>
                  <Link>Authentication Badge</Link>
                </li>

                <li>
                  <Link>Wishlist & Saved Items</Link>
                </li>
              </ul>
            </section>
            <section>
              <h3 className=" text-lg text-black-400 mb-2 ">HEPL CENTER</h3>
              <ul className="gap-2 flex-col flex  text-sm text-base">
                <li>
                  <Link>FAQs</Link>
                </li>
                <li>
                  <Link>Shipping & Returns</Link>
                </li>
                <li>
                  <Link>Order Tracking</Link>
                </li>
                <li>
                  <Link>Payment Methods</Link>
                </li>
              </ul>
            </section>
            <section>
              <h3 className=" text-lg text-black-400 mb-2 ">POLICIES & LEGAL</h3>
              <ul className="gap-2 flex-col flex  text-sm text-base">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                <a href="/terms-services" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>
                <li>
                  <Link>COpyright & Licensing</Link>
                </li>
              </ul>
            </section>
            <section className="flex-[0.5] ">
              <h3 className=" text-lg text-black-400 mb-2 ">CONTACT US</h3>
              <ul className="gap-4 flex-col flex  text-sm text-base">
                <li className="flex flex-row gap-2 items-center ">
                  <img src="/assets/footer/call.svg" alt="" />
                  <p>+91 8668367265</p>
                </li>
                <li className="flex flex-row gap-4 items-center ">
                  <img src="/assets/footer/mail.svg" alt="" />
                  <p>contact@bytecarftstudios.in</p>
                </li>
                <li className="flex flex-row gap-4 items-center ">
                  <img src="/assets/footer/location.svg" alt="" />
                  <p>
                    F Wing, Park Connect, Hinjawadi Phase 1, Pune,
                    Pimpri-Chinchwad, Maharashtra 411057
                  </p>
                </li>
                <li className="flex flex-row gap-6 items-center ml-1 ">
                  <Link>
                    <img src="/assets/footer/fb.svg" alt="facebook" />
                  </Link>
                  <Link>
                    <img src="/assets/footer/x.svg" alt="twitter" />
                  </Link>
                  <Link>
                    <img src="/assets/footer/ln.svg" alt="linkedin" />
                  </Link>
                  <Link>
                    <img src="/assets/footer/insta.svg" alt="instagram" />
                  </Link>
                </li>
              </ul>
            </section>
          </section>
          <section className="">
            <h3 className=" text-lg text-black-400 mb-2 ">
              Secure Payments & Trust Badges
            </h3>
            <ul className="list-disc flex gap-4 text-base flex-row  list-inside">
              <li>Fast performance</li>
              <li>Responsive design</li>
              <li>SEO-friendly</li>
            </ul>
          </section>
        </section>

        <section className="flex flex-row justify-between text-xs text-base py-4 ">
          <span className="flex-row flex  items-center gap-2">
            <img
              className="w-4 h-4 rounded-full "
              src="assets/footer/ind.png"
              alt=""
            />{" "}
            India | English(UK) |₹(INR)
          </span>
          <ul className="flex flex-row flex-0.7 gap-4 ">
            <li>
              <Link>© 2025 Artsays, Inc</Link>
            </li>
            <li>
              <Link>Terms of use</Link>
            </li>
            <li>
              <Link>Privacy</Link>
            </li>
            <li>
              <Link>Interst-based ads</Link>
            </li>
            <li>
              <Link>Local Shops</Link>
            </li>
            <li>
              <Link>Region</Link>
            </li>
          </ul>
        </section>
      </div>

    </footer>
  );
};

export default Footer;
