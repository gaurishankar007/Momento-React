import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";
import { Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../css/Home.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const { REACT_APP_POST_URL } = process.env;

const Home = ()=> {
    const [userData, setUserData] = useState("");
    const [postsData, setPostsData] = useState([]);
    const [comment, setComment] = useState("");
    const [targetPost, setTargetPost] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }   
        axios.all([
            axios.get(`${REACT_APP_BASE_URL}posts/get/followed-user`, config),
            axios.get(`${REACT_APP_BASE_URL}user/checkType`, config),
        ])  
        .then(axios.spread((...responses)=> {
            setPostsData(responses[0].data)
            setUserData(responses[1].data.userData)
        })) 
    }, [])

    function postLike (post_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.post(`${REACT_APP_BASE_URL}like/post`, {post_id}, config).then(()=> {   
            axios.get(`${REACT_APP_BASE_URL}posts/get/followed-user`, config) 
            .then((response)=> {
                setPostsData(response.data)
            })
        });
    }

    function commenting(post_id, comment) {
        setTargetPost(post_id)
        setComment(comment)
    }

    function postComment(post_id) {
        if(comment==="" || targetPost!==post_id) {
            return;
        } 

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.post(`${REACT_APP_BASE_URL}comment/post`, {post_id, comment}, config).then(()=> {  
            axios.get(`${REACT_APP_BASE_URL}posts/get/followed-user`, config) 
            .then((response)=> {
                setComment("")
                setTargetPost("")
                setPostsData(response.data)
            })
        });
    }
    
    function deleteComment(post_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.delete(`${REACT_APP_BASE_URL}comment-delete/${post_id}`, config).then(()=> {   
            axios.get(`${REACT_APP_BASE_URL}posts/get/followed-user`, config) 
            .then((response)=> {
                setPostsData(response.data)
            })
        });
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mt-1 mb-5">
                <div className="upload-div d-flex flex-column justify-content-center align-items-start pb-3" id="followedPost-div">
                    {postsData.map((singlePost)=> {
                        return (
                            <div className="singlePost-div d-flex flex-column justify-content-center mb-3" key={singlePost.post._id}>
                                <div className="d-flex justify-content-between align-items-center ps-1 pe-2 py-2">
                                    <NavLink to={"/profile-main/" + singlePost.post.user_id._id}>
                                        <div className="d-flex align-items-center">
                                            <img className="postUser-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + singlePost.post.user_id.profile_pic} alt="user-profilePic"/>  
                                            <label className="fw-bold postUser-username">{singlePost.post.user_id.username}</label>
                                        </div>
                                    </NavLink>
                                    <NavLink to={"/report/" + singlePost.post._id}><button className="btn lR-button" id="report-post">Report</button></NavLink>
                                </div>
                                <Carousel interval={null}>     
                                    {singlePost.post.attach_file.map(Image=> {
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
                                            singlePost.liked
                                            ? 
                                            <i className="like-button btn bi bi-heart-fill me-2" id="post-liked" onClick={()=>{postLike(singlePost.post._id)}}></i>
                                            :
                                            <i className="like-button btn bi bi-heart-fill me-2" onClick={()=>{postLike(singlePost.post._id)}}></i>
                                        }
                                        <NavLink className="me-2" to={"/like/" + singlePost.post._id}>{singlePost.post.like_num} liker,</NavLink>
                                        <NavLink to={"/comment/" + singlePost.post._id}>{singlePost.post.comment_num} commenter</NavLink>
                                    </div> 
                                    <label className="mb-2"><label className="fw-bold me-2">{singlePost.post.caption}</label><label>{singlePost.post.description}</label></label>
                                    <div className="comment-section d-flex align-items-center my-3">
                                        <img className="user-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + userData.profile_pic} alt="user-profilePic"/>         
                                        {
                                            singlePost.commented.check
                                            ?
                                            <div className="d-flex align-items-center">                                    
                                                <label className="comment-data me-2">{singlePost.commented.data}</label>
                                                <i className="delete-comment btn bi bi-trash" onClick={()=>{deleteComment(singlePost.post._id)}}></i>
                                            </div>
                                            :
                                            <div className="d-flex align-items-center">
                                                <textarea type="text" className="form-control me-2" placeholder="Comment on this post....." onChange={(e)=>commenting(singlePost.post._id, e.target.value.trim())}/>    
                                                <i className="btn bi bi-send-fill" onClick={()=>{postComment(singlePost.post._id)}}></i>  
                                            </div>
                                        }             
                                    </div>                                    
                                    {
                                        singlePost.post.tag_friend.length > 0
                                        ?
                                        <div className="form-group mb-2">
                                            <label htmlFor="taggedFollowers" className="fw-bold">Tagged Followers:</label> 
                                            <div className="taggedFollowers d-flex flex-column mt-1" id="taggedFollowers" >
                                                {singlePost.post.tag_friend.map(singleTaggedFollower=> {
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
                        )
                    })}
                </div>
            </div>    
        </div>
    )
}


export default Home;