import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import React from "react";
import axios from "axios"; 
import LoggedInHeader from ".././Header/LoggedInHeader";
import "../../css/PostView.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const { REACT_APP_POST_URL } = process.env;

const PostView = ()=> {
    const {post_id} = useParams();
    const [userData, setUserData] = useState("");
    const [postUserData, setPostUserData] = useState("");
    const [postImages, setPostImages] = useState([]); 
    const [taggedFollowers, setTaggedFollowers] = useState([]); 
    const [caption, setCaption] = useState(""); 
    const [description, setDescription] = useState(""); 
    const [likeNum, setLikeNum] = useState(""); 
    const [commentNum, setCommentNum] = useState(""); 
    const [liked, setLiked] = useState(false);
    const [commented, setCommented] = useState(false);
    const [commentData, setCommentData] = useState("");
    const [comment, setComment] = useState("");
    const [response, setResponse] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }   
        axios.all([
            axios.post(`${REACT_APP_BASE_URL}post/get/single`, {post_id}, config),
            axios.post(`${REACT_APP_BASE_URL}post/get/single/lc`, {post_id}, config),
            axios.post(`${REACT_APP_BASE_URL}comment/find`, {post_id}, config),
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config),
        ])  
        .then(axios.spread((...responses)=> {
            setPostUserData(responses[0].data.user_id)
            setPostImages(responses[0].data.attach_file)
            setLikeNum(responses[0].data.like_num)
            setCommentNum(responses[0].data.comment_num)
            setCaption(responses[0].data.caption)
            setDescription(responses[0].data.description)
            setTaggedFollowers(responses[0].data.tag_friend)
            setLiked(responses[1].data.liked)
            setCommented(responses[1].data.commented)
            if(responses[2].data.message===true) {                
                setCommentData(responses[2].data.commentData.comment)
            }
            setUserData(responses[3].data.userData)
        })) 
    }, [])

    const postLike = (event)=> {
        event.preventDefault();
        setResponse("")

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.post(`${REACT_APP_BASE_URL}like/post`, {post_id}, config).then(()=> {             
            axios.all([
                axios.post(`${REACT_APP_BASE_URL}post/get/single`, {post_id}, config),
                axios.post(`${REACT_APP_BASE_URL}post/get/single/lc`, {post_id}, config)
            ])  
            .then(axios.spread((...responses)=> {
                setLikeNum(responses[0].data.like_num)
                setLiked(responses[1].data.liked)
            })) 
        });
    }
    const postComment = (event)=> {
        event.preventDefault();
        setResponse("")

        if(comment==="") {
            setResponse("Empty comment field.");
            return;
        }

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.post(`${REACT_APP_BASE_URL}comment/post`, {post_id, comment}, config).then(()=> {          
            axios.all([
                axios.post(`${REACT_APP_BASE_URL}post/get/single`, {post_id}, config),
                axios.post(`${REACT_APP_BASE_URL}post/get/single/lc`, {post_id}, config),
                axios.post(`${REACT_APP_BASE_URL}comment/find`, {post_id}, config),
            ])  
            .then(axios.spread((...responses)=> {
                setCommentNum(responses[0].data.comment_num)
                setCommented(responses[1].data.commented)
                if(responses[2].data.message===true) {                
                    setCommentData(responses[2].data.commentData.comment)
                }
            }))             
        });
    }
    
    const deleteComment = (event)=> {
        event.preventDefault();
        setResponse("")

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.delete(`${REACT_APP_BASE_URL}comment-delete/${post_id}`, config).then(()=> {            
            axios.all([
                axios.post(`${REACT_APP_BASE_URL}post/get/single`, {post_id}, config),
                axios.post(`${REACT_APP_BASE_URL}post/get/single/lc`, {post_id}, config)
            ])  
            .then(axios.spread((...responses)=> {
                setCommentNum(responses[0].data.comment_num)
                setCommented(responses[1].data.commented)
            }))             
        });
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mt-3 mb-5">
                <div className="upload-div d-flex flex-column justify-content-center align-items-start pb-3">
                    <div className="d-flex align-items-center ps-1 py-2">
                        <img className="postUser-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + postUserData.profile_pic} alt="user-profilePic"/>  
                        <label className="fw-bold postUser-username">{postUserData.username}</label>
                    </div>
                    <Carousel interval={null}>     
                        {postImages.map(Image=> {
                            return (                  
                                <Carousel.Item key={Image}> 
                                    <img className="d-block w-100" src={REACT_APP_POST_URL + Image} alt="PostImages"/>
                                </Carousel.Item>
                            )
                        })}
                    </Carousel>                   
                    <div className="postView-div d-flex flex-column py-2 px-3">
                        <div className="d-flex align-items-center mb-2">
                            {
                                liked
                                ? 
                                <i className="like-button btn bi bi-heart-fill me-2" id="post-liked" onClick={postLike}></i>
                                :
                                <i className="like-button btn bi bi-heart-fill me-2" onClick={postLike}></i>
                            }
                            <NavLink className="me-2" to={"/like/" + post_id}>{likeNum} liker,</NavLink>
                            <NavLink to={"/comment/" + post_id}>{commentNum} commenter</NavLink>
                        </div> 
                        <label className="mb-2"><label className="fw-bold me-2">{caption}</label><label>{description}</label></label>
                        <div className="suggestion-message text-center">{response}</div>
                        <div className="comment-section d-flex align-items-center my-3">
                            <img className="user-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + userData.profile_pic} alt="user-profilePic"/>         
                            {
                                commented
                                ?
                                <div className="d-flex align-items-center">                                    
                                    <label className="comment-data me-2">{commentData}</label>
                                    <i className="delete-comment btn bi bi-trash" onClick={deleteComment}></i>
                                </div>
                                :
                                <div className="d-flex align-items-center">
                                    <textarea type="text" className="form-control me-2" placeholder="Comment on this post....." onChange={(e)=>setComment(e.target.value.trim())}/>    
                                    <i className="btn bi bi-send-fill" onClick={postComment}></i>  
                                </div>
                            }             
                        </div>
                        {
                            taggedFollowers.length > 0
                            ?
                            <div className="form-group mb-2">
                                <label htmlFor="taggedFollowers" className="fw-bold">Tagged Followers:</label> 
                                <div className="taggedFollowers d-flex flex-column mt-1" id="taggedFollowers" >
                                    {taggedFollowers.map(singleTaggedFollower=> {
                                        return (
                                            <div className="d-flex align-items-center mb-3" key={singleTaggedFollower._id}>  
                                                <img className="follower-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + singleTaggedFollower.profile_pic} alt="follower-profilePic"/>
                                                <label className="follower-username">{singleTaggedFollower.username}</label>
                                            </div>                                            
                                        )
                                    })}
                                </div>
                            </div>  
                            :
                            <div></div>
                        }  
                    </div> 
                </div>
            </div>    
        </div>
    )
}

export default PostView;