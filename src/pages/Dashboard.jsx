import {Container, Row, Col, Card, Modal, Button, Table} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import { fetchProtectedData, fetchUserAppCredentials } from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      { name: "Razplus from learning A-Z", url: "https://www.kidsa-z.com/ng/", logo: "https://aimkt.misacdn.net/app/vr8x81d7/attachment/41f49e45-cff8-4e3a-96bf-c41c7938b3de.png", supportsDirectLogin: false},
      { name: "ICT-360", url: "https://kms.ict360.com/ict_v3/login", logo: "https://kms.ict360.com/ict_v3/assets/images/ict_logo.png", supportsDirectLogin: false}
];

// Chrome Extension configuration
const CHROME_EXTENSION_ID = "hpehkhbgcobleobgjggakdmnmanobfio";
const APP_KEY_MAP = {
  "Microsoft Outlook": "microsoft",
  "Schoology (LMS)": "schoology",
  "Entab (ERP)": "maxfort",
  "Embibe": "embibe",
  "Scholastic E- library": "scholastic",
  "Razplus from learning A-Z": "kidsaz",
  "ICT-360": "ict360"
};


const Dashboard = () => {

  const [userData, setUserData] = useState(null);
  const [showVault, setShowVault] = useState(false);
  const [vaultData, setVaultData] = useState([]);
  const navigate = useNavigate();
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editingCredential, setEditingCredential] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', password: '' });
  const [isUpdating, setIsUpdating] = useState(false);

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
          // alert(data.message);
          setUserData(data);
        }catch(error){
          console.error("Error fetching protected data: ", error);
        }
      };
      fetchProtectedData();
    }, []);

    const handleVaultClick = async () =>
    {
        // console.log("Vault button clicked");
        const token = localStorage.getItem("token");
        const userId = userData?.user?.id;
        if (!userId) 
        {
            console.error("User ID not found. Cannot fetch credentials.");
            return;
        }

        try
        {
            const response = await fetch(`${API_BASE_URL}/user-credentials/${userId}`,{ headers:{ "Authorization":`Bearer ${token}` } });
        
            if(!response.ok) throw new Error("Failed to fetch credentials");
            const data = await response.json();
            // console.log("Protected Data: ", data);
            setVaultData(data);
            setShowVault(true);
            
            // Check if extension is available
            const isExtensionAvailable = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
            // console.log("Chrome runtime available:", typeof chrome !== 'undefined');
            // console.log("Chrome runtime object:", chrome?.runtime ? "Yes" : "No");
            // console.log("Chrome sendMessage available:", chrome?.runtime?.sendMessage ? "Yes" : "No");
            // // Send credentials to the Chrome Extension
            if (isExtensionAvailable) {
                try
                {
                    // Check existing credentials in extension
                    chrome.runtime.sendMessage(CHROME_EXTENSION_ID, { type: 'GET_CREDENTIALS' }, async (response) => {
                          if (chrome.runtime.lastError) {
                                console.error("Error checking extension credentials:", chrome.runtime.lastError);
                                return;
                          }
                    // Create credentials object for Chrome Extension
                    const extensionCredentials = {};
                    data.forEach(cred => 
                      { const appKey = APP_KEY_MAP[cred.app_name]; 
                          if (appKey) {
                              extensionCredentials[appKey] = {
                                  username: cred.username,
                                  password: cred.password
                              };
                          }
                    });
                    // Only update if credentials are different
                    const needsUpdate = !response?.credentials || Object.keys(extensionCredentials).some(key => {
                        const existing = response.credentials[key];
                        const updated = extensionCredentials[key];
                        return !existing || 
                            existing.username !== updated.username || 
                            existing.password !== updated.password;
                    });
                    
                    if (needsUpdate) {
                        console.log("Credentials need update, sending to extension:", extensionCredentials);
              
                        // Send message to Chrome Extension
                        chrome.runtime.sendMessage(CHROME_EXTENSION_ID, {
                            type: 'UPDATE_CREDENTIALS',
                            credentials: extensionCredentials
                        }, response => {
                            if (chrome.runtime.lastError) {
                                // console.error("Chrome Extension error:", chrome.runtime.lastError);
                                toast.error("Failed to sync with Chrome Extension. Please make sure it's installed and enabled.");
                                return;
                            }
                            if (response && response.success) {
                                // console.log("Credentials successfully synced with extension");
                                toast.success("Credentials synced with Chrome Extension");
                            } else {
                                // console.error("Failed to sync credentials with Chrome Extension");
                                toast.error("Failed to sync credentials with Chrome Extension");
                            }
                        });
                    } else {
                          console.log("Credentials are up to date in extension");
                    }
                });
              } catch(error)
                {     
                    // console.error("Error in sending credentials to Extension", error);
                    toast.error("Error communicating with Chrome Extension");
                }
            } else {
                    // console.log("Extension is not detected");
                    toast.warning("Chrome Extension not detected. Please install the extension to enable auto-login features.");
            }
        }catch(error)
         {
            // console.error("Vault fetch error: ", error);
            alert("Could not load credentials");
            // toast.error("Could not load credentials");
         }
      };

    const handleAppClick = async (app) => 
    {
      try
      {
        const credentials = await fetchUserAppCredentials(app.name);
    
      
        if(app.supportsDirectLogin && credentials.username && credentials.password)
        {
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

        }
        else
        {
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

// Component to handle edit password in vault
const handleEdit = (cred) => {
  setEditingCredential(cred);
  setEditFormData({
    username: cred.username,
    password: cred.password
  });
};

// Function to save updated credentials
const handleSaveEdit = async () => {
  if (isUpdating) return;
  setIsUpdating(true);
  try {
    const token = localStorage.getItem("token");
    const userEmail = userData?.user?.email;
    
    if (!editingCredential || !userEmail || !token) {
      toast.error("Missing user information.");
      return;
    }

    // console.log("Updating credential for:", {
    //   email: userEmail,
    //   app: editingCredential.app_name,
    //   username: editFormData.username,
    //   password: editFormData.password
    // });
    
    const response = await axios.put(
      `${API_BASE_URL}/update-credential/${userEmail}/${editingCredential.app_name}`,
      {
        username: editFormData.username,
        password: editFormData.password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      // Refresh the vault data
      const vaultRes = await fetch(`${API_BASE_URL}/user-credentials/${userData.user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (vaultRes.ok) {
        const updatedVault = await vaultRes.json();
        setVaultData(updatedVault);
        toast.success("Credential updated successfully!");


        // Update Chrome Extension with new credentials
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          try {
        
            const appKey = APP_KEY_MAP[editingCredential.app_name];
            if (appKey) {
              // console.log("Sending updated credential to extension:", {
              //   [appKey]: {
              //     username: editFormData.username,
              //     password: editFormData.password
              //   }
              // });

              chrome.runtime.sendMessage(CHROME_EXTENSION_ID, {
                type: 'UPDATE_CREDENTIALS',
                credentials: {
                  [appKey]: {
                    username: editFormData.username,
                    password: editFormData.password
                  }
                }
              }, response => {
                if (chrome.runtime.lastError) {
                  console.error("Chrome Extension error:", chrome.runtime.lastError);
                  return;
                }
                if (response && response.success) {
                  // console.log("Credential successfully updated in extension");
                  toast.success("Chrome Extension credentials updated");
                } else {
                  console.error("Failed to update Chrome Extension credentials");
                }
              });
            }
          } catch (error) {
            console.error("Error updating Chrome Extension credentials:", error);
          }
        }


        setEditingCredential(null);
        setEditFormData({ username: '', password: '' });
      } else {
        throw new Error("Failed to refresh vault data");
      }
    }
  } catch (error) {
    // console.error("Failed to update credentials:", error);
    toast.error(error.response?.data?.detail || "Failed to update credentials");
  }finally {
    setIsUpdating(false);
  }
};
       

  return (
    <>
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
      
     
    </Container>
    
    

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
                        {editingCredential?.app_name === cred.app_name ? (
                          <input type="text" value={editFormData.username} onChange={(e) => setEditFormData((prev) => ({ ...prev, username: e.target.value }))} className="form-control" placeholder="Username"/>
                        ) : (
                          <span>{cred.username}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => navigator.clipboard. writeText(cred.username)} title="Copy Username">
                        <i className="bi bi-copy"></i>
                      </Button>
                    </td>
                    <td>
                      <div className="text-start">
                        {editingCredential?.app_name === cred.app_name ? (
                          <input type={visiblePasswords[index] ? "text" : "password"} value={editFormData.password} onChange={(e) => setEditFormData((prev) => ({ ...prev, password: e.target.value }))} className="form-control" placeholder="Password"/>
                        ) : (
                          <span style={{ fontFamily: "monospace" }}>
                            {visiblePasswords[index] ? cred.password : '•'.repeat(cred.password.length)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {editingCredential?.app_name === cred.app_name ? (
                          <>
                            <Button variant="success" size="sm" className="me-1" onClick={handleSaveEdit} disabled={isUpdating}>
                              {isUpdating ? (
                                <i className="bi bi-arrow-repeat spin"></i>
                              ) : (
                                <i className="bi bi-check2"></i>
                              )}
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => { setEditingCredential(null); setEditFormData({ username: '', password: '' }); }} disabled={isUpdating}>
                              <i className="bi bi-x"></i>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline-primary" size="sm" onClick={() => togglePasswordVisibility(index)} className="me-1" title={visiblePasswords[index] ? "Hide Password" : "Show Password"}>
                              {visiblePasswords[index] ? (
                                <i className="bi bi-eye-slash"></i>
                              ) : (
                                <i className="bi bi-eye"></i>
                              )}
                            </Button>
                            <Button variant="outline-primary" size="sm" onClick={() => navigator.clipboard.writeText(cred.password)} title="Copy Password" className="me-1">
                              <i className="bi bi-copy"></i>
                            </Button>
                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(cred)} title="Edit Credentials">
                              <i className="bi bi-pencil"></i>
                            </Button>
                          </>
                        )}
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
          <Button variant="primary" onClick={() => setShowVault(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

<ToastContainer />

    </>
  );
};

export default Dashboard
