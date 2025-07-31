import React, { useState, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import CustomeNavbar from "../components/CustomeNavbar";
import { Button, Form, Alert, Container, Spinner } from "react-bootstrap";

const BulkAppCredentials = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  // Function to Upload File
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

      const { success_count, error_count, errors } = response.data;

      let message = `Upload completed.\nSuccessfully processed: ${success_count}\nFailed: ${error_count}`;
        setUploadStatus({
          type: error_count > 0 ? "warning" : "success",
          message,
          errors: Array.isArray(errors) ? errors : [],
        });

      // Clear the file input
      setUploadFile(null);
      e.target.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

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
                ref={fileInputRef}
              />
              <Form.Text className="text-muted">
                Upload the filled template to add credentials in bulk
              </Form.Text>
            </Form.Group>
            <Button type="submit" variant="primary" disabled={!uploadFile || uploading} className="me-2" >
              {/* {uploading ? 'Uploading...' : 'Upload Credentials'} */}
              {uploading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload Credentials'
                )}
            </Button>
            <Button variant="outline-primary" onClick={() => window.history.back()}>
              Back to Single Upload
            </Button>
          </Form>
          
          <Button variant="info" onClick={handleDownloadTemplate} className="align-items-center mt-3">
              <i className="bi bi-download me-2"></i>
              Download Template
            </Button>

            {/*Alert to display the file upload status  */}
            {uploadStatus && (
                <Alert
                  variant={uploadStatus.type === "success" ? "success" : "danger"}
                  style={{ margin: 10, backgroundColor: "#FCEBEB", border: "none", color: "#000" }}
                  onClose={() => setUploadStatus(null)}
                  dismissible
                >
                  {uploadStatus.message.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </Alert>
              )}
        </div>
        {/* Show errors in table if present */}
    {/* {uploadStatus.type !== 'success' && uploadStatus.errors && ( */}
    {uploadStatus && uploadStatus.type !== 'success' && Array.isArray(uploadStatus.errors) && uploadStatus.errors.length > 0 && (
      <div className="mt-4">
        <h5>Failed Records</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Row</th>
                <th>User</th>
                <th>Application</th>
                <th>Username</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {uploadStatus.errors.map((err, idx) => (
                <tr key={idx}>
                  <td>{err.row}</td>
                  <td>{err.user_name}</td>
                  <td>{err.application_name}</td>
                  <td>{err.username}</td>
                  <td>{err.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> 
     )}
          
      </Container>
    </>
  );
};

export default BulkAppCredentials;