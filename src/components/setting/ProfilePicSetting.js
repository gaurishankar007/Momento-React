import { useState } from "react";
import axios from "axios"; 
import LoggedInHeader from ".././LoggedInHeader";
import ProfilePicture from "../../images/defaultProfile.png";
import SettingNav from "./SettingNav";
import "../../css/ProfileSetting.css";

const ProfileSetting =()=> {
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
    
    const changeProfile = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

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
            <LoggedInHeader></LoggedInHeader> 
            <div className="d-flex justify-content-center">                         
                <div className="setting py-3 mt-2">
                    <SettingNav/>  
                    <form className="setting-form d-flex flex-column justify-content-center">           
                        <div className="d-flex justify-content-center mb-3">                        
                            <img className="profile-picture" src={ProfilePicture} alt="Memento"/>  
                        </div>
                        <div className="form-group d-flex flex-column justify-content-center mb-3">
                            <input type="file" className="form-control" id="file" placeholder="Choose a profile picture....." accept=".jpeg, .png"/>
                        </div> 
                        <div className="d-flex justify-content-center align-items-center">                
                            <button type="button" className="btn lR-button" onClick={changeProfile}>Change Profile Picture</button>
                        </div>
                    </form>
                </div>            
            </div>
        </div>
    )
}

export default ProfileSetting;