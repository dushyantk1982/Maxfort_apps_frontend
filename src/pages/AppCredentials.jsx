// src/pages/AddAppCredentials.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import CustomeNavbar from "../components/CustomeNavbar";


const AddAppCredentials = () => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [credentials, setCredentials] = useState([]);
//   (Array.from({length:6}, () => ({ app_id: "", username: "", password: "" })));
const inputRefs = useRef([]);

  // Fetch users and applications on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, appsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/all_users`), // You’ll need this endpoint
          axios.get(`${API_BASE_URL}/applications`)
        ]);

        console.log("Users:", usersRes.data);
      console.log("Applications:", appsRes.data);
      
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
      <button type="submit" className="btn btn-success px-5 py-2">
        Submit Credentials
      </button>
    </div>
  </form>
</div>



    </>
  );
};

export default AddAppCredentials;
