import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AppForm = () => {
  const [formData, setFormData] = useState({
    appName: "",
    link: "",
    image: "",
    appUserName: "",
    appPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");
  };

  return (
    <>
    <CustomeNavbar />
    <Container className="mt-4" style={{width:"100vw"}}>
    <div className="container mt-4" style={{width:"100vw"}}>
      <div className="card shadow p-4" style={{alignItems:"center"}}>
        <h2 className="mb-4">App Information Form</h2>
        <form onSubmit={handleSubmit}>
          {/* App Name */}
          <div className="mb-3" style={{width:"400px", alignItems:"center"}}>
            <label className="form-label">App Name</label>
            <input type="text" className="form-control" name="appName" value={formData.appName} onChange={handleChange} required />
          </div>

          {/* Link */}
          <div className="mb-3">
            <label className="form-label">Link</label>
            <input type="url" className="form-control" name="link" value={formData.link} onChange={handleChange} required />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input type="url" className="form-control" name="image" value={formData.image} onChange={handleChange} required />
          </div>

          {/* App Username */}
          <div className="mb-3">
            <label className="form-label">App Username</label>
            <input type="text" className="form-control" name="appUserName" value={formData.appUserName} onChange={handleChange} required />
          </div>

          {/* App Password */}
          <div className="mb-3">
            <label className="form-label">App Password</label>
            <input type="password" className="form-control" name="appPassword" value={formData.appPassword} onChange={handleChange} required />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
    </Container>
    </>
  );
};

export default AppForm;
