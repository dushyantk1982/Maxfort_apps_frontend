import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
// import React from 'react'
import Logout from "./Logout";

const CustomeNavbar = () => {

  // console.log("Rendering CustomeNavbar...");

  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () =>{
    // localStorage.removeItem("token");
    // navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
        navigate("/login");
  };  

  

  return (
    
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm fixed-top">
      <Container>
        {/* Navbar Brand / Logo */}
        <Navbar.Brand as={Link} to="/dashboard"><i className="bi bi-grid-fill"></i> Maxfort Apps</Navbar.Brand>
        
         {/* Navbar Toggle Button */}
        <Navbar.Toggle area-controls="navbar-nav" />
       
        {/* Navbar Menu */}
        <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/dashboard" className="text-white"><i className="bi bi-house-door-fill"></i> Dashboard</Nav.Link>
              {/* Conditionally render Users dropdown if role is admin */}
                {role === "admin" && (
                  <NavDropdown title={<span className="text-white"><i className="bi bi-people-fill"></i> Users</span>} id="apps-dropdown">
                    <NavDropdown.Item as={Link} to="/register" className="text-primary"><i className="bi bi-person-fill-add text-primary"></i> Add New User</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/users" className="text-primary"><i className="bi bi-view-list"></i> View Users</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/add-credentials" className="text-primary"><i className="bi bi-list-check"></i> App Credentials</NavDropdown.Item>
                  </NavDropdown>
                )}
              <NavDropdown title={<span className="text-white"><i className="bi bi-person-circle"></i> Account</span>} id="account-fropdown">
                  <NavDropdown.Item as={Link} to="/profile" className="text-primary">
                    <i className="bi bi-person-badge-fill"></i> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-primary">
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </NavDropdown.Item>
              </NavDropdown>
             
            </Nav>
        </Navbar.Collapse>
       
      </Container>
    </Navbar>
  )
}

export default CustomeNavbar
