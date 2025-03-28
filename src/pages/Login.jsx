import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
    const[username, setUsername] = useState("");
    // const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const navigate = useNavigate();

    // const handleSubmit = async (e) =>{
    //     e.preventDefault();
    //     // ToDo Call backend for authentication (LDAP/Google secure LDAP)
    //     localStorage.setItem("token", "sample-token");
    //     // console.log("Logging in with : ", email, password);
    //     navigate("/dashboard"); 
    // }

    const handleLogin = async (e) => {

        e.preventDefault();

        // const response = await fetch("http://127.0.0.1:8000/token", {method:"POST", headers:{"Content-type": "application/x-www-form-urlencoded"}, body: new URLSearchParams({"username": username, "password": password})});

        const response = await fetch("http://127.0.0.1:8000/token", {
            method : "POST",
            // headers : {"Content-Type" : "application/json"},
            // body : JSON.stringify({username, password}),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username, password }),
        });

        const data = await response.json();
        if(response.ok){
            localStorage.setItem("token", data.access_token);

             // Decode JWT to get user role
             const decodedToken = JSON.parse(atob(data.access_token.split(".")[1]));
             localStorage.setItem("role", decodedToken.role);

            navigate("/dashboard");
        }
        else{
            alert("Invalid Credentials");
        }
    }

  return (
    <>
        <div className='d-flex align-items-center justify-content-center vh-100' style={{background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius:"10px", width:"450px"}}>
            <div className='card shadow-lg p-4' style={{width:"400px", borderRadius:"10px"}}>
                <div className='text-center mb-3'>
                    <h2 className='fw-bold text-primary'>MyApps School SSO</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className='mb-3'>
                        <label htmlFor="Username" className='form-label fw-bold'>User Name</label>
                        <input type="text" className='form-control' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="Password" className='form-label fw-bold'>Password</label>
                        <input type="password" className='form-control' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type='submit' className='btn btn-primary w-100 fw-bold mt-2'>Login</button>
                </form>
                <p className='text-center mt-3'>
                    <a href="/forget-password" className='text-decoration-none text-primary'>Forgot Password</a>
                </p>
            </div>
        </div>
      {/* <div className='container mt-5'>
        <h2 className='mb-4'>Login</h2> */}
        {/* <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor="Email" className='form-label'>Email</label>
                <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='mb-3'>
                <label htmlFor="Password" className='form-label'>Password</label>
                <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type='submit' className='btn btn-primary'>Login</button>
        </form> */}
      {/* </div> */}
    </>
  )
}

export default Login
