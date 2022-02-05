import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from ".././LoggedInHeader";
import ProfilePicture from "../../images/defaultProfile.png";
import SettingNav from "./SettingNav";
import "../../css/ProfileSetting.css";

const ProfileSetting =()=> {
    const [profilePic, setProfilePic] = useState("");
    const [profilePiceUrl, setProfilePicUrl] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
        
    const { REACT_APP_BASE_URL } = process.env;
    
    useEffect(()=> {
        if(!localStorage.hasOwnProperty("userToken")) {
            window.location.replace("/");
            return;
        }  

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            setProfilePicUrl(REACT_APP_BASE_URL + "profiles/" + result.data.userData.profile_pic);
        });
    }, [])

    const onProfilePicSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
          setProfilePicUrl(URL.createObjectURL(event.target.files[0]));
          setProfilePic(event.target.files[0]);
        }
    }
    
    const changeProfile = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        if(profilePic==="") {
            setResponse("Select a profile picture first.");
            return;
        }

        const profileData = new FormData();
        profileData.append("profile", profilePic);

        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.put(`${REACT_APP_BASE_URL}user/changeProfile`, profileData, config).then((result)=> {
            if(result.data.message=="New profile picture added.") {
                setProfilePic("");
                setSResponse("You have changed your profile picture.");
            }
            else {
                setResponse(result.data.message);
            }
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
                        <div className="d-flex justify-content-center mb-3">                        
                            <img className="profile-picture" src={profilePiceUrl} alt="Memento"/>  
                        </div>
                        <div className="form-group d-flex flex-column justify-content-center mb-3">
                            <input type="file" className="form-control" id="file" placeholder="Choose a profile picture....." accept=".jpeg, .png, .jpg" onChange={onProfilePicSelect}/>
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