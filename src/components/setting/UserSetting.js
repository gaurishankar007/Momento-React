import { useEffect, useState } from "react";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";
import SettingNav from "../Header/SettingNav";
import "../../css/UserSetting.css";

const UserSetting =()=> {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");    
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
    
    const { REACT_APP_BASE_URL } = process.env;
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    }

    useEffect(()=> {         
        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            setUsername(result.data.userData.username)
            setEmail(result.data.userData.email)
            setPhone(result.data.userData.phone)
        });   
    }, []);
    
    const editUsername = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        const usernameRegex = new RegExp('^[a-zA-Z0-9]+$');

        if (username.trim()==="") {
            setResponse("Enter the new username first.");          
            return;             
        } else if (username.length<=2 || username.length>=16) {
            setResponse("Username most contain 3 to 15 characters.");          
            return;                 
        } else if (!usernameRegex.test(username)) {
            setResponse("Special characters and white spaces not allowed in username.");          
            return;                
        } 

        const apiResponse = axios.put(`${REACT_APP_BASE_URL}user/changeUsername`, {username}, config)
        apiResponse.then((result)=> {
            if (result.data.message==="Your username has been changed.") {
                setSResponse(result.data.message);    
                return;   
            }
            setResponse(result.data.message);                      
        });      
    }

    const editEmail = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        const emailRegex = new RegExp("^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");

        if (email.trim()==="") {
            setResponse("Enter the new email first.");          
            return;             
        } else if (!emailRegex.test(email)) {
            setResponse("Invalid email address.");          
            return;        
        } 

        const apiResponse = axios.put(`${REACT_APP_BASE_URL}user/changeEmail`, {email}, config)
        apiResponse.then((result)=> {
            if (result.data.message==="Your email address has been changed.") {
                setSResponse(result.data.message);  
                return;   
            }
            setResponse(result.data.message);                      
        });
    }

    const editPhone = (event)=> {
        event.preventDefault();
        setResponse("");setSResponse("");

        const phoneRegex = new RegExp('^(?:[+0]9)?[0-9]{10}$');

        if (phone==="") {
            setResponse("Enter the new phone number first.");          
            return;             
        } else if (!phoneRegex.test(phone)) {
            setResponse("Invalid phone number.");          
            return;              
        }

        const apiResponse = axios.put(`${REACT_APP_BASE_URL}user/changePhone`, {phone}, config)
        apiResponse.then((result)=> {
            if (result.data.message==="Your phone number has been changed.") {
                setSResponse(result.data.message); 
                return;   
            }
            setResponse(result.data.message);                      
        });      
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
                            <label htmlFor="username">Username:</label>
                            <div className="d-flex justify-content-center">                                
                                <input type="text" className="form-control" id="username" value={username} placeholder="Enter a new username....." onChange={(e)=>setUsername(e.target.value)}/>                           
                                <button type="button" className="btn e-button ms-3" onClick={editUsername}><i className="bi bi-pen-fill"></i></button>
                            </div>
                        </div>    
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email:</label>
                            <div className="d-flex justify-content-center">                                
                                <input type="email" className="form-control" id="email" value={email} placeholder="Enter a new email....." onChange={(e)=>setEmail(e.target.value)}/>                           
                                <button type="button" className="btn e-button ms-3" onClick={editEmail}><i className="bi bi-pen-fill"></i></button>
                            </div> 
                            <small id="helper" className="form-text ms-1">Useful while resetting password.</small>
                        </div>    
                        <div className="form-group mb-3">
                            <label htmlFor="phone">Phone:</label>
                            <div className="d-flex justify-content-center">                                
                                <input type="phone" className="form-control" id="phone" value={phone} placeholder="Enter a new phone....." onChange={(e)=>setPhone(e.target.value)}/>                           
                                <button type="button" className="btn e-button ms-3" onClick={editPhone}><i className="bi bi-pen-fill"></i></button>
                            </div>
                        </div>  
                    </form>
                </div>            
            </div>
        </div>
    )
}

export default UserSetting;