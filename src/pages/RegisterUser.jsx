import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { registerUser } from "../utils/api";
import UploadUsers from "./UploadUsers";
// import "./RegisterUser.css"; // optional, if you want to include additional custom styles
const API_BASE_URL = "http://127.0.0.1:8000";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await registerUser(formData);
        setMessage("User registered successfully!");
        setFormData({ name: "", email: "", mobile_number: "", password: "", role: "user" });
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const navigate = useNavigate();

  return (
    <>
        <CustomeNavbar />
            <div className="container mt-4" style={{height:"100vh", minWidth:"90vh", width:"100%", color:"black"}}>
                <div className="card shadow p-4">
                    <h2 className="text-center mb-4 text-primary">Register User</h2>
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-start fw-bold d-block">Name</label>
                        <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-start fw-bold d-block">Email</label>
                        <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-start fw-bold d-block">Mobile Number</label>
                        <input type="text" name="mobile_number" className="form-control" required value={formData.mobile_number} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-start fw-bold d-block">Password</label>
                        <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-start fw-bold d-block">Role</label>
                        <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>

                    {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
                    <Button variant="outline-primary" className="mt-3 w-100" onClick={() => navigate("/upload-users")}>
                        Bulk Upload Users
                    </Button>
                </div>
            </div>
    </>
  );
};

export default RegisterUser;
