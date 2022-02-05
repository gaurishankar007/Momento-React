import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from ".././LoggedInHeader";
import CoverPicture from "../../images/defaultCover.png";
import SettingNav from "./SettingNav";
import "../../css/CoverSetting.css";

const CoverSetting =()=> {
    const [coverPic, setCoverPic] = useState("");
    const [coverPicUrl, setCoverPicUrl] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    const { REACT_APP_BASE_URL } = process.env;
    
    useEffect(()=> {
        if(!localStorage.hasOwnProperty("userToken")) {
            window.location.replace("/");
            return;
        }   

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            setCoverPicUrl(REACT_APP_BASE_URL + "covers/" + result.data.userData.cover_pic);
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

        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.put(`${REACT_APP_BASE_URL}user/changeCover`, coverData, config).then((result)=> {
            if(result.data.message=="New cover picture added.") {
                setCoverPic("");
                setSResponse("You have changed your cover picture.");
            }
            else {
                setResponse(result.data.message);
            }
        });
    }

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
                        <div className="form-group d-flex flex-column justify-content-center mb-3">
                            <input type="file" className="form-control" id="file" placeholder="Choose a profile picture....." accept=".jpeg, .png, .jpg" onChange={onCoverPicSelect}/>
                        </div> 
                        <div className="d-flex justify-content-center align-items-center">                
                            <button type="button" className="btn lR-button" onClick={changeCover}>Change Cover Picture</button>
                        </div>
                    </form>
                </div>            
            </div>
        </div>
    )
}

export default CoverSetting;