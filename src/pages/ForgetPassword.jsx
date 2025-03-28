import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ToDo: Call backend API to send password reset email
    setMessage("If your email is registered, a password reset link has been sent.");
    setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 sec
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius:"10px", width:"450px"}}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "10px" }}>
        <div className="text-center mb-3">
          <h2 className="fw-bold text-primary">Forgot Password</h2>
          <p className="text-muted">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="Email" className="form-label fw-bold">Email</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold mt-2">Send Reset Link</button>
        </form>
        {message && <p className="text-success text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          <a href="/login" className="text-decoration-none text-primary">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
