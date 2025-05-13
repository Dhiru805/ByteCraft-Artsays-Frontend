import React from "react";
import ImageEditor from "./ImageCropping";
import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import { useNavigate } from "react-router-dom";
import useUserType from "../../../../urlconfig";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

function ProductUpload() {
    const [description, setDescription] = React.useState('');
    // const navigate = useNavigate();
    const userType = useUserType();
    const { productId } = useParams();
    const { userId } = useParams();

    // const handleNavigation = () => {
    // navigate(`/${userType}/Dashboard/allartistproduct`);

    // };


    // React.useEffect(() => {
    //     document.getElementById('description').value = description;
    // }, [description]);

    // const modules = {
    //     toolbar: [
    //         [{ 'font': ['sans-serif', 'serif', 'monospace'] }, { 'size': ['small', 'large', 'huge'] }],
    //         [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline'],
    //         [{ 'align': [] }],
    //         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    //         ['link'],
    //         [{ 'color': [] }, { 'background': [] }],
    //         ['code-block'],
    //         ['blockquote'],
    //         ['fullscreen'],
    //         ['help'],
    //     ],
    // };

    // const editorStyle = {
    //     fontFamily: 'Nunito, Ubuntu, Raleway, IBM Plex Sans, sans-serif',
    //     fontSize: '12px',
    // };

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Artist Edit Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to={`/${userType}/Dashboard/artistmanagetable`}>Artist Management</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to={`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}`}>Artist Profile</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to={`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}/artistproductdetails/${productId}`}>
                                    Artist Product Details
                                </Link>
                            </li>
                            <li className="breadcrumb-item">Artist Edit Product</li>
                        </ul>
                    </div>

                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">
                            <form>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="productName"
                                        className="form-control"
                                        placeholder="Enter Product Name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    {/* <input
                    type="text"
                    name="artistName"
                    className="form-control"
                    placeholder="Name"
                    required
                  /> */}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="newPrice"
                                        className="form-control"
                                        placeholder="Product Price"
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <select
                                        name="productCategory"
                                        className="form-control show-tick"
                                        required
                                    >
                                        <option value="">Select Product Category</option>
                                        <option value="Web Design">Web Design</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Sports">Sports</option>
                                    </select>
                                </div>
                            </form>
                            <label className="btn btn-sm btn-secondary btn-upload" htmlFor="inputImage" title="Upload image file">
                                Choose file
                            </label>
                            <input
                                type="file"
                                className="sr-only"
                                id="inputImage"
                                name="file"
                                accept="image/*"
                                multiple
                            />
                            <div className="input-image-preview-container">
                                <h5>Selected Image Preview:</h5>
                                <div id="imagePreviewList"></div>
                            </div>
                            <div className="form-group mt-3 main-image">
                                <ImageEditor />
                            </div>
                            {/* <div className="form-group mt-3">
                  <ReactQuill
                    placeholder="Enter Product Details"
                    modules={modules}
                    theme="snow"
                    style={editorStyle}
                    value={description}
                    onChange={setDescription}
                  />
                  <input type="hidden" id="description" />
                </div> */}
                            <div className="form-group mt-3">
                                <textarea
                                    id="description"
                                    className="form-control"
                                    placeholder="Enter Product Details"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ height: "150px" }}
                                ></textarea>
                            </div>
                            <button
                                className="btn btn-block btn-primary mt-3"
                                id="uploadBtn"
                            // onClick={handleNavigation}
                            >
                                Upload product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductUpload;