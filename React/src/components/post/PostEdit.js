import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import React from "react";
import axios from "axios"; 
import LoggedInHeader from ".././Header/LoggedInHeader";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const { REACT_APP_POST_URL } = process.env;

const PostEdit = ()=> {
    const {post_id} = useParams();
    const [actualFollowers, setActualFollowers] = useState([])
    const [followers, setFollowers] = useState([]); 
    const [postImages, setPostImages] = useState([]); 
    const [taggedFollowersData, setTaggedFollowersData] = useState([]); 
    const [taggedFollowers, setTaggedFollowers] = useState([]); 
    const [caption, setCaption] = useState(""); 
    const [description, setDescription] = useState(""); 
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.all([
            axios.get(`${REACT_APP_BASE_URL}followers/get`, config),
            axios.post(`${REACT_APP_BASE_URL}post/get/single`, {post_id}, config)
        ])
        .then(axios.spread((...responses)=> {
            setPostImages(responses[1].data.attach_file)
            setCaption(responses[1].data.caption)
            setDescription(responses[1].data.description)
            setTaggedFollowersData(responses[1].data.tag_friend)

            var tempTaggedFollower = taggedFollowers;
            for( var i=0; i<responses[1].data.tag_friend.length; i++) {
                if(!tempTaggedFollower.includes(responses[1].data.tag_friend[i]._id)) {                      
                    tempTaggedFollower.push(responses[1].data.tag_friend[i]._id);
                }
            }
            setTaggedFollowers(tempTaggedFollower)
            setActualFollowers(responses[0].data)
            if(responses[0].data.length>0) {
                var tempList = []
                for( var j=0; j<responses[0].data.length; j++) {
                    if(!taggedFollowers.includes(responses[0].data[j].follower._id)) {                      
                        tempList.push(responses[0].data[j]);
                    }
                }
                setFollowers(tempList);
            }
        }))
    }, [])

    function tagFollower(follower_id) {
        var tempTaggedFollower = taggedFollowers;
        if(tempTaggedFollower.includes(follower_id)) {                  
            tempTaggedFollower.splice(tempTaggedFollower.indexOf(follower_id), 1);  
        } else {                    
            tempTaggedFollower.push(follower_id);
        }
        setTaggedFollowers(tempTaggedFollower);
    }

    const editPost = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        if(caption.trim()==="") {
            setResponse("Caption field is empty.");
            return;
        }

        const postData = {post_id: post_id, caption: caption.trim(), description: description.trim(), tag_friend: taggedFollowers};
        
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.put(`${REACT_APP_BASE_URL}post/edit`, postData, config).then((result)=> {
            if(result.data.message==="Post has been edited.") {
                setSResponse("Your post has been edited.");
            }
            else {
                setResponse(result.data.message);
            }
        });
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="mt-3"></div>
            <div className="mb-2">
                <div className="suggestion-message text-center">{response}</div>           
                <div className="success-message text-center">{sResponse}</div>  
            </div>  
            <div className="d-flex justify-content-center">
                <div className="upload-div d-flex flex-column justify-content-center align-items-center pb-3">
                    <Carousel interval={null}>     
                        {postImages.map(Image=> {
                            return (                  
                                <Carousel.Item key={Image}> 
                                    <img className="d-block w-100" src={REACT_APP_POST_URL + Image} alt="PostImages" />
                                </Carousel.Item>
                            )
                        })}
                    </Carousel>                   
                    <div className="upload-div-form px-4 mt-2">
                        <div className="form-group mb-3">
                            <label htmlFor="caption" className="fw-bold">Caption:</label>    
                            <input type="text" className="form-control" id="caption" value={caption} placeholder="Give a caption to your post....." onChange={(e)=>setCaption(e.target.value)}/>
                        </div>                              
                        <div className="form-group mb-3">
                            <label htmlFor="description" className="fw-bold">Description:</label> 
                            <textarea type="text" className="form-control" id="description" value={description} placeholder="Tell about your post here....." rows="3" onChange={(e)=>setDescription(e.target.value)}/>  
                            <small id="helper" className="form-text ms-1">Optional</small>
                        </div>       
                        {
                            actualFollowers.length > 0
                            ?
                            <div className="form-group mb-3">
                                <label htmlFor="user-follower" className="fw-bold">Followers:</label> 
                                <div className="d-flex flex-column p-3" id="user-follower" >
                                    {taggedFollowersData.map(singleTaggedFollower=> {
                                        return (
                                            <div className="d-flex align-items-center mb-3" key={singleTaggedFollower._id}>                                             
                                                <input className="tag-follower form-check-input me-2" type="checkbox" defaultChecked onClick={()=>{tagFollower(singleTaggedFollower._id)}}/>
                                                <img className="follower-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + singleTaggedFollower.profile_pic} alt="follower-profilePic"/>
                                                <label className="follower-username">{singleTaggedFollower.username}</label>
                                            </div>                                            
                                        )
                                    })}
                                    {followers.map(singleFollower=> {
                                        return (
                                            <div className="d-flex align-items-center mb-3" key={singleFollower._id}>                                             
                                                <input className="tag-follower form-check-input me-2" type="checkbox" onClick={()=>{tagFollower(singleFollower.follower._id)}}/>
                                                <img className="follower-profilePic me-3" src={REACT_APP_BASE_URL + "profiles/"+ singleFollower.follower.profile_pic} alt="follower-profilePic"/>
                                                <label className="follower-username">{singleFollower.follower.username}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                                <small id="helper" className="form-text ms-1">Tag followers</small>
                            </div>  
                            :
                            <div></div>
                        }                                       
                    </div>
                </div>
            </div>       
            <div className="d-flex justify-content-center my-3">                                              
                <button type="button" className="btn lR-button" onClick={editPost}>Edit Post</button>
            </div>
        </div>
    )
}

export default PostEdit;