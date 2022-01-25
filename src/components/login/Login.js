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
        const userData = {username_email, password};
        axios.post("http://localhost:4040/user/login", userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>              
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img src={Logo} alt="Memento"/>  
                <form className="register-user-form p-4">
                    <div className="text-center mb-3">{response}</div>
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" id="username"  placeholder="Enter your username....." onChange={(e)=>setUsernameEmail(e.target.value)}/>
                    </div>  
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" id="password"  placeholder="Enter your password....." onChange={(e)=>setPassword(e.target.value)}/>
                        <small id="passwordHelp" className="form-text ms-1"><Link to="/forgot-password">Forgot Password?</Link></small>
                    </div>  
                    <div className="d-flex justify-content-center">
                        <button type="btn" className="btn lR-button" onClick={userLogin}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;