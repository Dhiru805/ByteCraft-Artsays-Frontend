import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import Categorytable from "./Categotytable";
import CreateCategoryModal from "./Createcategory";

const BlogCategory = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await getAPI("/api/getblogcategory");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Blog Category</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">Blog Category</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Categorytable
                setCategories={setCategories}
                categories={categories}
                refreshCategories={fetchCategories}
            />
            {showModal && <CreateCategoryModal onClose={() => setShowModal(false)} refreshCategories={fetchCategories} />}
        </div>
    );
};

export default BlogCategory;