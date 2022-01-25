import { useState } from "react"
import axios from "axios";
import LoggedOutHeader from "../LoggedOutHeader";
import Logo from "../../images/logo.png";

const ForgotPassword = ()=> {  
    const [email, setEmail] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [response, setResponse] = useState("");

    const generateLink = (e)=> {
        e.preventDefault();
        setResponse("");

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{5,15}$');

        if (email.trim()==="" || newPass.trim()==="" || confirmPassword.trim()==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;   
        } else if (!emailRegex.test(email)) {
            setResponse("Invalid email address.");          
            return;                   
        } else if (!passwordRegex.test(newPass)) {
            setResponse("Provide at least one uppercase, lowercase, number, special character in password and it accepts only 5 to 15 characters.");          
            return;       
        } else if (newPass!==confirmPassword) {
            setResponse("Confirm password did not match.");          
            return;              
        }

        const userData = {email, newPass};
        const { REACT_APP_BASE_URL } = process.env;
        axios.post(`${REACT_APP_BASE_URL}user/passResetLink`, userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>            
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center">Generate Reset Link</h3>
                    <form>
                        <div className="suggestion-message text-center mb-2">{response}</div>       
                        <div className="form-group mb-3">
                            <input type="email" className="form-control" id="email" placeholder="Enter your email address....." onChange={(e)=>setEmail(e.target.value)}/>
                        </div>    
                        <div className="form-group mb-3">
                            <input type="password" className="form-control" id="newPassword"  placeholder="Enter a new password....." onChange={(e)=>setNewPass(e.target.value)}/>
                            <small id="helper" className="form-text ms-1">Excludes whitespace around the password.</small>
                        </div>    
                        <div className="form-group mb-3">
                            <input type="password" className="form-control" id="confirmPassword"  placeholder="Enter the password again....." onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        </div>   
                        <div className="d-flex justify-content-center">                             
                            <button type="button" className="btn lR-button" onClick={generateLink}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>            
        </div>
    )
}

export default ForgotPassword;