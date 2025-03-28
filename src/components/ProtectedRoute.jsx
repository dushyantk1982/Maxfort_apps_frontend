import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//     const token = localStorage.getItem("token");

//     return token ? <Outlet /> : <Navigate to = "/login" />;
// };

const ProtectedRoute = ({allowedRoles}) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if(!token){
        return <Navigate to="/login" />;
    }

    return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" />;

}

export default ProtectedRoute;