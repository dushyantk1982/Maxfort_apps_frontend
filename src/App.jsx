import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react'
import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import dsysLogo from './assets/Dsys_Logo.png'
// import viteLogo from '/favicon.png'
import './App.css'
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateApps from "./pages/CreateApps"
import Profile from "./pages/Profile"
import ForgetPassword from "./pages/ForgetPassword";
import CustomeNavbar from "./components/CustomeNavbar"
import ProtectedRoute from "./components/ProtectedRoute";


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
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
              <Route path='/dashboard' element={<Dashboard />}/>
              {/* <Route path='/createApp' element={<CreateApps />}/> */}
              {/* <Route path='/profile' element={< Profile />} /> */}
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/createApp' element={<CreateApps />}/>
              <Route path='/profile' element={< Profile />} />
          </Route>
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path="*" element= {<Navigate to="/login" />} />
        </Routes>
      </Router>

     {/* <div className="container mt-5">
      <h1 className="text-primary">Welcome to MyApps School SSO</h1>
      <p className="lead">Sign in to access your school applications.</p>
      <button className="btn btn-success">Get Started</button>
    </div> */}
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
