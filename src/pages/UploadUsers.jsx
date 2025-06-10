import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';
import { uploadUsers } from '../utils/api';
import CustomeNavbar from '../components/CustomeNavbar';

const UploadUsers = () => {
  const [file, setFile] = useState(null);
  const [failedUsers, setFailedUsers] = useState([]);

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
        if (res.failed_users && res.failed_users.length > 0) {
          console.log("Failed Users:", res.failed_users);
          // You can show this on screen instead of just logging
          setFailedUsers(res.failed_users); // Store in state
        }
      } catch (err) {
        console.error(err);
        alert("Upload failed. Check console for details.");
      }
    };

     // code to give sample file to upload
    const handleDownloadSample = () => {
    // Create a sample Excel file URL and need to add this file in my public folder
    const sampleFileUrl = '/Sample_Users_List.xlsx'; 
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
            <h2 className="text-center mb-4 text-primary">Bulk Upload Users</h2>
            <Form.Group>
                <Form.Control type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" className="mb-3 mt-2" onClick={handleUpload}>Upload</Button>
            <div className="mb-3">
                <Button variant="outline-primary" onClick={handleDownloadSample}>
                    Download Sample Template
                </Button>
            </div>
            {failedUsers.length > 0 && (
              <div className="mt-4">
                <h5 className='text-primary'>Failed Users</h5>
                  <Table striped bordered hover responsive>
                    <thead className='gradient-header text-white text-center'>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedUsers.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.mobile_number}</td>
                          <td>{user.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
              </div>
            )}
            </div>
            </div>


            

    </>
  );
};

export default UploadUsers;
