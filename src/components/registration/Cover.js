import React, { useState, useEffect } from "react";
import axios from "axios";
import LoggedOutHeader from "../LoggedOutHeader";
import Logo from "../../images/logo.png";
import CoverPicture from "../../images/defaultCover.png";
import "../../css/Cover.css";
import { Link, useNavigate } from "react-router-dom";

const Cover = ()=> { 
    const [coverPic, setCoverPic] = useState("");
    const [coverPicUrl, setCoverPicUrl] = useState("");
    const [response, setResponse] = useState("");
    
    const navigate = useNavigate();
    
    useEffect(()=> {
        if(!localStorage.hasOwnProperty("userToken")) {
            window.location.replace("/");
            return;
        }   
        setCoverPicUrl(CoverPicture);
    }, [])

    const onCoverPicSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
          setCoverPicUrl(URL.createObjectURL(event.target.files[0]));
          setCoverPic(event.target.files[0]);
        }
    }

    const addCover = (e)=> {
        e.preventDefault();
        setResponse("");

        if(coverPic==="") {
            setResponse("Select a cover picture first.");
            return;
        }

        const coverData = new FormData();
        coverData.append("cover", coverPic);

        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.put(`${REACT_APP_BASE_URL}user/changeCover`, coverData, config).then((result)=> {
            if(result.data.message==="New cover picture added.") {
                navigate("/personal-information-registration");
            }
            else {
                setResponse(result.data.message);
            }
        });
    }

    const hiddenFileInput = React.useRef(null);    
    const handleFileInputClick = () => {
        hiddenFileInput.current.click();
    };

    return(
        <div>
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center mb-2">Add a Cover Picture</h3>
                    <div className="suggestion-message text-center mb-2">{response}</div>    
                    <div className="d-flex justify-content-center mb-3">                        
                        <img className="cover-picture" src={coverPicUrl} alt="Memento"/>  
                    </div>
                    <form>   
                        <div className="form-group d-flex flex-column justify-content-center align-items-center mb-3">
                            <input type="file" className="form-control" id="cover-picture-selection" ref={hiddenFileInput} accept=".jpeg, .png, .jpg" onChange={onCoverPicSelect}/>            
                            <button type="button" className="btn lR-button" onClick={handleFileInputClick} >Select a cover picture</button>
                        </div> 
                        <div className="d-flex justify-content-around align-items-center">                                       
                            <Link className="s-button"  to="/personal-information-registration">Skip</Link>                
                            <button type="button" className="btn lR-button" onClick={addCover}>Next</button>
                        </div>
                    </form>
                </div>
            </div>     
        </div>
    )
}

export default Cover;