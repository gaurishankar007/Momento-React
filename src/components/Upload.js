import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import React from "react";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";
import "../css/Upload.css";

const Upload = ()=> {
    const [followers, setFollowers] = useState([]); 
    const [uploadDiv, setUploadDiv] = useState("");
    const [postImages, setPostImages] = useState([]); 
    const [taggedFollowers, setTaggedFollowers] = useState([]); 
    const [caption, setCaption] = useState(""); 
    const [description, setDescription] = useState(""); 
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    const { REACT_APP_BASE_URL } = process.env;
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    }

    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

    // Programmatically click the hidden file input element
    // when the Button component is clicked
    const handleFileInputClick = () => {
        hiddenFileInput.current.click();
    }; 

    useEffect(()=> {
        document.getElementsByClassName("upload-button-div")[0].style.marginTop = "300px";

        axios.get(`${REACT_APP_BASE_URL}followers/get`, config).then((result)=> {
            if(result.data.length>0) {
                setFollowers(result.data);
            }
        });
    }, [])

    function tagFollower(follower_id) {
        var tempTaggedFollower = taggedFollowers;
        if(tempTaggedFollower.includes(follower_id)) {            
            tempTaggedFollower.pop(follower_id);
        } else {                    
            tempTaggedFollower.push(follower_id);
        }
        setTaggedFollowers(tempTaggedFollower);
    }

    const onImagesSelect = (event) => { 
        event.preventDefault();
        setResponse("");
        setSResponse("");

        if(event.target.files.length > 12) {
            setResponse("A post can have up to 12 images only.");
            return;
        } 

        if(event.target.files.length>0) {
            document.getElementsByClassName("upload-button-div")[0].style.marginTop = "25px";

            const selectedImages = event.target.files;
            var selectedImagesUrl = [];
            for(var i=0; i<selectedImages.length; i++) {
                selectedImagesUrl.push(URL.createObjectURL(selectedImages[i]));
            }

            setPostImages(selectedImages);

            setUploadDiv(
                <div className="d-flex justify-content-center">
                    <div className="upload-div d-flex flex-column justify-content-center align-items-center pb-3">
                        <Carousel interval={null}>     
                            {selectedImagesUrl.map(singleFileUrl=> {
                                return (                  
                                    <Carousel.Item key={singleFileUrl}> 
                                        <img className="d-block w-100" src={singleFileUrl} alt="First slide" />
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>                   
                        <div className="upload-div-form px-4 mt-2">
                            <div className="form-group mb-3">
                                <label htmlFor="caption">Caption:</label>    
                                <input type="text" className="form-control" id="caption" placeholder="Give a caption to your post....." onChange={(e)=>setCaption(e.target.value.trim())}/>
                            </div>                              
                            <div className="form-group mb-3">
                                <label htmlFor="description">Description:</label> 
                                <textarea type="text" className="form-control" id="description" placeholder="Tell about your post here....." rows="3" onChange={(e)=>setDescription(e.target.value.trim())}/>  
                                <small id="helper" className="form-text ms-1">Optional</small>
                            </div>                          
                            <div className="form-group mb-3">
                                <label htmlFor="user-follower">Followers:</label> 
                                <div className="d-flex flex-column p-3" id="user-follower" >
                                    {followers.map(singleFollower=> {
                                        return (
                                            <div className="d-flex align-items-center mb-2" key={singleFollower._id}>
                                                <input className="form-check-input me-2" type="checkbox" value="" id="tag-follower" onClick={()=>{tagFollower(singleFollower.follower._id)}}/>
                                                <img className="follower-profilePic me-3" src={REACT_APP_BASE_URL + "profiles/"+ singleFollower.follower.profile_pic} alt="follower-profilePic"/>
                                                <label className="follower-username">{singleFollower.follower.username}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                                <small id="helper" className="form-text ms-1">Tag followers</small>
                            </div>                            
                        </div>
                    </div>
                </div>
            )  
        }      
    }   

    const uploadPost = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        if(postImages.length<1) {
            setResponse("Select images for the post first.");
            return;
        } else if(caption==="") {
            setResponse("Caption field is empty.");
            return;
        }

        const postData = new FormData();
        postData.append("caption", caption);
        postData.append("description", description);
        postData.append("images", postImages);
        for(var i=0; i<postImages.length; i++) {;
            postData.append(`images`, postImages[i]);            
        }
        for(var i=0; i<taggedFollowers.length; i++) {;
            postData.append(`tag_friend[${i}]`, taggedFollowers[i]);            
        }

        axios.post(`${REACT_APP_BASE_URL}post/add`, postData, config).then((result)=> {
            if(result.data.message==="Post uploaded") {
                setPostImages([]);
                setTaggedFollowers([]);
                setUploadDiv("");
                document.getElementsByClassName("upload-button-div")[0].style.marginTop = "300px";
                setSResponse("Your post has been uploaded.");
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
            {uploadDiv} 
            <div className="d-flex justify-content-center">                
                <input type="file" className="form-control mb-3" ref={hiddenFileInput} id="post-images-selection" accept=".jpeg, .png, .jpg" onChange={onImagesSelect} multiple/> 
            </div>           
            <div className="upload-button-div mb-5">                                  
                <button type="button" className="btn lR-button image-select-button" onClick={handleFileInputClick} ><i className="bi bi-arrow-down"></i> Select Images</button>              
                <button type="button" className="btn lR-button" onClick={uploadPost}><i className="bi bi-upload"></i> Upload Post</button>
            </div>
        </div>
    )
}

export default Upload;