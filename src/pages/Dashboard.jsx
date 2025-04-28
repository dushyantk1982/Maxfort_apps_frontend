import {Container, Row, Col, Card} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import { fetchProtectedData } from "../utils/api";
import Logout from "../components/Logout";

const applications = [
    {name:"Microsoft Outlook", url:"https://login.microsoftonline.com/common/oauth2/authorize?client_id=00000002-0000-0ff1-ce00-000000000000&redirect_uri=https%3a%2f%2foutlook.office365.com%2fowa%2f&resource=00000002-0000-0ff1-ce00-000000000000&response_mode=form_post&response_type=code+id_token&scope=openid&msafed=1&msaredir=1&client-request-id=23d508a5-df78-2562-5cab-e568ccc3ba0d&protectedtoken=true&claims=%7b%22id_token%22%3a%7b%22xms_cc%22%3a%7b%22values%22%3a%5b%22CP1%22%5d%7d%7d%7d&nonce=638767523468902311.ce8c037e-3f69-40bc-b8a9-e0ded7cc319d&state=Dcu9DoIwFEDhou_iVrltoT8DcTAxDOCAJBq29rYmEgmmEIxvb4fvbCcjhOyTXZJBClFSaCVVyUUhtQEuGDti0AhCBSqe0tACHFKnraEBfPAKUTDjs_TW-fy1-WlZ7RoqdojBv2LAtZ8rW3eAdSubn9n8o1scN7GZzDRM73HoW369laPjsLn75ePO-g8&sso_reload=true", logo:"https://uhf.microsoft.com/images/microsoft/RE1Mu3b.png", username: "dushyant@dsds.co.in",
        password: "Welcome01??"},
    { name: "Schoology (LMS)", url: "https://maxfortrohini.schoology.com", logo: "https://uhf.microsoft.com/images/microsoft/RE1Mu3b.png", username: "Ilisha46518@maxfortrohini.in",
        password: "ilisha@46518" },
  { name: "Entab (ERP)", url: "https://www.maxfortcampuscare.in/", logo: "https://maxfortrohini.in/wp-content/uploads/2022/12/Maxfort-logo-VB-v2.1-354x300-1.png", username: "P47088",
    password: "123456" },
    { name: "Embibe", url: "www.embibe.com", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEzkaVgt8prNMg0D409JnstHY4yAdMCt-nTpDaLcOumKAXz40tmMSgn3_xxcG8p30byLM&usqp=CAU", username: "student@school.edu",
        password: "canvasPass456" },
    { name: "Scholastic E- library", url: "https://slz02.scholasticlearningzone.com/resources/dp-int/dist/#/login3/INDWTPQ", logo: "https://slz02.scholasticlearningzone.com/resources/dp-int/dist/assets/images/scholastic_logo.jpg", username: "admin@gmail.com",
      password: "Admin@123" },
      { name: "Razplus from learning A-Z", url: "https://www.kidsa-z.com/ng/", logo: "https://aimkt.misacdn.net/app/vr8x81d7/attachment/41f49e45-cff8-4e3a-96bf-c41c7938b3de.png", username: "admin@gmail.com",
        password: "Admin@123" }
];

const Dashboard = () => {

  const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      const fetchProtectedData = async () => {
        const token = localStorage.getItem("token");
        // console.log("Token:", token);
        
        if(!token){
          console.error("No token found");
          return;
        }
        
        try{
          const response = await fetch("${API_BASE_URL}/protected", {
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
          console.log("Protected Data: ", data);  
          // alert(data.message);
          setUserData(data);
        }catch(error){
          console.error("Error fetching protected data: ", error);
        }
      };
      fetchProtectedData();
    }, []);

      

  return (
    <>
    
    {/* {userData ? <pre>{JSON.stringify(userData, null, 2)}</pre> : <p>Loading...</p>} */}
    <CustomeNavbar />
    {userData && <p>{userData.message}</p>}
    <Container className="container mt-4 shadow p-4" style={{height:"100vh"}}>
        
      <h2 className="mb-4 text-center fw-bold text-primary">Welcome to MyApps School SSO</h2>
      <Row className="justify-content-center">
        {applications.map((app, index) => (
          <Col key={index} md={2} className="mb-4 ml-auto mr-auto">
            <Card onClick={() => window.location.href = app.oauthUrl || app.url} className="shadow-lg border-0" style={{ cursor: "pointer", transition: "0.3s", height:"170px", width:"170px" }}>
              <Card.Img variant="top" src={app.logo} style={{ height: "80px", objectFit: "contain", padding: "0px" }} />
              <Card.Body className="text-center">
                <Card.Title style={{fontSize:"12px"}}>{app.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </Container>
    </>
  );
};

export default Dashboard
