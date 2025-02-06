import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the API URL to match the correct backend endpoint
      const response = await axios.post('http://localhost:5001/api/vendor/reset-password', { email });
      setMessage(response.data.message);
      setError('');  // Clear any previous error
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Error sending reset link. Please try again.');
      setMessage(''); // Clear any success message
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(''); // Clear error when email is updated
              setMessage(''); // Clear message when email is updated
            }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
