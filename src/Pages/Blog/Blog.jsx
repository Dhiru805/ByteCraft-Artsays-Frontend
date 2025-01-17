import React, { useState, useEffect } from 'react';
import BlogPost from './sub/BlogPost';
import Pagination from './sub/Pagination';
import SearchWidget from './sub/SearchWidget';
import RecentPostsWidget from './sub/RecentPostsWidget';
import RecentCommentsWidget from './sub/RecentCommentsWidget';
import ArchivesWidget from './sub/ArchivesWidget';
import CategoriesWidget from './sub/CategoriesWidget';
import MetaWidget from './sub/MetaWidget';
import './sub/Blog.css'
import Breadcrumb from '../../Component/Breadcrumb'
import Testimonial from '../../Component/Testinomial/Testimonial'
import StoreCarousl from "../Store/StoreCarousl"
const Blog = () => {

	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 5; // Example total pages, you can adjust as needed.

	// Simulated blog posts with dates (in ISO format) and times
	const blogPosts = [
		{
			imgSrc: 'images/img69.jpg',
			date: '2019-09-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane Doe',
			job: 'Artist',
			description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img70.jpg',
			date: '2019-09-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Buyer',
			description: 'It is a long  be distracted fact that a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img71.jpg',
			date: '2019-06-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Artist',
			description: 'It is a long jj reader will fact that a reader will be distracted be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img70.jpg',
			date: '2019-07-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Buyer',
			description: 'It is a long established fact that a fact that a reader will be distracted reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img69.jpg',
			date: '2019-09-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Artist',
			description: 'It is a long established fact that fact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img71.jpg',
			date: '2019-08-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Buyer',
			description: 'It is a long established fact that fact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img69.jpg',
			date: '2019-12-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Artist',
			description: 'It is a long established fact that fact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img70.jpg',
			date: '2019-11-20T09:48:00Z',
			title: 'Aptent taciti soci li cianpen',
			author: 'Jane doe',
			job: 'Buyer',
			description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img71.jpg',
			date: '2019-10-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Artist',
			description: 'It is a long established fact thatfact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img69.jpg',
			date: '2019-09-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Artist',
			description: 'It is a long established fact that fact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img71.jpg',
			date: '2019-08-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Buyer',
			description: 'It is a long established fact that fact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		{
			imgSrc: 'images/img69.jpg',
			date: '2019-12-20T09:48:00Z',
			title: 'Aptent taciti soci litora cianpen',
			author: 'Jane doe',
			job: 'Artist',
			description: 'It is a long established fact that fact that a reader will be distracted a reader will be distracted by the readable content of a page when looking at its layout...',
			link: 'blog-detail.html'
		},
		// ...other blog posts
	];

	const recentPosts = [
		"Blog image post",
		"Post with Gallery",
		"Post with Audio",
		"Post with Video",
		"Maecenas ultricies"
	];

	const recentComments = [
		"Admin on Vivamus blandit",
		"Admin on Vivamus blandit",
		"Admin on Vivamus blandit",
		"Admin on Vivamus blandit",
		"Admin on Vivamus blandit"
	];

	const archives = [
		"March 2018",
		"December 2018",
		"November 2018",
		"September 2018",
		"August 2018"
	];

	const categories = [
		"Creative",
		"Fashion",
		"Image",
		"Photography",
		"Travel",
		"Videos",
		"WordPress"
	];

	const metaItems = [
		"Log in",
		"Entries RSS",
		"Comments RSS",
		"WordPress.org"
	];


	const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 992);

	const toggleSidebar = () => {
		setIsSidebarVisible(!isSidebarVisible);
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 992) {
				setIsSidebarVisible(true);
			} else {
				setIsSidebarVisible(false);
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const [selectedSort, setSelectedSort] = useState('Default sorting');

  const handleSortChange = (event, sortOption) => {
    event.preventDefault(); // Prevent the default link behavior
    setSelectedSort(sortOption);
  };

	return (
		<>
			<div id="pageWrapper">
				{/* <Breadcrumb /> */}
				{/* twoColumns  */}
				<StoreCarousl/>
				<div className="twoColumns abtSecHolder blog-const  pb-lg-20  pb-md-4 pt-10">
					<div className="row">
						<div className="col-12 col-lg-9 order-lg-3 blog-col-12-p pr-0">
							<article id="content">
								<header className="show-head d-flex flex-wrap justify-content-between">
									<ul className="list-unstyled viewFilterLinks d-flex flex-nowrap align-items-center">
										<li className="mr-2 fas fa-filters">
											<a href="#" onClick={toggleSidebar}>
												<i className="fas fa-filter"></i>
											</a>
										</li>
									</ul>
									<div className="sortGroup ">
                    <div className="d-flex flex-nowrap align-items-center">
                      <strong className="groupTitle mr-2">Sort by:</strong>
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle buttonReset "
                          type="button"
                          id="sortGroup"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {selectedSort}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="sortGroup">
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'Relevance')}>
                              Relevance
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'Low to High')}>
                              Price-- Low to High
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'High to Low')}>
                              Price-- High to Low
                            </a>
                          </li>
                          <li>
                            <a href="#" onClick={(event) => handleSortChange(event, 'Newest First')}>
                              Newest First
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
									{/* Sort by dropdown */}
								</header>
								<div className="blogContainer">
									{blogPosts.map((post, index) => (
										<div className='blog-box' key={index}>
											<BlogPost
												imgSrc={post.imgSrc}
												date={post.date}
												title={post.title}
												author={post.author}
												description={post.description}
												job={post.job}
												link={post.link}
											/>
										</div>
									))}
								</div>
								<div className="col-12 mb-sm-0 mb-6">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={setCurrentPage}
									/>
								</div>
							</article>
						</div>
						<div className="col-12 col-lg-3 order-lg-1 pl-1">
							<aside id="sidebar" className={isSidebarVisible ? "visible" : "hidden"}>
								<button
									className={`sidebar-back-button ${isSidebarVisible ? 'hidden' : 'visible'}`}
									onClick={toggleSidebar}
								>
									<i className="fas fa-chevron-circle-left"></i>
								</button>
								<SearchWidget />
								<RecentPostsWidget posts={recentPosts} />
								<RecentCommentsWidget comments={recentComments} />
								<ArchivesWidget archives={archives} />
								<CategoriesWidget categories={categories} />
								<MetaWidget metaItems={metaItems} />
							</aside>
						</div>

					</div>
				</div>
				<Testimonial />
			</div>
		</>
	)
}

export default Blog