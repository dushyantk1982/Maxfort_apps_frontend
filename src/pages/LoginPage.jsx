import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOTP, verifyOTP } from '../utils/api';
import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import {jwtDecode} from "jwt-decode";
import API_BASE_URL from '../config';

const Login = () => {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[otp, setOtp] = useState("");
    const[loginMethod, setLoginMethod] = useState('');
    const[otpSend, setOtpSend] = useState(false);
    const[error, setError] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async () =>{
        setError("");
        try{
            const res = await sendOTP(username, password);
            console.log("OTP Response", res);
            if(res.success){
                setOtpSend(true);

                 // Show OTP in alert
                alert(`Test OTP: ${res.otp}`);
                console.log("OTP Response", otp);
            }
            else{
                setError(res.detail || "Invalid Credentials");
            }
        }
        catch (err){
            setError("Something went wrong",{err});
            console.log({err});
        }
    };

    const handleVerifyOTP = async () => {
        setError('');
        try {
          const res = await verifyOTP(username, otp);
          console.log('Verify OTP Response:', res);
        //   console.log('Role is :',role);
          if (res.access_token) {
            // Store the token
            localStorage.setItem('token', res.access_token);
            console.log('Token Stored:', res.access_token);

            // Decode the token to extract role
            const decodedToken = jwtDecode(res.access_token);
            console.log("Decoded Token:", decodedToken);

            // console.log("Role is : ",role);
            const userRole = decodedToken?.role || "user";
            localStorage.setItem("role", userRole);
            console.log("User Role Stored:", userRole);

            // Navigate to dashboard
            console.log("Navigate to Dashboard......");
            navigate('/dashboard');
          } else {
            setError(res.detail || 'Invalid/Expired OTP');
          }
        } catch (err) {
          setError('Something went wrong');
        }
      };
    // const handleSubmit = async (e) =>{
    //     e.preventDefault();
    //     // ToDo Call backend for authentication (LDAP/Google secure LDAP)
    //     localStorage.setItem("token", "sample-token");
    //     // console.log("Logging in with : ", email, password);
    //     navigate("/dashboard"); 
    // }

    const handleLogin = async (e) => {

        e.preventDefault();
     
        const response = await fetch(`${API_BASE_URL}/token`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({username, password}),
            // headers: { "Content-Type": "application/x-www-form-urlencoded" },
            // body: new URLSearchParams({ username, password }),
        });

        const data = await response.json();
        if(response.ok){
            localStorage.setItem("token", data.access_token);

             // Decode JWT to get user role
            //  const decodedToken = JSON.parse(atob(data.access_token.split(".")[1]));
            const decodedToken = jwtDecode(data.access_token);
             localStorage.setItem("role", decodedToken.role);
            navigate("/dashboard");
        }
        else{
            alert("Invalid Credentials");
        }
    };

  return (
    <>
        <div className='d-flex align-items-center justify-content-center vh-100 bg-gradient' style={{background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius:"10px", width:"450px"}}>
            <div className='card shadow-lg p-4' style={{macWidth:"400px", width:"100%", borderRadius:"10px"}}>
                <div className='text-center mb-3'>
                    <h2 className='fw-bold text-primary text-center'>Maxfort Apps</h2>
                    { !otpSend ? (
                        <>
                            <div className='mb3'>
                                <input type="text" className='form-control' placeholder='Email' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='password' className='form-control' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>        
                            <button className='btn btn-primary w-100' onClick={handleSendOtp}>Send OTP</button>
                        </>
                        ):(
                            <>
                                <div className='mb-3'>
                                    <input type="text" className='form-control' placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)}/>
                                </div>
                                <button className='btn btn-success w-100' onClick={handleVerifyOTP}>Verify OTP</button>
                            </>
                            )}
                            {error && <div className='alert alert-danger mt-3'>{error}</div>}
                </div>
            </div>
        </div>
    </>
  )
}

export default Login
