import { useState, useEffect } from "react";
import axios from "axios"; 
import { NavLink } from "react-router-dom";
import LoggedInHeader from "../Header/LoggedInHeader";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Following =()=> {
    const [followingData, setFollowingData] = useState([])
    const [noFollowing, setNoFollowing] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}followedUsers/get`, config).then(response=> {
            setFollowingData(response.data);
            if(response.data.length===0) {
                setNoFollowing(
                    <h1 className="text-center mb-3">You have not followed anyone yet.</h1>
                )
            } else {
                setNoFollowing("")
            }
        });
    }, [])

    function unFollow(followed_user_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.delete(`${REACT_APP_BASE_URL}unFollow/${followed_user_id}`, config).then(()=> {
            axios.get(`${REACT_APP_BASE_URL}followedUsers/get`, config).then(response1=> {
                setFollowingData(response1.data);
                if(response1.data.length===0) {
                    setNoFollowing(
                        <h1 className="text-center mb-3">You have not followed anyone yet.</h1>
                    )
                } else {
                    setNoFollowing("")
                }
            });            
        })
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <h2 className="text-center"><u>Following</u></h2>
                   {followingData.map((singleFollow)=> {
                        return (
                            <div className="d-flex justify-content-between align-items-center" key={singleFollow._id}>
                                <NavLink to={"/profile-main/" + singleFollow.followed_user._id}>
                                    <div className="d-flex justify-content-start align-items-center my-2">
                                        <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleFollow.followed_user.profile_pic} alt="ProfilePic"/>
                                        <div>                                        
                                            <h2>{singleFollow.followed_user.username}</h2>
                                            <h4>{singleFollow.followed_user.email}</h4>
                                        </div>
                                    </div> 
                                </NavLink>                    
                                <button type="button" className="btn lR-button" onClick={()=> {unFollow(singleFollow.followed_user._id)}}>UnFollow</button>     
                            </div>
                        )
                   })}
                   {noFollowing}
                </div> 
            </div>
        </div>
    )
}

export default Following;