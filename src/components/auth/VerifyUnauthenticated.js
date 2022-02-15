import { Navigate } from "react-router-dom";

const VerifyUnauthenticated = ({ children })=> {
    if(localStorage.getItem("userToken")) {
        return <Navigate to="/home" />;
    } else if(localStorage.getItem("adminToken")) {
        return <Navigate to="/admin-home"/>;
    } else {
        return children;
    } 
}

export default VerifyUnauthenticated;