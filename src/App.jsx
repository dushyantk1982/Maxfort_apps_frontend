import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react'
import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import dsysLogo from './assets/Dsys_Logo.png'
import './App.css'
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateApps from "./pages/CreateApps"
import Profile from "./pages/Profile"
import ForgetPassword from "./pages/ForgetPassword";
import CustomeNavbar from "./components/CustomeNavbar"
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterUser from "./pages/RegisterUser";
import LoginPage from "./pages/LoginPage";
import UserList from "./pages/UserList";
import UploadUsers from "./pages/UploadUsers";
import AddAppCredentials from "./pages/AppCredentials";
// import ViewAppCredentials from "./pages/ViewAppCredentials";
import BulkAppCredentials from "./pages/BulkAppCredentials";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        {/* <CustomeNavbar /> */}
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/login' element={<Login />}/>
          <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
          <Route element={<ProtectedRoute allowedRoles={["user", "admin", "student", "teacher"]} />}>
              <Route path='/dashboard' element={<Dashboard />}/>
              {/* <Route path='/createApp' element={<CreateApps />}/> */}
              <Route path='/profile' element={< Profile />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              {/* <Route path='/dashboard' element={<Dashboard />}/> */}
              <Route path='/register' element={<RegisterUser />}/>
              <Route path='/users' element={<UserList />}/>
              <Route path='/profile' element={< Profile />} />
              <Route path='/upload-users' element={< UploadUsers />} />
              <Route path='/add-credentials' element={< AddAppCredentials />} />
              <Route path='/bulk-credentials' element={<BulkAppCredentials />} />
          </Route>
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path="*" element= {<Navigate to="/login" />} />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={2000} />

     
    </>
  )
}

export default App
