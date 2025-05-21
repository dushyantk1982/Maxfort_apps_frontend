import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { uploadUsers } from '../utils/api';
import CustomeNavbar from '../components/CustomeNavbar';

const UploadUsers = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
        const res = await uploadUsers(file);
        alert(res.message);
      } catch (err) {
        alert("Upload failed. Check console for details.");
      }
    };

    // code to give sample file to upload
    const handleDownloadSample = () => {
    // Create a sample Excel file URL
    const sampleFileUrl = '/Sample_Users_List.xlsx'; // You'll need to add this file to your public folder
    const link = document.createElement('a');
    link.href = sampleFileUrl;
    link.download = 'Sample_Users_List.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
        <CustomeNavbar />
            <div className="container mt-4" style={{height:"100vh", minWidth:"90vh", width:"100%", marginTop:"20px", color:"black"}}>
                <div className="card shadow p-4">
            <h2 className="text-center mb-4">Bulk Upload Users</h2>
            <Form.Group>
                <Form.Control type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" className="mb-3 mt-2" onClick={handleUpload}>Upload</Button>
            <div className="mb-3">
                <Button variant="outline-primary" onClick={handleDownloadSample}>
                    Download Sample Template
                </Button>
            </div>
            </div>
             
            </div>
    </>
  );
};

export default UploadUsers;
