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
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    // Code to display the notifications
    const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("userData"))?.user?.id;
      
      if (!userId) return;

      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");
      
      const data = await response.json();
      const unreadNotifications = data.filter(n => n.is_active && !n.is_read);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  fetchUnreadCount();
    
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
              <Nav.Link as={Link} to="/dashboard" className="text-white position-relative">
                      <i className="bi bi-bell-fill"></i>
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {unreadCount}
                        </span>
                      )}
              </Nav.Link>
              {/* Conditionally render Users dropdown if role is admin */}
                {role === "admin" && (
                  <NavDropdown title={<span className="text-white"><i className="bi bi-people-fill"></i> Users</span>} id="apps-dropdown">
                    <NavDropdown.Item as={Link} to="/register" className="text-primary"><i className="bi bi-person-fill-add text-primary"></i> Add New User</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/users" className="text-primary"><i className="bi bi-view-list"></i> View Users</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/add-credentials" className="text-primary"><i className="bi bi-list-check"></i> App Credentials</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/notifications" className="text-primary"><i class="bi bi-send"></i> Create Notification</NavDropdown.Item>
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
