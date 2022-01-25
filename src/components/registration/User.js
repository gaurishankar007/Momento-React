import { useState } from "react";
import axios from "axios";
import LoggedOutHeader from "../LoggedOutHeader";
import "../../css/User.css";
import Logo from "../../images/logo.png";

const User = ()=> {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [response, setResponse] = useState("");

    const userRegister = (e)=> {
        e.preventDefault();
        const userData = {username, password, email, phone};
        axios.post("http://localhost:4040/user/register", userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img src={Logo} alt="Memento"/>                
                <div className="register-user-form p-4">
                    <h2 className="text-center">Welcome to Momento</h2>
                    <form>
                        <div className="text-center mb-2">{response}</div>
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="username"  placeholder="Enter a username....." onChange={(e)=>setUsername(e.target.value)}/>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="password"  placeholder="Enter a password....." onChange={(e)=>setPassword(e.target.value)}/>
                        </div>         
                        <div className="form-group mb-3">
                            <input type="email" className="form-control" id="email" placeholder="Enter your email address....." onChange={(e)=>setEmail(e.target.value)}/>
                            <small id="emailHelp" className="form-text ms-1">Useful for resetting password.</small>
                        </div>                              
                        <div className="form-group mb-3">
                            <input type="number" className="form-control" id="address"  placeholder="Enter your phone number....." onChange={(e)=>setPhone(e.target.value)}/>
                        </div>
                        <div className="d-flex justify-content-center">                             
                            <button type="button" className="btn lR-button" onClick={userRegister}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default User;