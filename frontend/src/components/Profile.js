// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true); // Set loading before fetching
        const response = await axios.get('http://localhost:5001/vendor/profile', {
          withCredentials: true, // Include cookies
        });

        setVendor(response.data); // Store vendor data
        setError(''); // Clear any previous errors
      } catch (err) {
        setError('Failed to fetch profile');
        
        // If unauthorized (401), redirect to login
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false); // Stop loading after response/error
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profile</h2>

      {loading && <div className="alert alert-info mt-4">Loading your profile...</div>}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && vendor && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{vendor.name}</h5>
            <p className="card-text"><strong>Email:</strong> {vendor.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
