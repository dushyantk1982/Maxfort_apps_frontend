import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOTP, verifyOTP, checkEmailExists  } from '../utils/api';
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
    const isValidEmail = (email) => /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);

    const handleSendOtp = async () =>{
    
      if (!isValidEmail(username)) {
        setError("Invalid email format");
        return;
      }
        setError("");
        try{
            const res = await sendOTP(username);
            if(res.success){
                setOtpSend(true);

                 // Show OTP in alert
                alert(`Test OTP: ${res.otp}`);
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
        if (!isValidEmail(username)) {
          setError("Invalid email format");
          return;
        }
        try {
          const res = await verifyOTP(username, otp);
          if (res.access_token) {
            // Store the token
            localStorage.setItem('token', res.access_token);
          
            // Decode the token to extract role
            const decodedToken = jwtDecode(res.access_token);
          
            const userRole = decodedToken?.role || "user";
            localStorage.setItem("role", userRole);
            // Navigate to dashboard
            navigate('/dashboard');
          } 
          else {
            setError(res.detail || 'Invalid/Expired OTP');
          }
        } catch (err) {
          setError('Something went wrong');
        }
      };
    

    // Login with password
    const handlePasswordLogin = async (e) => {
      e.preventDefault();

       // Simple frontend validation
      if (!isValidEmail(username)) {
        setError("Invalid email format");
        return;
      }

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


  // To check JWT token securely and check it automatically on application load
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      if (Date.now() < exp) {
        navigate("/dashboard");
      } else {
        // localStorage.removeItem("token"); // expired

        localStorage.setItem('refresh_token', res.refresh_token);
        const decodedToken = jwtDecode(res.access_token);
        const userRole = decodedToken?.role || "user";
        localStorage.setItem("role", userRole);
        navigate('/dashboard');

      }
    } catch (e) {
      localStorage.removeItem("token");
    }
  }
}, []);

  return (
    <>
        <div className='d-flex align-items-center justify-content-center vh-100 bg-gradient' style={{background: "linear-gradient(to right, #6a11cb, #2575fc)", borderRadius:"10px", width:"450px"}}>
            <div className='card shadow-lg p-4' style={{macWidth:"400px", width:"100%", borderRadius:"10px"}}>
                <div className='text-center mb-3'>
                    <h2 className='fw-bold text-primary text-center'>Maxfort Apps</h2>
                   
                   {/* Select Login method */}
                    {!loginMethod && (
                        <>
                            <input type="text"
                                className={`form-control mb-3 ${username && !isValidEmail(username) ? 'is-invalid' : ''}`}
                                placeholder="Email" tabIndex={1}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={() => {
                                    if (username && !isValidEmail(username)) {
                                        setError("Invalid email format");
                                    } else {
                                        setError("");
                                    }
                                }}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (!isValidEmail(username)) {
                                            setError("Invalid email format");
                                        } else {
                                          try{
                                            await checkEmailExists(username);  // Check if email exists
                                            setError("");
                                            setLoginMethod('password');       // Proceed to password login
                                           } catch (err) {
                                              setError(err.message);            // Show "Email not found"
                                           }
                                        }
                                    }
                                }}
                              />

                            <button
                              className="btn btn-primary w-100 mb-2"
                              onClick={async () => {
                                  try {
                                    await checkEmailExists(username);
                                    setError("");
                                    setLoginMethod('password');
                                  } catch (err) {
                                    setError(err.message);
                                  }
                                }}
                              disabled={!username}
                            >
                              Login with Password
                            </button>

                            <button
                              className="btn btn-outline-primary w-100"
                              onClick={async () => {
                                try {
                                  await checkEmailExists(username);
                                  handleSendOtp();
                                  setLoginMethod('otp');
                                } catch (err) {
                                  setError(err.message);
                                }
                              }}
                              disabled={!username}
                            >
                              Login with OTP
                            </button>
                        </>
                    )}

                    {/* Login methos is password */}
                    {loginMethod === 'password' && (
                        <>
                           <form onSubmit={handlePasswordLogin}>
                            <input type='password' className='form-control mb-3' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='true' />
                            <button className="btn btn-primary w-100">Login</button>
                            <button className="btn btn-link mt-2" onClick={() => setLoginMethod('')}>Back</button>
                            </form>
                        </>
                    )}

                   
                    {loginMethod === 'otp' && otpSend && (
                        <>
                          <form onSubmit={(e) => {e.preventDefault(); handleVerifyOTP(); }}>
                            <input className="form-control mb-3" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            
                            <button className='btn btn-primary w-100' type='submit'>Verify OTP</button>

                            <button className="btn btn-link mt-2" onClick={() => { setOtpSend(false); setOtp(""); }}>Resend</button>
                            <button className="btn btn-link mt-2" onClick={() => setLoginMethod('')}>Back</button>
                          </form>
                        </>
                    )}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default Login
