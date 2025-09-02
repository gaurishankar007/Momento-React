import React, { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";
import SettingNav from "../Header/SettingNav";
import "../../css/CoverSetting.css";

const { REACT_APP_BASE_URL } = process.env;  
const { REACT_APP_COVER_PIC_URL } = process.env; 

const CoverSetting =()=> {
    const [coverPic, setCoverPic] = useState("");
    const [coverPicUrl, setCoverPicUrl] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
    
    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            setCoverPicUrl(REACT_APP_COVER_PIC_URL + result.data.userData.cover_pic);
        });
    }, [])
    
    const onCoverPicSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
          setCoverPicUrl(URL.createObjectURL(event.target.files[0]));
          setCoverPic(event.target.files[0]);
        }
    }

    const changeCover = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        if(coverPic==="") {
            setResponse("Select a cover picture first.");
            return;
        }

        const coverData = new FormData();
        coverData.append("cover", coverPic);

        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.put(`${REACT_APP_BASE_URL}user/changeCover`, coverData, config).then((result)=> {
            if(result.data.message==="New cover picture added.") {
                setCoverPic("");
                setSResponse("You have changed your cover picture.");
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
            <LoggedInHeader></LoggedInHeader> 
            <div className="d-flex justify-content-center">                         
                <div className="setting py-3 mt-2">
                    <SettingNav/>  
                    <form  className="setting-form d-flex flex-column justify-content-center">     
                        <div className="mb-2">
                            <div className="suggestion-message text-center">{response}</div>           
                            <div className="success-message text-center">{sResponse}</div>  
                        </div>                  
                        <div className="d-flex justify-content-center mb-3">                        
                            <img className="cover-picture" src={coverPicUrl} alt="Memento"/>  
                        </div>
                        <div className="form-group d-flex flex-column justify-content-center align-items-center mb-3">
                            <input type="file" className="form-control" id="cover-picture-selection" ref={hiddenFileInput} accept=".jpeg, .png, .jpg" onChange={onCoverPicSelect}/>            
                            <button type="button" className="btn lR-button" onClick={handleFileInputClick} >Select a cover picture</button>
                        </div> 
                        <div className="d-flex justify-content-center align-items-center">                
                            <button type="button" className="btn lR-button" onClick={changeCover}><i className="bi bi-upload"></i> Change</button>
                        </div>
                    </form>
                </div>            
            </div>
        </div>
    )
}

export default CoverSetting;