import { useState } from "react";
import axios from "axios";
import LoggedOutHeader from "../LoggedOutHeader";
import Logo from "../../images/logo.png";
import ProfilePicture from "../../images/defaultProfile.png";
import "../../css/Profile.css";
import { Link } from "react-router-dom";

const Profile = ()=> {   
    const [profileFileName, setProfileFileName] = useState("defaultProfile.png");
    const [response, setResponse] = useState("");

    const addProfile = (e)=> {
        e.preventDefault();
        setResponse("");

        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.post(`${REACT_APP_BASE_URL}user/changeProfile`, config).then((result)=> {
            
        });
    }

    return(
        <div>
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center mb-2">Add a Profile Picture</h3>
                    <div className="d-flex justify-content-center mb-3">                        
                        <img className="profile-picture" src={ProfilePicture} alt="Memento"/>  
                    </div>
                    <form>
                        <div className="suggestion-message text-center mb-2">{response}</div>       
                        <div className="form-group d-flex flex-column justify-content-center mb-3">
                            <input type="file" className="form-control" id="file" placeholder="Choose a profile picture....." accept=".jpeg, .png"/>
                        </div> 
                        <div className="d-flex justify-content-around align-items-center">                                       
                            <Link className="s-button"  to="/cover-registration">Skip</Link>                
                            <button type="button" className="btn lR-button" onClick={addProfile}>Next</button>
                        </div>
                    </form>
                </div>
            </div>     
        </div>
    )
}

export default Profile;