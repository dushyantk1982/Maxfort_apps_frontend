import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import CustomeNavbar from "../components/CustomeNavbar";
import { Button, Form, Alert, Container } from "react-bootstrap";

const BulkAppCredentials = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      setUploadStatus({
        type: 'error',
        message: "Failed to download template"
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadStatus(null);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file to upload'
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/bulk-upload-credentials`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

        let message = `Upload completed. Successfully processed ${response.data.success_count} credentials.`;
      
        if (response.data.error_count > 0) {
            message += `\nFailed to process ${response.data.error_count} credentials.`;
            if (response.data.errors) {
                message += '\n\nErrors:\n' + response.data.errors.join('\n');
            }
        }

    //   setUploadStatus({
    //     type: 'success',
    //     message: `Upload completed. Successfully processed ${response.data.success_count} credentials. ${
    //       response.data.error_count > 0 
    //         ? `Failed to process ${response.data.error_count} credentials.` 
    //         : ''
    //     }`
    //   });

        setUploadStatus({
            type: response.data.error_count > 0 ? 'warning' : 'success',
            message: message
        });

    //   if (response.data.errors) {
    //     console.error('Upload errors:', response.data.errors);
    //   }

      // Clear the file input
      setUploadFile(null);
      e.target.reset();

    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to upload file'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <CustomeNavbar />
      <Container className="mt-5">
        <div className="bg-white p-4 shadow rounded">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Bulk Upload Application Credentials</h2>
            {/* <Button 
              variant="success" 
              onClick={handleDownloadTemplate}
              className="d-flex align-items-center"
            >
              <i className="bi bi-download me-2"></i>
              Download Template
            </Button> */}
          </div>

          <div className="mb-4">
            <h4>Instructions:</h4>
            <ol>
              <li>Click "Download Template" to get the Excel template</li>
              <li>Fill in the username and password for each user-application combination</li>
              <li>Save the file and upload it using the form below</li>
              <li>Do not modify the user_id and application_id columns</li>
            </ol>
          </div>

          <Form onSubmit={handleBulkUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Select Filled Excel File</Form.Label>
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
            <Button type="submit" variant="primary" disabled={!uploadFile || uploading} className="me-2" >
              {uploading ? 'Uploading...' : 'Upload Credentials'}
            </Button>
            <Button variant="outline-primary" onClick={() => window.history.back()}>
              Back to Single Upload
            </Button>
          </Form>
          <Button variant="info" onClick={handleDownloadTemplate} className="align-items-center mt-3">
              <i className="bi bi-download me-2"></i>
              Download Template
            </Button>
          {/* {uploadStatus && (
            <Alert 
              variant={uploadStatus.type === 'success' ? 'success' : 'danger'}
              className="mt-3"
            >
              {uploadStatus.message}
            </Alert>
          )} */}

           {uploadStatus && (
            <Alert 
              variant={uploadStatus.type === 'success' ? 'success' : 
                      uploadStatus.type === 'warning' ? 'warning' : 'danger'}
              className="mt-3"
            >
              {uploadStatus.message.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Alert>
          )}
          
        </div>
      </Container>
    </>
  );
};

export default BulkAppCredentials;