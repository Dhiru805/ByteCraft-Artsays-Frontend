import React, { useState } from 'react';
import Breadcrumb from '../../Component/Breadcrumb';

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.tel) newErrors.tel = 'Telephone number is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Handle form submission (e.g., send data to server)
      console.log('Form submitted:', formData);
      setErrors({});
      // Reset form
      setFormData({
        name: '',
        email: '',
        tel: '',
        message: ''
      });
    }
  };

  return (
    <>
      <div id="pageWrapper">
    
        <main>
          {/*  introBannerHolder */}
          <Breadcrumb />
          <div className="contactSec container pt-xl-24 pb-xl-23 py-lg-20 pt-md-16 pb-md-10 pt-lg-10 pt-5 pb-0">
            <div className="row">
              <div className="col-12">
                <ul className="list-unstyled contactListHolder mb-0 d-flex flex-wrap text-center justify-content-around ">
                  <li className="mb-lg-0 mb-6">
                    <span className="icon d-block mx-auto bg-lightGray py-4 mb-4"><i className="fas fa-map-marker-alt"></i></span>
                    <strong className="title text-uppercase playfair mb-3 d-block">address</strong>
                    <address className="mb-0">Hinjewadi Phase 1 - PCMC <span className="d-block"> Pune - India</span></address>
                  </li>
                  <li className="mb-lg-0 mb-6">
                    <span className="icon d-block mx-auto bg-lightGray py-4 mb-3"><i className="fas fa-headphones"></i></span>
                    <strong className="title text-uppercase playfair mb-3 d-block">Phone</strong>
                    <a href="tel:84123456789" className="d-block">(+91) - 123 - 456 - 789</a>
                    <a href="tel:84321654987" className="d-block">(+91) - 321 - 654 - 987</a>
                  </li>
                  <li className="mb-lg-0 mb-6">
                    <span className="icon d-block mx-auto bg-lightGray py-5 mb-3"><i className="fas fa-envelope"></i></span>
                    <strong className="title text-uppercase playfair mb-3 d-block">email</strong>
                    <a href="mailto:Two-support@Two.lnk" className="d-block">contact@artsays.in</a>
                    <a href="mailto:info@Two.lnk" className="d-block">contact@artsays.in</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/*  mapHolder */}
          <div className="mapHolder">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.91477127143!2d-74.11976341808828!3d40.697403441901386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1573223498837!5m2!1sen!2s" style={{border:'0'}} allowFullScreen=""></iframe>
          </div>
          <section className="contactSecBlock container pt-xl-23 pb-xl-24 pt-lg-20 pb-lg-10 pt-md-16 pb-md-8 py-10">
            <div className="row">
              <header className="col-12 mainHeader mb-lg-10 mb-sm-5 text-center">
                <h1 className="headingIV playfair mt-5 fwEblod mb-lg-7">Get In Touch</h1>
                <p>Lorem ipsum dolor consectetuer adipiscing elit sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna<br className="d-block" /> aliquam erat volutpatcommodo consequat.</p>
              </header>
            </div>
            <div className="row">
              <div className="col-12">
                <form className="contactForm" onSubmit={handleSubmit}>
                  <div className="d-flex flex-wrap row1 mb-md-1">
                    <div className="form-group coll mb-5">
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        name="name"
                        placeholder="Your name  *"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div className="form-group coll mb-5">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Your email  *"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="form-group coll mb-5">
                      <input
                        type="tel"
                        className="form-control"
                        id="tel"
                        name="tel"
                        placeholder="Telephone number  *"
                        value={formData.tel}
                        onChange={handleChange}
                      />
                      {errors.tel && <span className="text-danger">{errors.tel}</span>}
                    </div>
                  </div>
                  <div className="form-group w-100 mb-6">
                    <textarea
                      className="form-control"
                      name="message"
                      placeholder="Message  *"
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && <span className="text-danger">{errors.message}</span>}
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btnTheme btnShop md-round fwEbold text-white py-3 px-4 py-md-3 px-md-4">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
          {/*  footerHolder */}
        </main>
      </div>
    </>
  );
};

export default Contactus;
