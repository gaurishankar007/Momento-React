import { useState, useEffect } from "react";
import axios from "axios"; 
import { NavLink } from "react-router-dom";
import LoggedInHeader from "../Header/LoggedInHeader";
import "../../css/Followers.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Followers =()=> {
    const [followersData, setFollowersData] = useState([])
    const [noFollowers, setNoFollowers] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.get(`${REACT_APP_BASE_URL}followers/get`, config).then(response=> {
            setFollowersData(response.data);
            if(response.data.length===0) {
                setNoFollowers(
                    <h1 className="text-center mb-3">No one has followed you yet.</h1>
                )
            } else {
                setNoFollowers("")
            }
        });
    }, [])

    function removeFollower(follower_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.delete(`${REACT_APP_BASE_URL}remove-follower/${follower_id}`, config).then(()=> {
            axios.get(`${REACT_APP_BASE_URL}followers/get`, config).then(response1=> {
                setFollowersData(response1.data);
                if(response1.data.length===0) {
                    setNoFollowers(
                        <h1 className="text-center mb-3">No one has followed you yet.</h1>
                    )
                } else {
                    setNoFollowers("")
                }
            });            
        })
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <h2 className="text-center"><u>Followers</u></h2>
                   {followersData.map((singleFollow)=> {
                        return (
                            <div className="d-flex justify-content-between align-items-center" key={singleFollow._id}>
                                <NavLink to={"/profile-main/" + singleFollow.follower._id}>
                                    <div className="d-flex justify-content-start align-items-center my-2">
                                        <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleFollow.follower.profile_pic} alt="ProfilePic"/>
                                        <div>                                        
                                            <h2>{singleFollow.follower.username}</h2>
                                            <h4>{singleFollow.follower.email}</h4>
                                        </div>
                                    </div> 
                                </NavLink>                    
                                <button type="button" className="btn lR-button" onClick={()=> {removeFollower(singleFollow.follower._id)}}>Remove</button>     
                            </div>
                        )
                   })}
                   {noFollowers}
                </div> 
            </div>
        </div>
    )
}

export default Followers;