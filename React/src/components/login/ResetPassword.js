import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoggedOutHeader from "../Header/LoggedOutHeader";
import Logo from "../../images/logo.png";
import "../../css/ResetPassword.css";

const ResetPassword = ()=> {
    const [resetLink, setResetLink] = useState("");
    const [response, setResponse] = useState("");

    const navigate = useNavigate();

    const resetPass = (e)=> {
        e.preventDefault();
        setResponse("");
        
        const whitespace = /\s/;
        if (resetLink.trim()==="") {
            setResponse("Empty field found. Provide the token here.");          
            return;   
        } else if(whitespace.test(resetLink)) {
            setResponse("Whitespace are not allowed around the token.");          
            return;               
        }
        
        const { REACT_APP_BASE_URL } = process.env;        
        const apiResponse = axios.put(`${REACT_APP_BASE_URL}user/passReset/${resetLink}`)
        apiResponse.then((result)=> {
            if (result.data.message==="Invalid Token!") {
                setResponse(result.data.message);          
                return;   
            }    
            if (result.data.message==="Your password has been reset.") { 
                localStorage.setItem("pRSM", "unseen");
                navigate("/", {state: {pRSM: result.data.message + " Now try to login again."}})
            }
        });
        
        // Checking error if the specified link is nor correct
        apiResponse.catch(error => {
            if(error.response) {
                if(error.response.status===404) {                    
                    setResponse("Incorrect link. Link does not match.");                      
                }
            }

            /* Checking other things in errors
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            */
        });
    }

    return(
        <div>          
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center">Reset Password</h3>
                    <form>
                        <div className="text-center note-message mb-3">A token is sent to your account's email. Copy the token and paste here. You have 3 minutes left otherwise the token will expire and you have to generate it again.</div>      
                        <div className="suggestion-message text-center mb-3">{response}</div>     
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="text" placeholder="Enter the link....." onChange={(e)=>setResetLink(e.target.value)}/>
                            <small id="helper" className="form-text ms-1">Only correct token will reset your password.</small>
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