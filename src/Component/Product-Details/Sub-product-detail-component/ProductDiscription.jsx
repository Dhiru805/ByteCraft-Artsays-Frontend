import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const specifications = [
	{
		level: "BrandName",
		value: "T-WINNERWater",
	},
	{
		level: "Resistance Depth",
		value: "No waterproof",
	},
	{
		level: " Origin",
		value: "CN(Origin)",
	},
	{
		level: "Clasp Type",
		value: "Bracelet Clasp",
	},
	{
		level: "Style",
		value: " Fashion & Casual",
	},

	{
		level: "Movement",
		value: "Mechanical Hand Wind",
	},
	{
		level: "Band Length",
		value: "21cm",
	},
	{
		level: "Case Material",
		value: "Mechanical Hand Wind",
	},
	{
		level: "Feature",
		value: "luminous hands",
	},
	{
		level: "Model Number",
		value: " S1089-8",
	},
	{
		level: "Case Shape",
		value: "Round",
	},
	{
		level: "Dial Window Material Type",
		value: "Glass",
	},
	{
		level: "Item Type",
		value: "Mechanical Wristwatches",
	},
	{
		level: "Band Material Type",
		value: "Stainless steel",
	},
];

const Specifications = () => {
	return (
		<table className="table-container">
			<tbody>
				{specifications.map((specification, i) => {
					return (
						<tr key={i}>
							<td className=" py-3 align-middle w-25 opacity-75">
								{specification.level}
							</td>
							<td className="py-3 align-middle">:</td>
							<th className="py-3 align-middle">{specification.value}</th>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const ProductDiscription = () => {
	return (
		<section className="ezy__epspecification2 light p-1" id="ezy__epspecification2">
		
				<Row className=" m-1 main-dicription-container-tab1">
					<Col lg={13} className="p-1 ml-2 product-discription-content">
						<h2 className="fs-4 fw-bold mb-4 mt-0">Product Specification</h2>

						<Specifications />
					</Col>
				</Row>
	
		</section>
	);
};

export default ProductDiscription;

