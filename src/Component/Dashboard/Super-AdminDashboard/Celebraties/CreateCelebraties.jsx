import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import Select from "react-select";

function CreateCelebrities() {

    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        artistId: "",
        artistName: "",
        profession: "",
        highlightsOfJourney: "",
        artWorkCollected: "",
        yearsInArt: "",
        exhibitionFeatured: ""
    })
    const [artistsData, setArtistsData] = useState([])
    const [profilePicture, setProfilePicture] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    // Handle user data input
    const handleUserData = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const handleQuillChange = (value) => {
        setUserData((prev) => ({
            ...prev,
            highlightsOfJourney: value
        }))
    };

    const handleProfilePicture = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfilePicture(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    };

    const handleSubmitCelebraties = async (e) => {
        e.preventDefault()

        try {

            const formData = new FormData()
            Object.entries(userData).forEach(([key, value]) => {
                formData.append(key, value)
            });
            if (profilePicture) {
                formData.append("profilePicture", profilePicture)
            }

            const response = await postAPI("/api/create-celebrities", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            if (response?.hasError === false) {
                toast.success(response?.message)

                setUserData({
                    artistName: "",
                    profession: "",
                    highlightsOfJourney: "",
                    artWorkCollected: "",
                    yearsInArt: "",
                    exhibitionFeatured: ""
                })
                setProfilePicture(null)
                setPreviewImage(null)
                navigate("/super-admin/celebrities")
            }
            else {
                console.log(response)
            }
        }
        catch (error) {
            console.log(error)
            if (error?.status == 400) {
                toast.error(error?.response?.data?.message)
            }
        }
    };

    const fetchArtistsData = async () => {
        try {
            const response = await getAPI("/api/users-by-type?userType=Artist");

            if (response?.hasError === false) {
                setArtistsData(response?.data?.data)
            }
            else {
                console.log(response)
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchArtistsData()
    }, []);

    const options = artistsData.map((artist) => ({
        value: artist._id,
        label: artist.name + " " + artist.lastName,
        name: artist.name + " " + artist.lastName
    }));

    const handleArtistSelection = (selectedOption) => {
        setUserData({
            ...userData,
            artistId: selectedOption ? selectedOption.value : "",
            artistName: selectedOption ? selectedOption.name : ""
        })
    };

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Create Celebrities</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to="/super-admin/celebraties" className="text-decoration-none">Celebrities</Link>
                            </li>
                            <li className="breadcrumb-item">Create Celebrities</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">
                            <form onSubmit={handleSubmitCelebraties}>

                                {/* Artist name & Profession */}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Artist Name</label>
                                        <Select
                                            options={options}
                                            value={options.find((opt) => opt.value === userData.artistId) || null}
                                            onChange={handleArtistSelection}
                                            placeholder="Choose Artist"
                                            isClearable
                                            isSearchable
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Profession</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your profession"
                                            name="profession"
                                            value={userData.profession}
                                            onChange={handleUserData}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Highlights of journey */}
                                <div className="form-group">
                                    <label>Highlights of Journey</label>
                                    <ReactQuill
                                        theme="snow"
                                        placeholder="Enter highlights of journey"
                                        name="highlightsOfJourney"
                                        value={userData.highlightsOfJourney}
                                        onChange={handleQuillChange}
                                    />
                                </div>

                                {/* Art work collected, Years active in art & Exhibition featured */}
                                <div className="row">
                                    <div className="col-md-4">
                                        <label>Art Work Collected</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="artWorkCollected"
                                            value={userData.artWorkCollected}
                                            onChange={handleUserData}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Years Active in Art</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="yearsInArt"
                                            value={userData.yearsInArt}
                                            onChange={handleUserData}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Exhibition Featured</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="exhibitionFeatured"
                                            value={userData.exhibitionFeatured}
                                            onChange={handleUserData}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Profile picture */}
                                <div className="row mt-4">
                                    <div className="col-md-6 form-group">
                                        <label>Profile Picture</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleProfilePicture}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        {previewImage && (
                                            <div className="">
                                                <img
                                                    src={previewImage}
                                                    alt="Profile Preview"
                                                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >Create Celebrity</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCelebrities;