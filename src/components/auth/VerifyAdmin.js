import { Navigate } from "react-router-dom";

const VerifyAdmin = ({ children })=> {
    if(localStorage.getItem("userToken")) {
        return <Navigate to="/home" />;  
    } else if(localStorage.getItem("adminToken")) {
        return children;
    } else {
        return <Navigate to="/" />;
    }  
}

export default VerifyAdmin;