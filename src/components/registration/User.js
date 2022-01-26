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
        setResponse("");

        const usernameRegex = new RegExp('^[a-zA-Z0-9]+$');
        const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{5,15}$');
        const emailRegex = new RegExp("^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
        const phoneRegex = new RegExp('^(?:[+0]9)?[0-9]{10}$');

        /* 
        <----- Difference between '==' and '===' ----->
        Well in short: == inherently converts type and === does not convert type. Double Equals (==) checks for value equality only.
        It inherently does type coercion. This means that before checking the values, it converts the types of the variables to match each other.

        On the other hand, Triple Equals (===) does not perform type coercion. 
        It will verify whether the variables being compared have both the same value AND the same type.
        */

        if (username.trim()==="" || password.trim()==="" || email.trim()==="" || phone==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;             
        } else if (username.length<=2 || username.length>=16) {
            setResponse("Username most contain 3 to 15 characters.");          
            return;                 
        } else if (!usernameRegex.test(username)) {
            setResponse("Special characters and white spaces not allowed in username.");          
            return;                
        } else if (!passwordRegex.test(password)) {
            setResponse("Provide at least one uppercase, lowercase, number, special character in password and it accepts only 5 to 15 characters.");          
            return;             
        } else if (!emailRegex.test(email)) {
            setResponse("Invalid email address.");          
            return;        
        } else if (!phoneRegex.test(phone)) {
            setResponse("Invalid phone number.");          
            return;              
        }

        const userData = {username, password, email, phone};
        const { REACT_APP_BASE_URL } = process.env;
        axios.post(`${REACT_APP_BASE_URL}user/register`, userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center">Welcome to Momento</h3>
                    <form>
                        <div className="suggestion-message text-center mb-2">{response}</div>
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="username"  placeholder="Enter a username....." onChange={(e)=>setUsername(e.target.value)}/>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="password" className="form-control" id="password"  placeholder="Enter a password....." onChange={(e)=>setPassword(e.target.value)}/>
                            <small id="helper" className="form-text ms-1">Excludes whitespace around the password.</small>
                        </div>         
                        <div className="form-group mb-3">
                            <input type="email" className="form-control" id="email" placeholder="Enter your email address....." onChange={(e)=>setEmail(e.target.value)}/>
                            <small id="helper" className="form-text ms-1">Useful for resetting password.</small>
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