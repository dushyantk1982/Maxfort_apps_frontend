import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { preview } from "vite";
// import React from 'react'



const Profile = () => {

    const profile_data={first_name:"Dushyant", last_name:"Upadhyay", email:"dushyant@dsds.co.in", contact:"9926216669", dob:"1982-11-10", gender:"Male", place:"Gwalior", role:"Student"};

const [isEditing, setIsEditing]=useState(false);
const [profile, setProfile]=useState(profile_data);

const handleEdit = () =>{
    setIsEditing(true);
}

const handleChange = () =>{
    const {name, value} = e.target;
    // setProfile((previewProfile) => ({...previewProfile, [name]:value}));
    setProfile({...profile, [name]: value});
}

const handleCancel = () =>{
    setProfile(profile_data);
    setIsEditing(false);
}

const handleSave = () =>{
    console.log("Update profile: ",profile);
    alert("Profile updated successfully");
    setIsEditing(false);
}

  return (
    <>
      <CustomeNavbar />
    <Container className="container mt-4" style={{height:"100vh", width:"100vw", color:"black"}}>
        <Row className="justify-content-center">
            <Col md={8}>
                <Card className="shadow-lg p-4 rounded">
                    <Card.Body className="text-center text-primary mb-4">
                        <h2 className="text-dark mb-4 text-center fw-bold text-primary" style={{color:"black"}}>
                            {isEditing ? "Edit Profile" : "View Profile"}
                        </h2>                
                        <Form>
                            {/* First Name & Last Name */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">First Name</Form.Label>
                                        <Form.Control type="text" name="first_name" value={profile.first_name} onChange={handleChange} disabled={!isEditing} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Last Name</Form.Label>
                                        <Form.Control type="text" name="last_name" value={profile.last_name} onChange={handleChange} disabled={!isEditing} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Email</Form.Label>
                                        <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Contact</Form.Label>
                                        <Form.Control type="tel" name="contact" value={profile.contact} onChange={handleChange} disabled={!isEditing} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Date of Birth</Form.Label>
                                        <Form.Control type="date" name="dob" value={profile.dob} onChange={handleChange} disabled={!isEditing} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Gender</Form.Label>
                                        <Form.Select name="gender" value={profile.gender} onChange={handleChange} disabled={!isEditing}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Place</Form.Label>
                                        <Form.Control type="text" name="place" value={profile.place} onChange={handleChange} disabled={!isEditing} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-dark">Role</Form.Label>
                                        <Form.Select name="role" value={profile.role} onChange={handleChange} disabled={!isEditing}>
                                            <option value="Admin">Admin</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Student">Student</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
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
