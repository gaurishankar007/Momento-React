import { useState, useEffect } from "react";
import axios from "axios"; 
import { NavLink, useParams } from "react-router-dom";
import LoggedInHeader from "../Header/LoggedInHeader";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Like =()=> {
    const {post_id} = useParams()
    const [LikerData, setLikerData] = useState([])
    const [myId, setMyId] = useState("")
    const [noLiker, setNoLiker] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.all([
            axios.post(`${REACT_APP_BASE_URL}likes/get`, {post_id}, config),
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config)
        ])
        .then(axios.spread((...responses)=> {
            setLikerData(responses[0].data);
            if(responses[0].data.length===0) {
                setNoLiker(
                    <h2 className="text-center mb-3">No one has liked this post yet.</h2>
                )
            } 

            setMyId(responses[1].data.userData._id);
        }))
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <h2 className="text-center"><u>Liker</u></h2>
                   {LikerData.map((singleLike)=> {
                        return (
                            <div className="d-flex justify-content-between align-items-center" key={singleLike._id}>
                                <div className="d-flex justify-content-start align-items-center my-2">
                                    <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleLike.user_id.profile_pic} alt="ProfilePic"/>
                                    <div>                                        
                                        <h2>{singleLike.user_id.username}</h2>
                                        <h4>{singleLike.user_id.email}</h4>
                                    </div>
                                </div>     
                                {
                                    singleLike.user_id._id === myId
                                    ?
                                    <div></div>
                                    :
                                    <NavLink to={"/profile-main/" + singleLike.user_id._id}><button type="button" className="btn lR-button" >View Profile</button></NavLink>   
                                }     
                            </div>
                        )
                   })}
                   {noLiker}
                </div> 
            </div>
        </div>
    )
}

export default Like;