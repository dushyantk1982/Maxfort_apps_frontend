// src/pages/AddAppCredentials.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import CustomeNavbar from "../components/CustomeNavbar";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddAppCredentials = () => {
const [userId, setUserId] = useState("");
const [users, setUsers] = useState([]);
const [applications, setApplications] = useState([]);
const [credentials, setCredentials] = useState([]);
const [uploadFile, setUploadFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState(null);
const [uploading, setUploading] = useState(false);
//   (Array.from({length:6}, () => ({ app_id: "", username: "", password: "" })));
const inputRefs = useRef([]);
const navigate = useNavigate();

  // Fetch users and applications on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, appsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/all_users`), // You’ll need this endpoint
          axios.get(`${API_BASE_URL}/applications`)
        ]);

        // console.log("Users:", usersRes.data);
      // console.log("Applications:", appsRes.data);
      
        setUsers(usersRes.data);
        setApplications(appsRes.data);

    
      // Set initial credentials with prefilled app_id
      const initialCreds = appsRes.data.map(app => ({
        app_id: app.id,
        username: "",
        password: ""
      }));
      setCredentials(initialCreds);

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);




  const handleChange = (index, field, value) => {
    const newCredentials = [...credentials];
    newCredentials[index][field] = value;
    setCredentials(newCredentials);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/add-credentials/${userId}`, credentials);
      alert("Credentials added successfully");
    //   setCredentials([{app_id: "", username: "", password: "" }])
      const reset = applications.map(app => ({
        app_id: app.id,
        username: "",
        password: ""
      }));
      setCredentials(reset);

    } catch (error) {
      console.error("Error adding credentials:", error);
      alert("Failed to add credentials");
    }
  };

  // To download Excel file
  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/download-credentials-template`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'credentials_template.xlsx');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Failed to download template");
    }
  };

  // To upload Excel file
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setUploadFile(file);
  //     setUploadStatus(null);
  //   }
  // };

  // const handleBulkUpload = async (e) => {
  //   e.preventDefault();
  //   if (!uploadFile) {
  //     setUploadStatus({
  //       type: 'error',
  //       message: 'Please select a file to upload'
  //     });
  //     return;
  //   }

  //   setUploading(true);
  //   const formData = new FormData();
  //   formData.append('file', uploadFile);

  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/bulk-upload-credentials`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${localStorage.getItem("token")}`
  //         }
  //       }
  //     );

  //     setUploadStatus({
  //       type: 'success',
  //       message: `Upload completed. Successfully processed ${response.data.success_count} credentials. ${
  //         response.data.error_count > 0 
  //           ? `Failed to process ${response.data.error_count} credentials.` 
  //           : ''
  //       }`
  //     });

  //     if (response.data.errors) {
  //       console.error('Upload errors:', response.data.errors);
  //     }

  //     // Clear the file input
  //     setUploadFile(null);
  //     e.target.reset();

  //   } catch (error) {
  //     setUploadStatus({
  //       type: 'error',
  //       message: error.response?.data?.detail || 'Failed to upload file'
  //     });
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
<>
<CustomeNavbar/>
<div className="container mt-5 bg-white p-4 shadow rounded">
  <h2 className="mb-4 text-center text-primary">Add Application Credentials</h2>

  <form onSubmit={handleSubmit} className="bg-white p-4">
    
        <div className="mb-4">
        <label className="form-label text-start d-block fw-bold">Select User</label>
        <select
            className="form-select"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
        >
            <option value="">-- Select User --</option>
            {users.map((user) => (
            <option key={user.id} value={user.id}>
                {user.name} ({user.email})
            </option>
            ))}
        </select>
        </div>


    {/* Column Headings */}
    <div className="row fw-bold text-center mb-2 border-bottom pb-2">
      <div className="col-md-4">Application</div>
      <div className="col-md-4">Username</div>
      <div className="col-md-4">Password</div>
    </div>

    {/* Rows of Application Credentials */}
    {credentials.map((cred, index) => (
      <div key={index} className="row align-items-center mb-3">
        <div className="col-md-4">
          <select className="form-select" value={cred.app_id} disabled>
            <option value={cred.app_id}>
              {applications.find(app => app.id === cred.app_id)?.name}
            </option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={cred.username}
            onChange={(e) => handleChange(index, "username", e.target.value)}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={cred.password}
            onChange={(e) => handleChange(index, "password", e.target.value)}
            required
          />
        </div>
      </div>
    ))}

    <div className="text-center mt-4">
      <button type="submit" className="btn btn-primary px-5 py-2">
        Submit Credentials
      </button>
    </div>
    {/* <Button variant="outline-primary" onClick={handleDownloadTemplate} className="align-items-center mt-3">
            <i className="bi bi-download me-2"></i>
            Download Bulk Upload Template
          </Button> */}
    
{/* To upload excel form */}
    <Button variant="outline-primary" onClick={() => navigate('/bulk-credentials')} className="align-items-center mt-3">
            <i className="bi bi-upload me-2"></i>
            Bulk Upload Credentials
          </Button>
  </form>
</div>
{/* Bulk Upload Section */}
        {/* <div className="mb-4 p-3 border rounded">
          <h4 className="mb-3">Bulk Upload Credentials</h4>
          <Form onSubmit={handleBulkUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Select Excel File</Form.Label>
              <Form.Control
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Form.Text className="text-muted">
                Upload the filled template to add credentials in bulk
              </Form.Text>
            </Form.Group>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={!uploadFile || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Credentials'}
            </Button>
          </Form>
          
          {uploadStatus && (
            <Alert 
              variant={uploadStatus.type === 'success' ? 'success' : 'danger'}
              className="mt-3"
            >
              {uploadStatus.message}
            </Alert>
          )}
        </div> */}



    </>
  );
};

export default AddAppCredentials;
