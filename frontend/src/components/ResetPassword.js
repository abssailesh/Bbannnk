import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { email } = useParams(); // Capture the email from URL
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/vendor/reset-password-with-otp', {
        otp,
        email,
        newPassword
      });

      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login page after success
    } catch (err) {
      setError('Failed to reset password. Try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">OTP</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Reset Password</button>
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
