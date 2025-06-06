import API_BASE_URL from "../config";
import axios from "axios";

// To connect backend
// const API_BASE_URL = "http://127.0.0.1:8000";


// To send otp 
export const sendOTP = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({username, password})
    })
    return await response.json();
}

// To verify otp
export const verifyOTP = async (username, otp) => {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, otp }),
    });
    return await response.json();
  };

// To get protected data
export const fetchProtectedData = async (endpoint, method = "GET", body = null) => {

    const token = localStorage.getItem("token");

    console.log("Token: ", token);

    const headers = {
        "Authorization" : `Bearer ${token}`,
        "Content-type" : "application/json",
    };

    try{
        const response = await fetch(`${API_BASE_URL}${endpoint}`,{
            method, headers,
            body: body ? JSON.stringify(body) : null,
        });
        if (response.status === 401) {
            console.warn("Token expired or invalid. Redirecting to login.");
            localStorage.removeItem("token");
            window.location.href = "/login";  // useNavigate won't work here unless inside a React component
            return;
        }

        if(!response.ok){
            throw new Error(`HTTP Error : ${response.status}`);
        }
                
        return await response.json();

        

    }catch(error){
        console.error("Error fetching protected data : ", error);
        throw error;
    }
}

// To Register new user in database
export const registerUser = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }
  
    return await response.json();
  };

//To get users details from database
  export const fetchUsers = async (page = 1, perPage = 15) => {
    const response = await axios.get(`${API_BASE_URL}/users?page=${page}&per_page=${perPage}`);
    return response.data;
  };
  
//To Edit user
  export const updateUser = async (id, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
      console.error("Error updating user:", error.response?.data || error.message);
      throw error;
    }
  };

//To Delete user from database
  export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  };


// To upload users in bulk via CSV or Excel
export const uploadUsers = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/upload-users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error uploading users:", error.response?.data || error.message);
      throw error;
    }
  };


// To fetch user credentials for application
  export const fetchUserAppCredentials = async (appName) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/app-credentials/${appName}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching app credentials:", error);
        throw error;
    }
};




// Fetch notifications
export const fetchNotifications = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/view_notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch notifications");
  }
};

//  Create notification
export const createNotification = async (message, token) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/add_notifications`,
      { message }, // body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to create notification");
  }
};

//  Delete notification
export const deleteNotification = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/delete_notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete notification");
  }
};