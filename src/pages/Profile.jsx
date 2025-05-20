import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { data, useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../config";
// import { preview } from "vite";
// import React from 'react'



const Profile = () => {


const [isEditing, setIsEditing]=useState(false);
const [profile, setProfile]=useState(null);

useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;

    const decoded = jwtDecode(token);
    const userEmail = decoded?.sub;
    
    fetch(`${API_BASE_URL}/user/profile?email=${userEmail}`,{
        headers:{
            Authorization:`Bearer${token}`,
        },
    })
    .then(res => res.json())
    .then(data => {
        setProfile(data)
    })
    .catch(err => console.error("Profile fetch error: ", err));

}, []);

const handleEdit = () =>{
    setIsEditing(true);
}

const handleChange = (e) =>{
    const {name, value} = e.target;
    // setProfile((previewProfile) => ({...previewProfile, [name]:value}));
    // setProfile({...profile, [name]: value});
    setProfile((prev) => ({ ...prev, [name]: value }));
}

const handleCancel = () =>{
    // setProfile(profile_data);
    setIsEditing(false);
}

const handleSave = () =>{
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/user/profile/update`, {
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify(profile),
    })
    .then((res) => res.json())
    .then((data) => {
        alert("Profile updates successfully");
        setIsEditing(false);
    })
    .catch((err) => console.error("Save Error : ", err));

};

if (!profile) return <div>Loading...</div>;

  return (
    <>
      <CustomeNavbar />
    <Container className="container mt-4" style={{height:"100vh", width:"80vw", color:"black"}}>
        <Row className="justify-content-center">
            <Col md={8}>
                <Card className="shadow-lg p-4 rounded">
                    <Card.Body>
                        <h2 className="text-primary mb-4 text-center fw-bold text-primary" style={{color:"black"}}>
                            {isEditing ? "Edit Profile" : "View Profile"}
                        </h2>                
                        <Form>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="fw-bold text-dark">Name</Form.Label>
                                <Form.Control type="text" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} />
                                
                            </Form.Group>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="text-dark fw-bold">Email</Form.Label>
                                <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="text-dark fw-bold">Contact</Form.Label>
                                <Form.Control type="tel" name="contact" value={profile.contact} onChange={handleChange} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="text-dark fw-bold">Role</Form.Label>
                                <Form.Control type="text" name="place" value={profile.role} onChange={handleChange} disabled />
                            </Form.Group>
                            <div className="text-center">
                                {isEditing ? (
                                    <>
                                        <Button variant="success" className="me-2" onClick={handleSave}>Save</Button>
                                        <Button variant="danger" onClick={handleCancel}>Cancel</Button>

                                    </>
                                ) : (
                                    <Button variant="primary" onClick={handleEdit}>Edit Profile</Button>
                                ) }
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        
        <div className=""></div>
    </Container>


    </>
  )}

export default Profile
