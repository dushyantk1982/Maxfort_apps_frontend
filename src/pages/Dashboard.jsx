import {Container, Row, Col, Card, Modal, Button, Table} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import { fetchProtectedData, fetchUserAppCredentials } from "../utils/api";
import Logout from "../components/Logout";
import API_BASE_URL from "../config";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Dashboard.css';

const applications = [
    {name:"Microsoft Outlook", url:"https://outlook.office365.com/mail/", logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHg-9a54f3dr8FdBjk4E7_ORnM1UCfJTxSlw&s",supportsDirectLogin: false},
    { name: "Schoology (LMS)", url: "https://maxfortrohini.schoology.com", logo: "https://static.wixstatic.com/media/a753e4_e21621006fe54c9b9bd52e8e72fffe06~mv2.png/v1/fill/w_372,h_350,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/PowerSchool%20Parent%20Portal%20-%20just%20logo.png", supportsDirectLogin: false},
  { name: "Entab (ERP)", url: "https://www.maxfortcampuscare.in/", logo: "https://maxfortrohini.in/wp-content/uploads/2022/12/Maxfort-logo-VB-v2.1-354x300-1.png", supportsDirectLogin: false},
    { name: "Embibe", url: "https://www.embibe.com", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEzkaVgt8prNMg0D409JnstHY4yAdMCt-nTpDaLcOumKAXz40tmMSgn3_xxcG8p30byLM&usqp=CAU", supportsDirectLogin: false},
    { name: "Scholastic E- library", url: "https://slz02.scholasticlearningzone.com/resources/dp-int/dist/#/login3/INDWTPQ", logo: "https://slz02.scholasticlearningzone.com/resources/dp-int/dist/assets/images/scholastic_logo.jpg", supportsDirectLogin: false},
      { name: "Razplus from learning A-Z", url: "https://www.kidsa-z.com/ng/", logo: "https://aimkt.misacdn.net/app/vr8x81d7/attachment/41f49e45-cff8-4e3a-96bf-c41c7938b3de.png", supportsDirectLogin: false}
];

const Dashboard = () => {

  const [userData, setUserData] = useState(null);
  const [showVault, setShowVault] = useState(false);
  const [vaultData, setVaultData] = useState([]);
  const navigate = useNavigate();
  const [visiblePasswords, setVisiblePasswords] = useState({});

    useEffect(() => {
      const fetchProtectedData = async () => {
        const token = localStorage.getItem("token");
        // console.log("Token:", token);
        
        if(!token){
          console.error("No token found");
          return;
        }
        
        try{
          const response = await fetch(`${API_BASE_URL}/protected`, {
            method:"GET",
            headers: {
              "Authorization" : `Bearer ${token}`,
              "Content-Type" : "application/json"
            }
          });
          
          if(!response.ok){
            throw new Error(`HTTP Error : ${response.status}`);
          }
          
          const data = await response.json();
          // console.log("Protected Data: ", data);  
          // alert(data.message);
          setUserData(data);
        }catch(error){
          console.error("Error fetching protected data: ", error);
        }
      };
      fetchProtectedData();
    }, []);

    const handleVaultClick = async () =>{
      // console.log("Vault button clicked");
      const token = localStorage.getItem("token");
      const userId = userData?.user?.id;
      if (!userId) {
        console.error("User ID not found. Cannot fetch credentials.");
        return;
      }

      try{
        const response = await fetch(`${API_BASE_URL}/user-credentials/${userId}`,{
          headers:{
            "Authorization":`Bearer ${token}`
          }
        });
        if(!response.ok) throw new Error("Failed to fetch credentials");
        const data = await response.json();
        // console.log("Protected Data: ", data);
        setVaultData(data);
        setShowVault(true);
        // console.log("showVault:", showVault);
      }catch(error){
        console.error("Vault fetch error: ", error);
        alert("Could not load credentials");
      }
    };

    const handleAppClick = async (app) => {
      try {
        const credentials = await fetchUserAppCredentials(app.name);
    
        // if (!credentials.username || !credentials.password) {
        //   console.error("No credentials found for this app");
        //   window.open(app.url, '_blank');
        //   return;
        // }

        if(app.supportsDirectLogin && credentials.username && credentials.password){
            // Create hidden form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = app.url;
            form.target = '_blank'; // Open in new tab

            // Username field
            const usernameField = document.createElement('input');
            usernameField.type = 'hidden';
            usernameField.name = 'username'; 
            usernameField.value = credentials.username;
            form.appendChild(usernameField);

            // Password field
            const passwordField = document.createElement('input');
            passwordField.type = 'hidden';
            passwordField.name = 'password'; // Again, it should match the expected parameter name
            passwordField.value = credentials.password;
            form.appendChild(passwordField);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);

        }else{
          // For third-party apps, just open the login page
          window.open(app.url, '_blank');
        }

        
      } catch (error) {
      console.error("Error during login attempt: ", error);
      window.open(app.url, '_blank');
    }
};


const togglePasswordVisibility = (index) => {
  setVisiblePasswords(prev => ({
    ...prev,
    [index]: !prev[index]
  }));
};

        

  return (
    <>
    
    {/* {userData ? <pre>{JSON.stringify(userData, null, 2)}</pre> : <p>Loading...</p>} */}
    <CustomeNavbar />
    {userData && <p>{userData.message}</p>}
    <Container className="container mt-4 shadow p-4" style={{height:"100vh"}}>
        
      <h2 className="mb-4 text-center fw-bold text-primary">Welcome to Maxfort Apps</h2>
      <Row className="justify-content-center">
        {applications.map((app, index) => (
          <Col key={index} md={2} className="mb-4 ml-auto mr-auto">
            <Card onClick={() => handleAppClick(app)} className="shadow-lg border-0" style={{ cursor: "pointer", transition: "0.3s", height:"170px", width:"170px" }}>
            {/* <Card onClick={() => window.location.href = app.oauthUrl || app.url} className="shadow-lg border-0" style={{ cursor: "pointer", transition: "0.3s", height:"170px", width:"170px" }}> */}
              <Card.Img variant="top" src={app.logo} style={{ height: "80px", objectFit: "contain", padding: "0px" }} />
              <Card.Body className="text-center">
                <Card.Title style={{fontSize:"12px"}}>{app.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Col md={2} className="mb-4 ml-auto mr-auto">
            <Card onClick={handleVaultClick} className="shadow-lg border-0" style={{ cursor: "pointer", transition: "0.3s", height:"170px", width:"170px" }}>
              <Card.Img variant="top" src='vault.png' style={{ height: "80px", objectFit: "contain", padding: "0px" }} />
              <Card.Body className="text-center">
                <Card.Title style={{fontSize:"12px"}}>My Vault</Card.Title>
              </Card.Body>
            </Card>
          </Col>
      </Row>
      
      {/* <Button variant="primary" className="mb-4" onClick={handleVaultClick}>
          My Vault
      </Button> */}
    </Container>
    
    {/* // Model JSX */}
    <Modal show={showVault} onHide={() => setShowVault(false)} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>🔐 My Vault</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
        {vaultData.length > 0 ? (
          <Table responsive bordered hover className="text-center shadow-sm rounded" style={{ backgroundColor: "white" }}>
            <thead className="bg-light">
              <tr>
                <th>Application</th>
                <th colSpan={"2"}>Username</th>
                <th colSpan={"2"}>Password</th>
              </tr>
            </thead>
            <tbody>
              {vaultData.map((cred, index) => (
                <tr key={index}>
                  <td className="fw-bold text-start">{cred.app_name}</td>
                  <td>
                    <div className="text-start">
                      <span>{cred.username}</span>
                      
                    </div>
                  </td>
                  <td>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(cred.username)}
                        title="Copy Username"
                      >
                       <i className="bi bi-copy"></i>
                      </Button>
                  </td>
                  <td>
                    {/* <div className="d-flex justify-content-between align-items-center">
                      <span>{cred.password}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(cred.password)}
                        title="Copy Password"
                      >
                        
                      </Button>
                    </div> */}
                    <div className="text-start">
        <span style={{ fontFamily: "monospace" }}>
          {visiblePasswords[index] ? cred.password : '•'.repeat(cred.password.length)}
        </span>
        
      </div>
              </td>
              <td>
                <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => togglePasswordVisibility(index)}
            title={visiblePasswords[index] ? "Hide Password" : "Show Password"}
            className="me-1"
          >
            {visiblePasswords[index] ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigator.clipboard.writeText(cred.password)}
            title="Copy Password"
          >
            <i className="bi bi-copy"></i>
          </Button>
        </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p className="text-muted text-center">No credentials found.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowVault(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </>
  );
};

export default Dashboard
