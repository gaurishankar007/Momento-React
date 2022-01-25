import { useState } from "react"
import axios from "axios";
import LoggedOutHeader from "../LoggedOutHeader";
import "../../css/ResetPassword.css";
import Logo from "../../images/logo.png";

const ResetPassword = ()=> {
    const [resetLink, setResetLink] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    const resetPass = (e)=> {
        e.preventDefault();
        setResponse("");

        const whitespace = /\s/;
        if (resetLink.trim()==="") {
            setResponse("Empty field found. Provide the link here");          
            return;   
        } else if(whitespace.test(resetLink)) {
            setResponse("White space not allowed.");          
            return;               
        }
        
        const { REACT_APP_BASE_URL } = process.env;
        axios.put(`${REACT_APP_BASE_URL}user/passReset/${resetLink}`).then((result)=> {
            console.log(result);
            setSResponse(result.data.message);
        });
    }

    return(
        <div>          
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center">Reset Password</h3>
                    <form>
                        <div className="text-center mb-3">The password reset link is sent to your account's email. Copy the link and paste here. You have 3 minutes left otherwise the link will expire.</div>      
                        <div className="suggestion-message text-center mb-3">{response}</div>           
                        <div className="success-message text-center mb-3">{sResponse}</div>        
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="text" placeholder="Enter the link....." onChange={(e)=>setResetLink(e.target.value)}/>
                            <small id="helper" className="form-text ms-1">Only correct link will reset your password.</small>
                        </div> 
                        <div className="d-flex justify-content-center">                             
                            <button type="button" className="btn lR-button" onClick={resetPass}>Reset</button>
                        </div>
                    </form>
                </div>
            </div> 
        </div>
    )
}

export default ResetPassword;