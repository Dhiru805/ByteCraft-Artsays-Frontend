import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import getAPI from "../../../../api/getAPI";
import Select from "react-select";
import putAPI from "../../../../api/putAPI";
import { toast } from "react-toastify";

function UpdateCelebrity() {

    const location = useLocation()
    const celebrity = location?.state?.celebrity;
    console.log(celebrity)
    const navigate = useNavigate()

    const [celebrityData, setCelebrityData] = useState({
        celebrityId: celebrity?.artistId || "",
        celebrityName: celebrity?.artistName || "",
        profession: celebrity?.profession || "",
        journey: celebrity?.highlightsOfJourney || "",
        artWorksCollected: celebrity?.artWorkCollected || "",
        yearsActiveInArt: celebrity?.yearsActiveInArt || "",
        exhibitionFeatured: celebrity?.exhibitionFeatured || ""
    });
    const [artistsData, setArtistsData] = useState([])
    const [profilePicture, setProfilePicture] = useState(null)
    const [profilePreview, setProfilePreview] = useState(null)

    // Handle celebrity data
    const handleCelebrityData = (e) => {
        const { name, value } = e.target;
        setCelebrityData(prev => ({
            ...prev,
            [name]: value
        }))
    };

    // Handle celebrity journey
    const handleCelebrityJourney = (value) => {
        setCelebrityData(prev => ({
            ...prev,
            journey: value
        }))
    };

    // Handle profile picture
    const handleProfilePicture = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfilePicture(file)
            setProfilePreview(URL.createObjectURL(file))
        }
    };

    // Fetching artists data
    const fetchArtists = async () => {
        try {
            const response = await getAPI("/api/users-by-type?userType=Artist")

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
        fetchArtists()
    }, []);

    const artistNames = artistsData.map(artist => ({
        label: `${artist.name} ${artist.lastName}`,
        value: artist._id,
        name: `${artist.name} ${artist.lastName}`
    }));

    const handleCelebritySelection = (selectedOption) => {
        setCelebrityData(prev => ({
            ...prev,
            celebrityId: selectedOption ? selectedOption.value : "",
            celebrityName: selectedOption ? selectedOption.label : ""
        }))
    };

    const handleUpdateCelebrityData = async (e) => {
        e.preventDefault()

        try {

            const formData = new FormData()
            Object.entries(celebrityData).forEach(([key, value]) => {
                formData.append(key, value)
            })
            if (profilePicture) {
                formData.append("profilePicture", profilePicture)
            }

            const response = await putAPI(`/api/update-celebrity/${celebrity._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            if(response?.hasError === false){
                toast.success(response.message)
                navigate("/super-admin/celebrities")
            }
            else{
                console.log(response)
            }
        }
        catch (error) {
            console.log(error)
            if(error?.status == 404){
                toast.error(error.response.data.message)
            }
        }
    };

    return (
        <div className="container-fluid">

            {/* Header */}
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Update Celebrity</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to="/super-admin/celebrities/update-celebrity" className="text-decoration-none">Celebrities</Link>
                            </li>
                            <li className="breadcrumb-item">Update Celebrity</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* */}
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">

                            {/* */}
                            <form onSubmit={handleUpdateCelebrityData}>

                                {/* Celebrity name & Profession */}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Full Name</label>
                                        <Select
                                            options={artistNames}
                                            placeholder="Select Artist"
                                            value={artistNames.find(artist => artist.value === celebrityData.celebrityId) || null}
                                            onChange={handleCelebritySelection}
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
                                            value={celebrityData.profession}
                                            onChange={handleCelebrityData}
                                        />
                                    </div>
                                </div>

                                {/* Highlights of journey */}
                                <div className="form-group">
                                    <label>Highlights of Journey</label>
                                    <ReactQuill
                                        theme="snow"
                                        placeholder="Describe your journey"
                                        name="journey"
                                        value={celebrityData.journey}
                                        onChange={handleCelebrityJourney}
                                    />
                                </div>

                                {/* Artworks, Years active & Exhibition featured */}
                                <div className="row">
                                    <div className="col-md-4 form-group">
                                        <label>Artworks Collected</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="artWorksCollected"
                                            value={celebrityData.artWorksCollected}
                                            onChange={handleCelebrityData}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4 form-group">
                                        <label>Years Active In Art</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="yearsActiveInArt"
                                            value={celebrityData.yearsActiveInArt}
                                            onChange={handleCelebrityData}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4 form-group">
                                        <label>Exhibition Featured</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="exhibitionFeatured"
                                            value={celebrityData.exhibitionFeatured}
                                            onChange={handleCelebrityData}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Profile picture */}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Profile Picture</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleProfilePicture}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        {profilePreview ? (
                                            <img
                                                src={profilePreview}
                                                alt="Profile picture"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    border: '1px solid #ddd',
                                                    padding: '3px'
                                                }}
                                            />
                                        ) : celebrity?.profilePicture ? (
                                            <img
                                                src={celebrity.profilePicture}
                                                alt={celebrity.artistName || "Profile"}
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    border: '1px solid #ddd',
                                                    padding: '3px'
                                                }}
                                            />
                                        ) : (
                                            <p className="text-muted">No profile picture uploaded</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <button type="submit" className="btn btn-success">
                                        Update Celebrity
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateCelebrity;