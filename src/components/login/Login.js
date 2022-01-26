import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoggedOutHeader from "../LoggedOutHeader";
import "../../css/Login.css";
import Logo from "../../images/logo.png";

const Login = ()=> {    
    const [username_email, setUsernameEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");

    const userLogin = (e)=> {
        e.preventDefault();
        setResponse("");

        if(username_email.trim()==="") {
            setResponse("Username or email is required.");
            return;            
        } else if (password.trim()==="") {
            setResponse("Password is required.");
            return;                        
        }

        const userData = {username_email, password};
        const { REACT_APP_BASE_URL } = process.env;
        axios.post(`${REACT_APP_BASE_URL}user/login`, userData).then((result)=> {
            if(result.data.token) {
                localStorage.setItem('token', result.data.token);
            }
            else {
                setResponse(result.data.message);
            }
        });
    }

    return(
        <div>              
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>  
                <form className="register-user-form px-4 py-3">
                    <div className="suggestion-message text-center mb-3">{response}</div>
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" id="username"  placeholder="Enter your username or email....." onChange={(e)=>setUsernameEmail(e.target.value)}/>
                    </div>  
                    <div className="form-group mb-3">
                        <input type="password" className="form-control mb-1" id="password"  placeholder="Enter your password....." onChange={(e)=>setPassword(e.target.value)}/>
                        <small id="passwordHelp" className="form-text ms-1"><Link to="/forgot-password">Forgot Password?</Link></small>
                    </div>  
                    <div className="d-flex justify-content-center mb-3">
                        <button type="button" className="btn lR-button" onClick={userLogin}>Login</button>
                    </div>                    
                    <div className="d-flex justify-content-center">
                        <Link className="btn lR-button" to="/user-registration">Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;