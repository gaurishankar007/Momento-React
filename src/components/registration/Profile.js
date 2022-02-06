import React, { useEffect, useState } from "react";
import axios from "axios";
import LoggedOutHeader from "../LoggedOutHeader";
import Logo from "../../images/logo.png";
import ProfilePicture from "../../images/defaultProfile.png";
import "../../css/Profile.css";
import { Link, useNavigate } from "react-router-dom";

const Profile = ()=> {   
    const [profilePic, setProfilePic] = useState("");
    const [profilePiceUrl, setProfilePicUrl] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    const navigate = useNavigate();
    useEffect(()=> {   
        if(!localStorage.hasOwnProperty("userToken")) {
            window.location.replace("/");
            return;
        }        
        localStorage.hasOwnProperty("uRSM") ? setSResponse(localStorage.getItem("uRSM")): console.log();
        localStorage.hasOwnProperty("uRSM") ? localStorage.removeItem("uRSM") : console.log();
        setProfilePicUrl(ProfilePicture);
    }, [])

    const onProfilePicSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
          setProfilePicUrl(URL.createObjectURL(event.target.files[0]));
          setProfilePic(event.target.files[0]);
        }
    }

    const addProfile = (e)=> {
        e.preventDefault();
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
            if(result.data.message==="New profile picture added.") {
                navigate("/cover-registration");
            }
            else {
                setResponse(result.data.message);
            }
        });
    }

    const hiddenFileInput = React.useRef(null);    
    const handleFileInputClick = () => {
        hiddenFileInput.current.click();
    };

    return(
        <div>
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center mb-2">Add a Profile Picture</h3>   
                    <div className="mb-2">
                        <div className="suggestion-message text-center">{response}</div>           
                        <div className="success-message text-center">{sResponse}</div>  
                    </div>            
                    <div className="d-flex justify-content-center mb-3">                        
                        <img className="profile-picture" src={profilePiceUrl} alt="Memento"/>  
                    </div>
                    <form> 
                        <div className="form-group d-flex flex-column justify-content-center align-items-center mb-3">
                            <input type="file" className="form-control mb-3" id="profile-picture-selection" ref={hiddenFileInput} accept=".jpeg, .png, .jpg" onChange={onProfilePicSelect}/>             
                            <button type="button" className="btn lR-button" onClick={handleFileInputClick} >Select a profile picture</button>
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