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
            const res = await sendOTP(username);
            // console.log("OTP Response", res);
            if(res.success){
                setOtpSend(true);

                 // Show OTP in alert
                alert(`Test OTP: ${res.otp}`);
                // console.log("OTP Response", otp);
            }
            else{
                setError(res.detail || "Failed to send OTP");
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
        //   console.log('Verify OTP Response:', res);
        //   console.log('Role is :',role);
          if (res.access_token) {
            // Store the token
            localStorage.setItem('token', res.access_token);
            // console.log('Token Stored:', res.access_token);

            // Decode the token to extract role
            const decodedToken = jwtDecode(res.access_token);
            // console.log("Decoded Token:", decodedToken);

            // console.log("Role is : ",role);
            const userRole = decodedToken?.role || "user";
            localStorage.setItem("role", userRole);
            // console.log("User Role Stored:", userRole);

            // Navigate to dashboard
            // console.log("Navigate to Dashboard......");
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

    // const handleLogin = async (e) => {

    //     e.preventDefault();
     
    //     const response = await fetch(`${API_BASE_URL}/token`, {
    //         method : "POST",
    //         headers : {"Content-Type" : "application/json"},
    //         body : JSON.stringify({username, password}),
    //         // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //         // body: new URLSearchParams({ username, password }),
    //     });

    //     const data = await response.json();
    //     if(response.ok){
    //         localStorage.setItem("token", data.access_token);

    //          // Decode JWT to get user role
    //         //  const decodedToken = JSON.parse(atob(data.access_token.split(".")[1]));
    //         const decodedToken = jwtDecode(data.access_token);
    //          localStorage.setItem("role", decodedToken.role);
    //         navigate("/dashboard");
    //     }
    //     else{
    //         alert("Invalid Credentials");
    //     }
    // };

    // Login with password
    const handlePasswordLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        const decoded = jwtDecode(data.access_token);
        localStorage.setItem("role", decoded.role);
        navigate("/dashboard");
      } else {
        setError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <>
        {/* <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)" }}>
             <div className="card p-4 shadow" style={{ width: 400 }}>
                <h2 className="text-center text-primary mb-4">Maxfort Apps</h2>

                {!loginMethod && (
                <>
                    <input className="form-control mb-3" type="email" placeholder="Enter email" value={username} onChange={(e) => setEmail(e.target.value)} />
                    <button className="btn btn-primary w-100 mb-2" onClick={() => setLoginMethod('password')} disabled={!username}>Login with Password</button>
                    <button className="btn btn-outline-primary w-100" onClick={() => setLoginMethod('otp')} disabled={!username}>Login with OTP</button>
                </>
        )}

        {loginMethod === 'password' && (
          <>
            <input className="form-control mb-3" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-success w-100" onClick={handlePasswordLogin}>Login</button>
            <button className="btn btn-link mt-2" onClick={() => setLoginMethod('')}>Back</button>
          </>
        )}

        {loginMethod === 'otp' && !otpSent && (
          <>
            <button className="btn btn-warning w-100" onClick={handleSendOtp}>Send OTP</button>
            <button className="btn btn-link mt-2" onClick={() => setLoginMethod('')}>Back</button>
          </>
        )}

        {loginMethod === 'otp' && otpSent && (
          <>
            <input className="form-control mb-3" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button className="btn btn-success w-100" onClick={handleVerifyOtp}>Verify OTP</button>
            <button className="btn btn-link mt-2" onClick={() => { setOtpSent(false); setOtp(""); }}>Resend</button>
          </>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div> */}
        <div className='d-flex align-items-center justify-content-center vh-100 bg-gradient' style={{background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius:"10px", width:"450px"}}>
            <div className='card shadow-lg p-4' style={{macWidth:"400px", width:"100%", borderRadius:"10px"}}>
                <div className='text-center mb-3'>
                    <h2 className='fw-bold text-primary text-center'>Maxfort Apps</h2>
                   
                   {/* Select Login method */}
                    {!loginMethod && (
                        <>
                            <input type="text" className='form-control mb-3' placeholder='Email' value={username} onChange={(e) => setUsername(e.target.value)} />
                            
                            <button className="btn btn-primary w-100 mb-2" onClick={() => setLoginMethod('password')} disabled={!username}>Login with Password</button>
                            
                            <button className="btn btn-outline-primary w-100" onClick={()=> {handleSendOtp(); setLoginMethod('otp'); }} disabled={!username}>Login with OTP</button>
                        </>
                    )}

                    {/* Login methos is password */}
                    {loginMethod === 'password' && (
                        <>
                            <input type='password' className='form-control mb-3' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            
                            <button className="btn btn-primary w-100" onClick={handlePasswordLogin}>Login</button>
                            
                            <button className="btn btn-link mt-2" onClick={() => setLoginMethod('')}>Back</button>
                        </>
                    )}

                    {/* {loginMethod === 'otp' && !otpSend && (
                        <>
                            <button className="btn btn-warning w-100" onClick={handleSendOtp}>Send OTP</button>
                            <button className="btn btn-link mt-2" onClick={() => setLoginMethod('')}>Back</button>
                        </>
                    )} */}

                    {loginMethod === 'otp' && otpSend && (
                        <>
                             <input className="form-control mb-3" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />

                            <button className='btn btn-primary w-100' onClick={handleVerifyOTP}>Verify OTP</button>

                            <button className="btn btn-link mt-2" onClick={() => { setOtpSend(false); setOtp(""); }}>Resend</button>
                        </>
                    )}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    
                    {/* { !otpSend ? (
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
                            {error && <div className='alert alert-danger mt-3'>{error}</div>} */}
                </div>
            </div>
        </div>
    </>
  )
}

export default Login
