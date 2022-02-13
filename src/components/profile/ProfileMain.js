import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";
import "../../css/ProfileMain.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const { REACT_APP_COVER_PIC_URL } = process.env;
const { REACT_APP_POST_URL } = process.env;

const ProfileMain =()=> {
    const [userData, setUserData] = useState("")
    const [profileData, setProfileData] = useState("")
    const [addressData, setAddressData] = useState("")
    const [pADiv, setPADiv] = useState("")
    const [pADivState, setPADivState] = useState("")
    const [myPost, setMyPost] = useState(true)
    const [postData, setPostData] = useState([])
    const [postOpDiv, setPostOpDiv] = useState("")
    const [targetedPostId, setTargetedPostId] = useState("")
    const [noPost, setNoPost] = useState("")
    const [userNum, setUserNum] = useState("")

    const navigate = useNavigate()

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.all([          
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config),
            axios.get(`${REACT_APP_BASE_URL}number/user`, config),
            axios.get(`${REACT_APP_BASE_URL}profile/get/my`, config),
            axios.get(`${REACT_APP_BASE_URL}address/get/my`, config),
            axios.get(`${REACT_APP_BASE_URL}posts/get/my`, config),
        ])
        .then(axios.spread((...responses)=> {
            setUserData(responses[0].data.userData)
            setUserNum(responses[1].data)
            setProfileData(responses[2].data.userProfile)
            setAddressData(responses[3].data.userAddress)
            setPostData(responses[4].data)

            if(responses[4].data.length===0) {
                setNoPost(
                    <h1 className="text-center mb-3">No posts uploaded yet.</h1>
                )
            } 
        }))
    }, [])

    function togglePADiv(divType) {         
        if(divType==="profile") {              
            if(pADivState==="" || pADivState==="address") {
                setPADiv(
                    <div className="d-flex justify-content-center">                        
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
                    <div className="d-flex justify-content-center mt-3">                        
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

    function togglePostDiv(postDivType) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        if(postDivType==="myPost") {
            axios.get(`${REACT_APP_BASE_URL}posts/get/my`, config)
            .then((response)=> {
                setPostData(response.data)
                if(response.data.length===0) {
                    setNoPost(
                        <h1 className="text-center mb-3">No posts uploaded yet.</h1>
                    )
                } else {
                    setNoPost("")
                }
            })   
            setMyPost(true)       

        } else if(postDivType==="taggedPost") {
            setMyPost(false)

            axios.get(`${REACT_APP_BASE_URL}posts/get/tagged`, config)
            .then((response)=> {
                setPostData(response.data)
                if(response.data.length===0) {
                    setNoPost(
                        <h1 className="text-center mb-3">No posts tagged yet.</h1>
                    )
                } else {
                    setNoPost("")
                }
            })          
        }
    }

    function viewPost(postId) {
        setTargetedPostId("")
        setPostOpDiv("")
        navigate("/post-view/"+postId)
    }

    function editPost(postId) {
        setTargetedPostId("")
        setPostOpDiv("")
        navigate("/post-edit/"+postId)
    }

    function deletePost(postId) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.delete(`${REACT_APP_BASE_URL}post-delete/${postId}`, config)
        .then(()=> {
            axios.get(`${REACT_APP_BASE_URL}posts/get/my`, config)
            .then((response)=> {
                setPostData(response.data)
                if(response.data.length===0) {
                    setNoPost(
                        <h1 className="text-center mb-3">No posts uploaded yet.</h1>
                    )
                } else {
                    setNoPost("")
                }
            })  
        }) 
        setTargetedPostId("")
        setPostOpDiv("")
    }

    function closePostOpDiv() {
        setTargetedPostId("")
        setPostOpDiv("")
    }

    function openPostOpDiv(postId) {
        if(myPost) {
            setTargetedPostId(postId)
            setPostOpDiv(
                <div className="d-flex flex-column" id="postOperation">
                    <i className="view-post btn bi bi-eye-fill" onClick={()=> {viewPost(postId)}}></i>
                    <i className="edit-post btn bi bi-pen-fill" onClick={()=> {editPost(postId)}}></i>
                    <i className="delete-post btn bi bi-trash" onClick={()=> {deletePost(postId)}}></i>
                    <i className="cancel-post-op btn bi bi-x-circle-fill" onClick={()=> {closePostOpDiv()}}></i>
                </div>
            )
        } else {
            navigate("/post-view/"+postId)
        }
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">                
                <div className="user-profile-div d-flex flex-column justify-content-center">
                    <div className="coverPFF">
                        <img className="cover-pic" src={REACT_APP_COVER_PIC_URL + userData.cover_pic} alt="CoverPicture"/>
                        <div className="profilePic-border"></div>
                        <img className="profile-pic" src={REACT_APP_PROFILE_PIC_URL + userData.profile_pic} alt="ProfilePicture"/>
                        <NavLink className="follower btn d-flex flex-column align-items-center" to="/followers">
                            <h2 className="fNum">{userNum.followers}</h2>
                            <h2>Followers</h2>
                        </NavLink>
                        <NavLink className="following btn d-flex flex-column align-items-center" to="/following">
                            <h2 className="fNum">{userNum.followed_users}</h2>
                            <h2>Following</h2>                                
                        </NavLink>
                    </div>
                    <div className="d-flex justify-content-center my-1">  
                        <h1>{userData.username}</h1>          
                    </div>
                    <div className=" d-flex justify-content-around">                     
                        <button type="button" className="btn pa-button lR-button" onClick={()=> togglePADiv("profile")}><i className="bi bi-person-fill"></i> Profile</button>                 
                        <button type="button" className="btn pa-button lR-button" onClick={()=> togglePADiv("address")}><i className="bi bi-geo-alt-fill"></i> Address</button>
                    </div>
                    {pADiv}
                    {postOpDiv}
                    <div className="px-3">                        
                        <div className="post-nav-divider mt-3"></div>
                        <div className="post-nav d-flex justify-content-around">
                            <i className="btn bi bi-grid-fill" style={myPost? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {togglePostDiv("myPost")}}></i>            
                            <i className="btn bi bi-person-plus-fill" style={!myPost? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {togglePostDiv("taggedPost")}}></i>                 
                        </div>
                        <div className="post-nav-divider"></div>
                    </div>
                    <div className="post-div my-3">
                        {postData.map((singlePost)=> {
                            return (
                                <div key={singlePost._id} className="btn single-post" onClick={()=>{openPostOpDiv(singlePost._id)}}>            
                                    <img className="post-pic img-fluid" src={REACT_APP_POST_URL + singlePost.attach_file[0]} alt="post-pic"/>
                                </div>
                            )
                        })}
                    </div>
                    {noPost}
                </div>
            </div>
        </div>
    )
}

export default ProfileMain;