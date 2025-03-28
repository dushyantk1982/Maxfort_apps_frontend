import {Container, Row, Col, Card} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomeNavbar from "../components/CustomeNavbar";
import { fetchProtectedData } from "../utils/api";
import Logout from "../components/Logout";

const applications = [
    {name:"Google Classroom", url:"https://classroom.google.com", logo:"https://www.gstatic.com/classroom/logo_square_rounded.svg", username: "aravu0020@gmail.com",
        password: "Arav@12345"},
    { name: "Canvas LMS", url: "https://canvas.instructure.com", logo: "https://www.instructure.com/sites/default/files/styles/small_hq/public/image/2024-11/canvas_bug_color_rgb.png.webp?itok=OvyVtB0r", username: "student@school.edu",
        password: "canvasPass456" },
  { name: "Moodle", url: "https://moodle.org", logo: "https://moodle.org/theme/moodleorg/pix/moodle_logo_TM.svg", username: "student@school.edu",
    password: "canvasPass456" },
    { name: "Gmail", url: "https://accounts.google.com/InteractiveLogin/signinchooser?service=mail&ifkv=ASSHykrxIvecsr0JradH2ex4DPPhDpM5d-7BXJESjYvKsi-a7unfsA0O02UWjvl_MKVXSzzh-kfw4Q&ddm=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin", logo: "https://static.vecteezy.com/system/resources/previews/013/948/544/non_2x/gmail-logo-on-transparent-white-background-free-vector.jpg", username: "student@school.edu",
        password: "canvasPass456" },
    { name: "Office365", url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4765445b-32c6-49b0-83e6-1d93765276ca&redirect_uri=https%3A%2F%2Fwww.office.com%2Flandingv2&response_type=code%20id_token&scope=openid%20profile%20https%3A%2F%2Fwww.office.com%2Fv2%2FOfficeHome.All&response_mode=form_post&nonce=638773576780172307.YTMwMzg1ZGItNGI1My00MGExLTg5NmMtZjM4Zjk0MjI2YmIyYjFmM2M0MzktMzc0Mi00N2YxLWI2MWYtOWM1N2E2ZGU3MGUw&ui_locales=en-GB&mkt=en-GB&client-request-id=c7e99f2b-9de6-4fbb-9acf-42d0449bdd00&state=--FPPBV3swhpjDPLv_VWYy0JwBYKcl0ibANFtlxnJUU_T7PP-ZhlxtGUTi8xpjYBcLbsnRaA4PWtj2w6GHr6Gwdxvolsy17rsp2BbWGMoIncg8HF027EnPUBiXBeqM2QiaLBNvnoC4-Qj9DZe7-ZPr3OLQi0pLKIpm1f8W6u5GJF0TMWgm-xSeCWqAuJkxSqmbFy17ucNLYV9OqRUwdAamBgHfICoAGWb61ZItgZiDfCssG3ia2HoVj7g7m3FUst-ZE3nW8nQr961zmchHQvWC6yV5_eZqhxQG6R31PLY2M&x-client-SKU=ID_NET8_0&x-client-ver=7.5.1.0", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkfNV1YtiGc-HUrSF4OfHIX50fUSmXWPWP2g&s", username: "admin@gmail.com",
      password: "Admin@123" },
      { name: "Payroll", url: "https://www.dsds.co.in/payroll/", logo: "https://www.dsds.co.in/assets/img/logo2.png", username: "admin@gmail.com",
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
          const response = await fetch("http://127.0.0.1:8000/protected", {
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
          alert(data.message);
          setUserData(data);
        }catch(error){
          console.error("Error fetching protected data: ", error);
        }
      };
      fetchProtectedData();
    }, []);

    // useEffect(() => {
    //   const fetchUserData = async () => {
    //     const data = await fetchWithAuth("/protected");
    //     setUserData(data);
    //   }

    //   fetchUserData();
    // }, []);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if(!token){
    //         navigate("/login");
    //     }
    // }, [navigate]);
    // console.log("Rendering Dashboard...");

    

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
