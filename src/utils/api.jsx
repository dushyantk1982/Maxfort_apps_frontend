const API_BASE_URL = "http://127.0.0.1:8000";

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

        if(!response.ok){
            throw new Error(`HTTP Error : ${response.status}`);
        }

        return await response.json();

    }catch(error){
        console.error("Error fetching protected data : ", error);
        throw error;
    }
}