import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//     const token = localStorage.getItem("token");

//     return token ? <Outlet /> : <Navigate to = "/login" />;
// };

const ProtectedRoute = ({allowedRoles}) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // console.log("Token:", token);
    // console.log("UserRole:", userRole);

    if(!token){
        console.warn("No token found! Redirecting to login...");
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(userRole)) {
        console.warn(`User role '${userRole}' not authorized! Redirecting to unauthorized...`);
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
    // return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" />;

}

export default ProtectedRoute;