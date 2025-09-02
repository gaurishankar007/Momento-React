import { useState } from "react";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";
import SettingNav from "../Header/SettingNav";

const PasswordSetting =()=> {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
    
    const changePassword = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{5,15}$');

        if (currentPassword.trim()==="" || newPassword.trim()==="" || confirmPassword.trim()==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;  
        } else if (!passwordRegex.test(newPassword)) {
            setResponse("Provide at least one uppercase, lowercase, number, special character in password and it accepts only 5 to 15 characters.");          
            return;             
        } else if (newPassword!==confirmPassword) {
            setResponse("Confirm password did not match.");          
            return;             
        } 

        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        const passData = {
            currPassword: currentPassword,
            newPassword: newPassword
        }
        const apiResponse = axios.put(`${REACT_APP_BASE_URL}user/changePassword`, passData, config)
        apiResponse.then((result)=> {
            if (result.data.message==="Your password has been changed.") {
                setSResponse(result.data.message);    
                return;   
            }
            setResponse(result.data.message);                      
        });      
    }

    const curPV = ()=> {
        const input_tag = document.getElementById("current-password");
        const button_tag = document.getElementById("visibility-button-1");

        if(input_tag.type==="password") {
            input_tag.type="text";
            button_tag.className="bi bi-eye-fill";
        } else {
            input_tag.type="password";
            button_tag.className="bi bi-eye-slash-fill";
        }
    }

    const newPV = ()=> {
        const input_tag = document.getElementById("new-password");
        const button_tag = document.getElementById("visibility-button-2");

        if(input_tag.type==="password") {
            input_tag.type="text";
            button_tag.className="bi bi-eye-fill";
        } else {
            input_tag.type="password";
            button_tag.className="bi bi-eye-slash-fill";
        }
    }

    const conPV = ()=> {
        const input_tag = document.getElementById("confirm-password");
        const button_tag = document.getElementById("visibility-button-3");

        if(input_tag.type==="password") {
            input_tag.type="text";
            button_tag.className="bi bi-eye-fill";
        } else {
            input_tag.type="password";
            button_tag.className="bi bi-eye-slash-fill";
        }
    }

    return(
        <div>            
            <LoggedInHeader></LoggedInHeader> 
            <div className="d-flex justify-content-center">                         
                <div className="setting py-3 mt-2">
                    <SettingNav/>  
                    <form className="setting-form d-flex flex-column justify-content-center">
                        <div className="mb-2">
                            <div className="suggestion-message text-center">{response}</div>           
                            <div className="success-message text-center">{sResponse}</div>  
                        </div>   
                        <div className="form-group mb-3">
                            <label htmlFor="current-password">Current Password:</label>
                            <div className="d-flex justify-content-center">                                
                                <input type="password" className="form-control" id="current-password" placeholder="Enter the current password....." onChange={(e)=>setCurrentPassword(e.target.value)}/>                           
                                <button type="button" className="btn e-button ms-3" onClick={curPV}><i className="bi bi-eye-slash-fill" id="visibility-button-1"></i></button>
                            </div>
                        </div>    
                        <div className="form-group mb-3">
                            <label htmlFor="new-password">New Password:</label>
                            <div className="d-flex justify-content-center">                                
                                <input type="password" className="form-control" id="new-password" placeholder="Enter a new password....." onChange={(e)=>setNewPassword(e.target.value)}/>                           
                                <button type="button" className="btn e-button ms-3" onClick={newPV}><i className="bi bi-eye-slash-fill" id="visibility-button-2"></i></button>
                            </div>
                        </div>    
                        <div className="form-group mb-3">
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <div className="d-flex justify-content-center">                                
                                <input type="password" className="form-control" id="confirm-password" placeholder="Enter the new password again....." onChange={(e)=>setConfirmPassword(e.target.value)}/>                           
                                <button type="button" className="btn e-button ms-3" onClick={conPV}><i className="bi bi-eye-slash-fill" id="visibility-button-3"></i></button>
                            </div>
                        </div>  
                        <div className="d-flex justify-content-center align-items-center">                               
                            <button type="button" className="btn lR-button" onClick={changePassword}>Change Password</button>
                        </div>
                    </form>
                </div>            
            </div>
        </div>
    )
}

export default PasswordSetting;