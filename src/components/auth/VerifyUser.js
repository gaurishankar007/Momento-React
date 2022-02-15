import { Navigate } from "react-router-dom";

const VerifyUser = ({ children })=> {
    if(localStorage.getItem("userToken")) {
        return children;
    } else if(localStorage.getItem("adminToken")) {
        return <Navigate to="/admin-home" />;
    } else {
        return <Navigate to="/" />;
    }  
}

export default VerifyUser;