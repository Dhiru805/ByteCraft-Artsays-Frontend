import React, { Fragment } from "react";
import {
	Button,

	Col,
	
	ProgressBar,
	Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faStarHalfAlt,
	faThumbsDown,
	faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import classNames from "classnames";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

import './productreview.css';

const review = [
	{
		img: "https://cdn.easyfrontend.com/pictures/users/user18.jpg",
		name: "Freya Kemp",
		rating: 4.8,
		date: "Jan 24,2020",
		content:
			"Well received seems solid, serious seller and word, fast delivery, thank you and congratulations.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		like: "12",
		dislike: "3",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/users/user4.jpg",
		name: "Issy Won",
		rating: 4.5,
		date: "June 10,2020",
		content:
			"A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be.",
		like: "25",
		dislike: "7",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/users/user17.jpg",
		name: "Sophia Dunkley",
		rating: 3.9,
		date: "Sep 19,2020",
		content:
			"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
		like: "20",
		dislike: "6",
	},
];

const progress = [
	{
		star: "5",
		value: "70",
		width: "70%",
		count: "123",
	},
	{
		star: "4",
		value: "90",
		width: "90%",
		count: "55",
	},
	{
		star: "3",
		value: "80",
		width: "80%",
		count: "12",
	},
	{
		star: "2",
		value: "60",
		width: "60%",
		count: "4",
	},
	{
		star: "1",
		value: "30",
		width: "30%",
		count: "3",
	},
];

const Rating = ({ rating, showLabel, className, ...rest }) => (
	<p
		className={classNames("ezy__epreview4-content fw-light mb-0", className)}
		{...rest}
	>
		<span className="ezy__epreview4-rating">
			{[...Array(5)].map((_, i) => {
				const index = i + 1;
				let content = "";
				if (index <= Math.floor(rating))
					content = <FontAwesomeIcon icon={faStar} />;
				else if (rating > i && rating < index + 1)
					content = <FontAwesomeIcon icon={faStarHalfAlt} />;
				else if (index > rating) content = <FontAwesomeIcon icon={farStar} />;

				return <Fragment key={i}>{content}</Fragment>;
			})}
		</span>
		{showLabel && <span className="mx-1 font-size-medium">{rating.toFixed(1)}</span>}
	</p>
);

Rating.propTypes = {
	rating: PropTypes.number.isRequired,
	showLabel: PropTypes.bool,
	className: PropTypes.string,
};

const ReviewItem = ({ item }) => {
	return (
		<>
			<hr className="ezy__epreview4-hr my-3" />
			<div>
				<div className="d-flex align-items-center mb-4">
					<div className="ezy__epreview4-profile rounded-circle me-2 overflow-hidden">
						<img src={item.img} alt="" className="img-fluid" />
					</div>
					<div className="d-flex flex-grow-1 justify-content-between">
						<div>
							<h5 className="fs-6 mb-1">{item.name}</h5>
							<Rating rating={item.rating} showLabel={true} />
						</div>
						<p className="ezy__epreview4-content opacity-50 m-1 font-size-medium">
							{item.date}
						</p>
					</div>
				</div>
				<p className="ezy__epreview4-content opacity-75 mb-4">{item.content}</p>
				<div className="d-flex justify-content-end">
					<Button
						variant=""
						className="ezy__epreview4-btn-text py-0 d-inline-flex justify-content-center align-items-center text-decoration-none me-4"
					>
						<FontAwesomeIcon icon={faThumbsUp} className="fs-6 me-2 " />
						Like ({item.like})
					</Button>
					<Button
						variant=""
						className="ezy__epreview4-btn-text py-0 d-inline-flex justify-content-center align-items-center text-decoration-none"
					>
						<FontAwesomeIcon icon={faThumbsDown} className="fs-6 me-2 " />
						Dislike ({item.dislike})
					</Button>
				</div>
			</div>
		</>
	);
};

ReviewItem.propTypes = {
	item: PropTypes.object.isRequired,
};

const BarItem = ({ info }) => {
	return (
		<Row className="align-items-center mb-2">
			<Col xs={"auto"} className="ezy__epreview4-rating-range p-0">
				<p className="ezy__epreview4-content fw-bold mb-0">
					<span className="opacity-50 font-size-medium m-1">{info.star}</span>
					<span className="ezy__epreview4-rating ms-1 ">
						<FontAwesomeIcon icon={faStar} />
					</span>
				</p>
			</Col>
			<Col xs={6} className="m-1">
				<ProgressBar variant="" label="" now={info.value} />
			</Col>
			<Col>
				<p className="ezy__epreview4-content opacity-50 mb-0 font-size-medium">{info.count}</p>
			</Col>
		</Row>
	);
};

BarItem.propTypes = {
	info: PropTypes.object.isRequired,
};
const Productreview = () => {
	return (
		<section className="ezy__epreview4 light pt-0" id="ezy__epreview4">
			
				<Row className="justify-content-center">
					<Col xs={12} lg={10} xl={12} className="">
						<card className="ezy__epreview4-card mb-3">
							<card className="p-md-4 pt-0">
								<h2 className="fs-4">Reviewer Recommendetion</h2>
								<div className="d-flex flex-wrap align-items-center fs-1 fontsize-xxl-large">
									91%
								</div>
								<p className="ezy__epreview4-content opacity-75 mb-4 mb-md-5">
									Recomded by 6 reviewers who responded, 5 would recommend this
									product.
								</p>

								<div className="d-flex flex-wrap align-items-center">
									<span className="font-size-medium fs-1 me-2 fontsize-1.5rem">4.5</span>
									<Rating rating={4.5} showLabel={false} className="fs-5 font-size-medium" />
								</div>
								<p className="ezy__epreview4-content opacity-75 mb-4">
									Average rating based on 2345 reviews
								</p>
								<div className="p-5">
									{progress.map((info, j) => (
										<BarItem info={info} key={j} />
									))}
								</div>
							</card>
							<hr className="ezy__epreview4-hr my-0" />
							<card className="p-md-4 pt-0">
								<div className="d-flex justify-content-between  align-items-center">
									<h2 className="fs-4">Customer Review</h2>
									
								</div>
								{review.map((item, i) => (
									<ReviewItem item={item} key={i} />
								))}
							</card>
							<card className="py-4 py-lg-5 text-center">
								<Button variant="" className="ezy__epreview4-btn px-4 px-md-5">
									Load More
								</Button>
							</card>
						</card>
					</Col>
				</Row>
		
		</section>
	);
};

export default Productreview;

