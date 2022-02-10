import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VerifyUser = ({ children })=> {
    const [user, setUser] = useState(true);

    useEffect(()=> {
        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            if(result.data.userData) {
                if (result.data.userData.admin===false && result.data.userData.superuser===false) { 
                    setUser(true);            
                }
                else if (result.data.userData.admin===true){ 
                    setUser(false);
                }
            }
        }); 
    }, [])

    if(localStorage.getItem("userToken")) {
        if (user) { 
            return children;            
        } else { 
            return <Navigate to="/home-admin" />;
        }
    } else {
        return <Navigate to="/" />;
    }  
}

export default VerifyUser;