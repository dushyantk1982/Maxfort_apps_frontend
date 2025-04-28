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

  return (
    <>
        <CustomeNavbar />
            <div className="container mt-4" style={{height:"100vh", minWidth:"90vh", width:"100%", marginTop:"20px", color:"black"}}>
                <div className="card shadow p-4">
            <h2 className="text-center mb-4">Bulk Upload Users</h2>
            <Form.Group>
                <Form.Control type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" className="mt-2" onClick={handleUpload}>Upload</Button>
            </div>
            </div>
    </>
  );
};

export default UploadUsers;
