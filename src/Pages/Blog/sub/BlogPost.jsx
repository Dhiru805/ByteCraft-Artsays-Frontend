import React, { useState, useRef, useEffect } from 'react';

const BlogPost = ({ imgSrc, title, author, job, description, link, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef(null);

  // Parse the date string into a Date object
  const postDate = new Date(date);

  // Format the date as 'Month Day, Year'
  const formattedDate = postDate.toLocaleString('default', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  // Format the time as 'HH:MM AM/PM'
  const formattedTime = postDate.toLocaleTimeString('default', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Handle "Read More" button click
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if the description is longer than 4 fully visible lines
  useEffect(() => {
    const checkHeight = () => {
      const element = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
      const maxHeight = lineHeight * 4; // Height for 4 lines

      // Compare the scroll height to the max height of 4 lines
      if (element.scrollHeight > maxHeight) {
        setShowReadMore(true);
      } else {
        setShowReadMore(false);
      }
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);

    return () => window.removeEventListener('resize', checkHeight);
  }, [description]);

  return (
    <div className="newsBlogColumn">
      <div className="imgHolder position-relative mb-1">
        <a href={link}>
          <img src={imgSrc} alt="image description" className="img-fluid" />
        </a>
      </div>
      <div className=" d-flex align-items-start blog-bg">
        <div className="alignLeft">
          <div className="headingV fwEbold p-1 ">
            {title}
          </div>
          <div className="postBy d-flex justify-content-between align-items-center p-1 flex-wrap">
            <div className='mt-1 mb-1 mr-1'>Post by: {author} <span>({job})</span></div>
            <div className="blog-date">
              {formattedDate} at {formattedTime}
            </div>
          </div>
          <p
            className={`mb-0 p-1 ${!isExpanded ? 'line-clamp' : ''}`}
            ref={descriptionRef}
          >
            {description}
          </p>
          {showReadMore && (
            <button className="btn btn-link p-1 ml-2" onClick={toggleReadMore}>
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
