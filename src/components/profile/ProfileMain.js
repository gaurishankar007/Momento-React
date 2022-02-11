import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";
import "../../css/ProfileMain.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const { REACT_APP_COVER_PIC_URL } = process.env;

const ProfileMain =()=> {
    const [userData, setUserData] = useState("")
    const [profileData, setProfileData] = useState("")
    const [addressData, setAddressData] = useState("")
    const [pADiv, setPADiv] = useState("");
    const [pADivState, setPADivState] = useState("");
    const [userNum, setUserNum] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(response=> {
            setUserData(response.data.userData);
        });

        axios.get(`${REACT_APP_BASE_URL}number/user`, config).then(response=> {
            setUserNum(response.data);
        });

        axios.get(`${REACT_APP_BASE_URL}profile/get/my`, config).then(response=> {
            setProfileData(response.data.userProfile)
        })

        axios.get(`${REACT_APP_BASE_URL}address/get/my`, config).then(response=> {
            setAddressData(response.data.userAddress)
        })

    }, [])

    function togglePADiv(divType) {         
        if(divType==="profile") {              
            if(pADivState==="" || pADivState==="address") {
                setPADiv(
                    <div className="d-flex justify-content-center my-3">                        
                        <div className="pa-div d-flex flex-column align-items-center p-2">
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">First Name:</h2>
                                <h2>{profileData.first_name}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Last Name:</h2>
                                <h2>{profileData.last_name}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Gender:</h2>
                                <h2>{profileData.gender}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Birthday:</h2>
                                <h2>{profileData.birthday.split("T")[0]}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Biography:</h2>
                                <h2>{profileData.biography}</h2>
                            </div>
                        </div>
                    </div>
                )
                setPADivState("profile")
            } else {  
                setPADiv("")
                setPADivState("") 
            } 
        } else if(divType==="address") {               
            if(pADivState==="" || pADivState==="profile") {
                setPADiv(
                    <div className="d-flex justify-content-center my-3">                        
                        <div className="pa-div d-flex flex-column align-items-center p-2">                         
                            <h2 className="keyPA mb-2"><u>Permanent</u></h2>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Country:</h2>
                                <h2>{addressData.permanent.country}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">State:</h2>
                                <h2>{addressData.permanent.state}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">City:</h2>
                                <h2>{addressData.permanent.city}</h2>
                            </div>
                            <div className="d-flex align-items-center mb-3">                            
                                <h2 className="keyPA me-3">Street:</h2>
                                <h2>{addressData.permanent.street}</h2>
                            </div>                       
                            <h2 className="keyPA mb-2"><u>Temporary</u></h2>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Country:</h2>
                                <h2>{addressData.temporary.country}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">State:</h2>
                                <h2>{addressData.temporary.state}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">City:</h2>
                                <h2>{addressData.temporary.city}</h2>
                            </div>
                            <div className="d-flex align-items-center">                            
                                <h2 className="keyPA me-3">Street:</h2>
                                <h2>{addressData.temporary.street}</h2>
                            </div>                       
                        </div>
                    </div>
                )
                setPADivState("address")
            } else {  
                setPADiv("")
                setPADivState("") 
            } 
        }  
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">                
                <div className="user-profile-div d-flex flex-column justify-content-center">
                    <div className="coverPFF">
                        <img className="cover-pic" src={REACT_APP_COVER_PIC_URL + userData.cover_pic} alt="Cover Picture"/>
                        <div className="profilePic-border"></div>
                        <img className="profile-pic" src={REACT_APP_PROFILE_PIC_URL + userData.profile_pic} alt="Profile Picture"/>
                        <NavLink className="follower btn d-flex flex-column align-items-center" to="">
                            <h2 className="fNum">{userNum.followers}</h2>
                            <h2>Followers</h2>
                        </NavLink>
                        <NavLink className="following btn d-flex flex-column align-items-center" to="">
                            <h2 className="fNum">{userNum.followed_users}</h2>
                            <h2>Following</h2>                                
                        </NavLink>
                    </div>
                    <div className="d-flex justify-content-around my-2">  
                        <h1>{userData.username}</h1>          
                    </div>
                    <div className="d-flex justify-content-around">                        
                        <button type="button" className="btn lR-button" onClick={()=> togglePADiv("profile")}><i className="bi bi-person-fill"></i> Profile</button>                 
                        <button type="button" className="btn lR-button" onClick={()=> togglePADiv("address")}><i className="bi bi-geo-alt-fill"></i> Address</button>
                    </div>
                    {pADiv}
                    <div className="px-5">                        
                        <div className="post-nav-divider mt-3"></div>
                        <div className="post-nav d-flex justify-content-around my-2">
                            <i className="btn bi bi-grid-fill"></i>            
                            <i className="btn bi bi-person-plus-fill"></i>                 
                        </div>
                        <div className="post-nav-divider mb-3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileMain;