// src/components/ArtistManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import "./Artist.css"

const API_BASE_URL = 'http://localhost:3001/artists';

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: '',
    socialMediaLinks: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchArtistDetails = async (artistId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${artistId}`);
      setSelectedArtist(response.data);
    } catch (error) {
      console.error('Error fetching artist details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/${currentArtistId}`, formData);
        setIsEditing(false);
        setCurrentArtistId(null);
      } else {
        await axios.post(`${API_BASE_URL}/create`, formData);
      }
      setFormData({ name: '', bio: '', profileImage: '', socialMediaLinks: '' });
      fetchArtists();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (artist) => {
    setIsEditing(true);
    setCurrentArtistId(artist._id);
    setFormData({
      name: artist.name,
      bio: artist.bio,
      profileImage: artist.profileImage,
      socialMediaLinks: artist.socialMediaLinks.join(', '),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchArtists();
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  };

  return (
    <div>
      <h1>Artist Management</h1>

      <form onSubmit={handleFormSubmit}>
        <input type="text" name="name" placeholder="Artist Name" value={formData.name} onChange={handleInputChange} required />
        <input type="text" name="bio" placeholder="Artist Bio" value={formData.bio} onChange={handleInputChange} />
        <input type="text" name="profileImage" placeholder="Profile Image URL" value={formData.profileImage} onChange={handleInputChange} />
        <input type="text" name="socialMediaLinks" placeholder="Social Media Links (comma separated)" value={formData.socialMediaLinks} onChange={handleInputChange} />
        <button type="submit">{isEditing ? 'Update' : 'Create'} Artist</button>
        {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
      </form>

      <h2>Artist List</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist._id}>
            <h3>{artist.name}</h3>
            <p>{artist.bio}</p>
            <img src={artist.profileImage} alt={artist.name} width="100" />
            <p>Social Media: {artist.socialMediaLinks.join(', ')}</p>
            <button onClick={() => handleEdit(artist)}>Edit</button>
            <button onClick={() => handleDelete(artist._id)}>Delete</button>
            <button onClick={() => fetchArtistDetails(artist._id)}>View Art Pieces</button>
          </li>
        ))}
      </ul>

      {selectedArtist && (
        <div>
          <h2>{selectedArtist.name}'s Art Pieces</h2>
          <ul>
            {selectedArtist.artPieces.map((artPiece) => (
              <li key={artPiece._id}>
                <h3>{artPiece.title}</h3>
                <p>{artPiece.description}</p>
                <img src={artPiece.image} alt={artPiece.title} width="100" />
                <p>Price: ${artPiece.price}</p>
                <p>Category: {artPiece.category}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtistManagement;
