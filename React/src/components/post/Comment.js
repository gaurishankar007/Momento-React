import { useState, useEffect } from "react";
import axios from "axios"; 
import { NavLink, useParams } from "react-router-dom";
import LoggedInHeader from "../Header/LoggedInHeader";
import "../../css/Comment.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Comment =()=> {
    const {post_id} = useParams()
    const [commenterData, setCommenterData] = useState([])
    const [myId, setMyId] = useState("")
    const [editC, setEditC] = useState(false)
    const [comment, setComment] = useState("")
    const [noCommenter, setNoCommenter] = useState("")
    const [response, setResponse] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.all([
            axios.post(`${REACT_APP_BASE_URL}comments/get`, {post_id}, config),
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config)
        ])
        .then(axios.spread((...responses)=> {
            setCommenterData(responses[0].data);
            if(responses[0].data.length===0) {
                setNoCommenter(
                    <h2 className="text-center mb-3">No one has commented on this post yet.</h2>
                )
            } 

            setMyId(responses[1].data.userData._id);
        }))
    }, [])

    function startEdit(pComment) {
        setComment(pComment)
        setEditC(true) 
    }

    const cancelEdit=()=> {
        setEditC(false) 
        setResponse("")
    }

    const editComment=()=> {        
        setResponse("")

        if(comment.trim()==="") {
            setResponse("Empty comment field.");
            return;
        }

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.put(`${REACT_APP_BASE_URL}comment/edit`, {post_id : post_id, comment : comment.trim()}, config).then(()=> {          
            axios.post(`${REACT_APP_BASE_URL}comments/get`, {post_id}, config)
            .then((response)=> {
                setCommenterData(response.data);
                setEditC(false)
            })           
        });
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <h2 className="text-center"><u>Commenter</u></h2>
                    <div className="suggestion-message text-center">{response}</div>
                   {commenterData.map((singleComment)=> {
                        return (
                            <div key={singleComment._id} className="comment-div">
                                {
                                    singleComment.user_id._id === myId
                                    ?
                                    <div className="d-flex justify-content-between align-items-center">
                                        {
                                            editC 
                                            ?                                            
                                            <div className="edit-section d-flex justify-content-start align-items-center my-2">
                                                <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleComment.user_id.profile_pic} alt="user-profilePic"/>     
                                                <textarea type="text" className="form-control me-2" value={comment} placeholder="Comment on this post....." onChange={(e)=>setComment(e.target.value)}/>    
                                                <i className="btn bi bi-send-fill" onClick={editComment}></i>  
                                            </div>
                                            :
                                            <div className="d-flex justify-content-start align-items-center my-2">
                                                <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleComment.user_id.profile_pic} alt="ProfilePic"/>
                                                <div>                                        
                                                    <h2>{singleComment.user_id.username}</h2>
                                                    <h4>{singleComment.comment}</h4>
                                                </div>
                                            </div> 
                                        }
                                        {
                                            editC
                                            ?                                            
                                            <button type="button" className="btn lR-button" onClick={cancelEdit}>Cancel</button>
                                            :                                            
                                            <button type="button" className="btn lR-button" onClick={()=>{startEdit(singleComment.comment)}}>Edit</button>      
                                        }                                    
                                    </div>
                                    :                                  
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex justify-content-start align-items-center my-2">
                                            <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleComment.user_id.profile_pic} alt="ProfilePic"/>
                                            <div>                                        
                                                <h2>{singleComment.user_id.username}</h2>
                                                <h4>{singleComment.comment}</h4>
                                            </div>
                                        </div> 
                                        <NavLink to={"/profile-main/" + singleComment.user_id._id}><button type="button" className="btn lR-button" >View Profile</button></NavLink>    
                                    </div>   
                                } 
                            </div>
                        )
                   })}
                   {noCommenter}
                </div> 
            </div>
        </div>
    )
}

export default Comment;