import React from "react";
import './AdditionalproductInfo.css';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating ml-1">
      {[...Array(fullStars)].map((_, index) => (
        <span key={`full-${index}`} className="fa fa-star checked"></span>
      ))}
      {halfStar && <span className="fa fa-star-half-alt checked"></span>}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={`empty-${index}`} className="fa fa-star"></span>
      ))}
    </div>
  );
};

const AdditionalproductInfo = () => {
  const artistRating = 4.5; // You can change this value to test different ratings

  return (
    <section className="ezy__epreview4 light p-1 pl-5 pr-5" id="ezy__epreview4">
      <div className="col-12 p-1">
        <h2 id="#desc" className="mt-1 mb-0 fs-4 fw-bold opacity-100">Painted by</h2>
        <hr className='ezy__epreview2-hr' />
        <div className="d-flex ezy__epreview11-commen p-4 pl-1">
          <div className="arttist-pofile-pic-container">
            <img
              src="https://cdn.easyfrontend.com/pictures/testimonial/testimonial_square_2.jpeg"
              alt="Artist"
              className="img-fluid rounded-circle width-8pc border m-1 artist-profile-pic"
              width="70"
            />
          </div>
          <div className="row flex-grow-1 pr-5 pt-1 pb-2 ml-1 artist-info-artistdiscription">
            <div className="col pl-0">
              <h6 className="mb-0 ml-1">Tahlia McGrath</h6>
              <StarRating rating={artistRating} />
              <p className='ml-1'>
                Third fruitful dry morning isn't doesn't seasons sixth yielding can't unto likeness saying they're
                first. All unto void wherein, second Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
                odio eos facere quidem! Reiciendis veniam id laboriosam repellendus quisquam distinctio accusamus in
                eum rerum dignissimos!
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 mt-5 pl-0">
          <h2 id="#desc" className="mt-1 mb-0 fs-4 fw-bold opacity-100">About</h2>
          <hr className='ezy__epreview2-hr' />
          <p className="mt-4 mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdditionalproductInfo;
