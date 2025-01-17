import React from "react";
import {Link} from 'react-router-dom';

function Footer() {
  return (
    <>
      {/* footerHolder */}
      <aside className="footerHolder container-fluid overflow-hidden px-xl-20 px-lg-14 pt-xl-12 pb-xl-8 pt-lg-12 pt-md-8 pt-7  pb-lg-8">
        <div className="d-flex flex-wrap flex-lg-nowrap">
          <div className="coll-1 mb-sm-4 mb- mb-lg-0">
            <h3 className="headingVI fwEbold text-uppercase mb-5">
            <Link to={'/'}><img className="footer-logo" src="images/Artsays-logo.png" alt="Botanical" /></Link>
            </h3>
            <ul className="list-unstyled footerContactList mb-3">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam
              placeat consequatur ea sed voluptatum nemo praesentium voluptatem
              quis optio autem obcaecati rem sit cum inventore earum numquam
              temporibus expedita molestiae eligendi.
            </ul>
          </div>
          <div className="coll-2 mb-sm-4 mb-3 mb-lg-0">
            <h3 className="headingVI fwEbold text-uppercase mb-6">
              Quick Links
            </h3>
            <ul className="list-unstyled footerNavList">
              <li className="mb-1">
                <Link to={'/store'}>Store</Link>
              </li>
              <li className="mb-2">
                <Link to={'/about'}>About Us</Link>
              </li>
              <li className="mb-2">
                <Link to={'/blog'}>Blog</Link>
              </li>
              <li className="mb-2">
                <Link to={'/contact'}>Contact Us</Link>
              </li>
              <li>
                <Link to={'/privacy-policy'}>Privacy policy</Link>
              </li>
              <li>
                <Link to={'/terms'}>Terms And Services</Link>
              </li>
              <li>
                <Link to={'/partner'}>Partner</Link>
              </li>
              <li>
                <Link to={'/help'}>Help</Link>
              </li>
              <li>
                <Link to={'/career'}>Career</Link>
              </li>
              <li>
                <Link to={'/faq'}>FAQ</Link>
              </li>
            </ul>
          </div>
          <div className="coll-3 mb-sm-4 mb-3 mb-lg-0">
            <h3 className="headingVI fwEbold text-uppercase mb-6">
              My Account
            </h3>
            <ul className="list-unstyled footerNavList">
              <li className="mb-1">
                <a href="#">My account</a>
              </li>
              <li className="mb-2">
                <a href="#">Discount</a>
              </li>
              <li className="mb-2">
                <a href="#">Orders history</a>
              </li>
              <li>
                <a href="#">Personal information</a>
              </li>
            </ul>
          </div>
          <div className="coll-4 pr-3 mb-sm-4 mb-3 mb-lg-0">
            <h3 className="headingVI fwEbold text-uppercase mb-5">
              Contact Us
            </h3>
            <ul className="list-unstyled footerContactList mb-3">
              <li className="mb-3 d-flex flex-nowrap">
                <span className="icon icon-place mr-3"></span>{" "}
                <address className=" m-0">
                  Address: F Wing, Park Connect, Hinjawadi Phase 1, Pune,
                  Pimpri-Chinchwad, Maharashtra 411057
                </address>
              </li>
              <li className="mb-3 d-flex flex-nowrap">
                <span className="icon icon-phone mr-3"></span>{" "}
                <span className="leftAlign">
                  Phone : <a href="#">+91 8668 36 7265</a>
                </span>
              </li>
              <li className="email d-flex flex-nowrap">
                <span className="icon icon-email mr-3"></span>{" "}
                <span className="leftAlign">
                  Email:{" "}
                  <a href="#">contact@bytecraftstudios.in</a>
                </span>
              </li>
            </ul>
            <ul className="list-unstyled followSocailNetwork d-flex flex-nowrap">
              <li className="fw-normal mr-xl-3 mr-sm-6 mr-4">Follow us:</li>
              <li className="mr-xl-2 mr-sm-4 mr-2">
                <a href="#" className="fab fa-facebook-f"></a>
              </li>
              <li className="mr-xl-2 mr-sm-4 mr-2">
                <a href="#" className="fab fa-twitter"></a>
              </li>
              <li className="mr-xl-2 mr-sm-4 mr-2">
                <a href="#" className="fab fa-linkedin"></a>
              </li>
              <li className="mr-2">
                <a
                  href="#"
                  className="fab fa-google-plus-g"
                ></a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      <footer id="footer" className="container-fluid overflow-hidden px-lg-20">
        <div className="copyRightHolder text-center pt-lg-5 pb-lg-4 py-3">
          <p className="mb-0">
            Coppyright 2024 by <a href="index.html">Artsays</a> - All right
            reserved by ByteCraft Studios
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
