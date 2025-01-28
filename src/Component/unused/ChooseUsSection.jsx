import React from 'react';

const ChooseUsSection = () => {

  return (
    <div id="pageWrapper">
      <main>
        <section className="chooseUs-sec container pt-xl-22 pt-lg-20 pt-md-16 pt-10 pb-xl-12 pb-md-7 pb-2">
          <div className="row">
            <div className="col-12 col-lg-6 mb-lg-0 mb-4">
              <img src="artimages/Whychoseusimg.webp" alt="image description" className="img-fluid" />
            </div>
            <div className="col-12 col-lg-6">
              <h2 className="headingII fwEbold playfair position-relative mb-6 pb-5">Why choose us ?</h2>
              <p className="mb-xl-14 mb-lg-10">
                Lorem ipsum is simply dummy text of the printing and typesetting industry, lorem ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley ...
                <a href="#" className="btnMore"><i>Learn More</i></a>
              </p>
              <ul className="list-unstyled chooseList">
                <li className="d-flex justify-content-start mb-xl-7 mb-lg-5 mb-3">
                  <span className="icon icon-plant"></span>
                  <div className="alignLeft d-flex justify-content-start flex-wrap">
                    <h3 className="headingIII fwEbold mb-2">Hand Planted</h3>
                    <p>There are many variations of passages of lorem ipsum available, but the majority have suffered alteration in some form.</p>
                  </div>
                </li>
                <li className="d-flex justify-content-start mb-xl-6 mb-lg-5 mb-4">
                  <span className="icon icon-ic-plant"></span>
                  <div className="alignLeft d-flex justify-content-start flex-wrap">
                    <h3 className="headingIII fwEbold mb-2">Natural Sunlight</h3>
                    <p>It is a long established fact that a reader will be distracted by the reable content of a page.</p>
                  </div>
                </li>
                <li className="d-flex justify-content-start">
                  <span className="icon icon-desert"></span>
                  <div className="alignLeft d-flex justify-content-start flex-wrap">
                    <h3 className="headingIII fwEbold mb-2">Clean Air</h3>
                    <p>There are many variations of passages of lorem ipsum available, but the majority have suffered.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChooseUsSection;
