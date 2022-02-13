import { useState, useEffect } from "react";
import axios from "axios"; 
import { NavLink, useParams } from "react-router-dom";
import LoggedInHeader from "../Header/LoggedInHeader";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const FollowingOther =()=> {
    const {user_id} = useParams();
    const [followingData, setFollowingData] = useState([])
    const [myId, setMyId] = useState("")
    const [noFollowing, setNoFollowing] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.all([
            axios.post(`${REACT_APP_BASE_URL}followedUsers/get/other`, {user_id}, config),   
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config)
        ])
        .then(axios.spread((...responses)=> {
            setFollowingData(responses[0].data);
            if(responses[0].data.length===0) {
                setNoFollowing(
                    <h2 className="text-center mb-3">This user has not followed anyone yet.</h2>
                )
            } else {
                setNoFollowing("")
            }

            setMyId(responses[1].data.userData._id);            
        }))
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <h2 className="text-center"><u>Following</u></h2>
                   {followingData.map((singleFollow)=> {
                        return (
                            <div className="d-flex justify-content-between align-items-center" key={singleFollow._id}>
                                <div className="d-flex justify-content-start align-items-center my-2">
                                    <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleFollow.followed_user.profile_pic} alt="ProfilePic"/>
                                    <div>                                        
                                        <h2>{singleFollow.followed_user.username}</h2>
                                        <h4>{singleFollow.followed_user.email}</h4>
                                    </div>
                                </div>    
                                {
                                    singleFollow.followed_user._id===myId
                                    ?
                                    <div></div>
                                    :
                                    <NavLink to={"/profile-main/" + singleFollow.followed_user._id}><button type="button" className="btn lR-button" >View Profile</button></NavLink>   
                                }     
                            </div>
                        )
                   })}
                   {noFollowing}
                </div> 
            </div>
        </div>
    )
}

export default FollowingOther;