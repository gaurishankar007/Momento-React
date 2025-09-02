import { useState, useEffect } from "react";
import axios from "axios"; 
import { NavLink, useParams } from "react-router-dom";
import LoggedInHeader from "../Header/LoggedInHeader";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const FollowersOther =()=> {
    const {user_id} = useParams();
    const [followersData, setFollowersData] = useState([])
    const [myId, setMyId] = useState("")
    const [noFollowers, setNoFollowers] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.all([
            axios.post(`${REACT_APP_BASE_URL}followers/get/other`, {user_id}, config),     
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config)
        ])
        .then(axios.spread((...responses)=> {
            setFollowersData(responses[0].data);
            if(responses[0].data.length===0) {
                setNoFollowers(
                    <h1 className="text-center mb-3">No one has followed this user yet.</h1>
                )
            } else {
                setNoFollowers("")
            }       

            setMyId(responses[1].data.userData._id);    
        }))
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <h2 className="text-center"><u>Followers</u></h2>
                   {followersData.map((singleFollow)=> {
                        return (
                            <div className="d-flex justify-content-between align-items-center" key={singleFollow._id}>
                                 <div className="d-flex justify-content-start align-items-center my-2">
                                    <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleFollow.follower.profile_pic} alt="ProfilePic"/>
                                    <div>                                        
                                        <h2>{singleFollow.follower.username}</h2>
                                        <h4>{singleFollow.follower.email}</h4>
                                    </div>
                                </div>     
                                {
                                    singleFollow.follower._id===myId
                                    ?
                                    <div></div> 
                                    : 
                                    <NavLink to={"/profile-main/" + singleFollow.follower._id}><button type="button" className="btn lR-button">View profile</button></NavLink>
                                }          
                            </div>
                        )
                   })}
                   {noFollowers}
                </div> 
            </div>
        </div>
    )
}

export default FollowersOther;