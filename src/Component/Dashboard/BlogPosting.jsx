import React, { useState } from 'react';
import axios from 'axios';

const BlogForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        featuredImage: '',
        image2: '',
        image3: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData); // Debugging log
        try {
            const response = await axios.post('http://localhost:5000/api/users/blogs', formData);
            alert('Blog created successfully!');
            setFormData({
                title: '',
                category: '',
                description: '',
                featuredImage: '',
                image2: '',
                image3: ''
            });
        } catch (error) {
            console.error('Error creating blog:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : 'Error creating blog. Please try again.');
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="featuredImage">Featured Image URL</label>
                    <input
                        type="text"
                        id="featuredImage"
                        name="featuredImage"
                        value={formData.featuredImage}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image2">Image 2 URL</label>
                    <input
                        type="text"
                        id="image2"
                        name="image2"
                        value={formData.image2}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="image3">Image 3 URL</label>
                    <input
                        type="text"
                        id="image3"
                        name="image3"
                        value={formData.image3}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Create Blog</button>
            </form>
        </div>
    );
};

export default BlogForm;
