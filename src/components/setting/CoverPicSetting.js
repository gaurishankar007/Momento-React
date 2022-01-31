import { useState } from "react";
import axios from "axios"; 
import LoggedInHeader from ".././LoggedInHeader";
import CoverPicture from "../../images/defaultCover.png";
import SettingNav from "./SettingNav";
import "../../css/CoverSetting.css";

const CoverSetting =()=> {
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
    
    const changeCover = (event)=> {
        event.preventDefault();
        setResponse("");
        setSResponse("");

        const { REACT_APP_BASE_URL } = process.env;
        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.post(`${REACT_APP_BASE_URL}user/changeCover`, config).then((result)=> {

        });
    }

    return(
        <div>            
            <LoggedInHeader></LoggedInHeader> 
            <div className="d-flex justify-content-center">                         
                <div className="setting py-3 mt-2">
                    <SettingNav/>  
                    <form  className="setting-form d-flex flex-column justify-content-center">           
                        <div className="d-flex justify-content-center mb-3">                        
                            <img className="cover-picture" src={CoverPicture} alt="Memento"/>  
                        </div>
                        <div className="form-group d-flex flex-column justify-content-center mb-3">
                            <input type="file" className="form-control" id="file" placeholder="Choose a profile picture....." accept=".jpeg, .png"/>
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