import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from 'react'
import Logout from "./Logout";

const CustomeNavbar = () => {

  // console.log("Rendering CustomeNavbar...");

  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
  };  

  

  return (
    
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm fixed-top">
      <Container>
        {/* Navbar Brand / Logo */}
        <Navbar.Brand as={Link} to="/dashboard"><i className="bi bi-grid-fill"></i> MyApps School SSO</Navbar.Brand>
        
         {/* Navbar Toggle Button */}
        <Navbar.Toggle area-controls="navbar-nav" />
       
        {/* Navbar Menu */}
        <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/dashboard"><i className="bi bi-house-door-fill"></i> Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/createApp"><i className="bi bi-laptop"></i> Add Apps</Nav.Link>
              {/* <NavDropdown title={<span><i className="bi bi-laptop"></i> Applications</span>} id="apps-fropdown">
                  <NavDropdown.Item as={Link} to="/createApp"><i class="bi bi-window-plus"></i> Add Apps</NavDropdown.Item>
              </NavDropdown> */}
              {/* Dropdown Menu 1: User Account */}
              <NavDropdown title={<span><i className="bi bi-person-circle"></i> Account</span>} id="account-fropdown">
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person-badge-fill"></i> Profile
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item as={Link} to="/settings">
                    <i className="bi bi-gear-fill"></i> Settings
                  </NavDropdown.Item> */}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <Logout />
                    {/* <i className="bi bi-box-arrow-right"></i> Logout */}
                  </NavDropdown.Item>
              </NavDropdown>
             
            </Nav>
        </Navbar.Collapse>
       
      </Container>
    </Navbar>
  )
}

export default CustomeNavbar
