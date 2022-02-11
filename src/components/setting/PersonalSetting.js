import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/Personal.css";
import LoggedInHeader from "../Header/LoggedInHeader";
import SettingNav from "../Header/SettingNav";
    
const { REACT_APP_BASE_URL } = process.env;

const PersonalSetting = ()=> {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const [biography, setBiography] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    function getDateNow() {    
        const date = new Date();

        const year = date.getFullYear();
        const month = ((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        const dateNow = year+"-"+month+"-"+day;

        return dateNow;
    }
    const today = getDateNow();

    useEffect(()=> {         
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }    
        axios.get(`${REACT_APP_BASE_URL}profile/get/my`, config).then(result=> { 
            if(result.data.userProfile) {    
                setFirstName(result.data.userProfile.first_name);
                setLastName(result.data.userProfile.last_name);
                setGender(result.data.userProfile.gender);
                result.data.userProfile.birthday!==null ? setBirthday(result.data.userProfile.birthday.split("T")[0]) : setBirthday("");
                setBiography(result.data.userProfile.biography);
            }
        });  
    }, []);

    const editPersonal = (e)=> {
        e.preventDefault();
        setResponse("");
        setSResponse("");

        const numberRegex = new RegExp('[0-9]');
        const specialCharacterRegex = new RegExp('[!@#$%^&*(),.?":{}|<>]');
        
        if (first_name.trim()==="" || last_name.trim()==="" || gender==="" || birthday==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;             
        } else if (first_name.length<2) {
            setResponse("First name most contain at least two characters.");          
            return;                
        } else if (last_name.length<2) {
            setResponse("Last name most contain at least two characters.");          
            return;                 
        } else if (numberRegex.test(first_name) || specialCharacterRegex.test(first_name) || numberRegex.test(last_name) || specialCharacterRegex.test(last_name)) {
            setResponse("Any numbers or special characters are not allowed in the name.");          
            return;                
        }
   
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        const personalInformationData = {first_name, last_name, gender, birthday, biography};
        axios.put(`${REACT_APP_BASE_URL}profile/update`, personalInformationData, config).then((result)=> {
            if(result.data.message==="Profile updated.") {
                setSResponse("Your profile has been updated."); 
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
                    <form className="setting-form d-flex flex-column justify-content-center">
                        <div className="mb-2">
                            <div className="suggestion-message text-center">{response}</div>           
                            <div className="success-message text-center">{sResponse}</div>  
                        </div>   
                        <div className="form-group mb-3">
                            <label htmlFor="first-name">First Name:</label>                  
                            <input type="text" className="form-control" id="first-name" value={first_name} placeholder="Enter a new first name....." onChange={(e)=>setFirstName(e.target.value)}/>  
                            <small id="helper" className="form-text ms-1">Excludes whitespace around the first name.</small>
                        </div>    
                        <div className="form-group mb-3">
                            <label htmlFor="last-name">Last Name:</label>                              
                            <input type="text" className="form-control" id="last-name" value={last_name} placeholder="Enter a new last name....." onChange={(e)=>setLastName(e.target.value)}/> 
                            <small id="helper" className="form-text ms-1">Excludes whitespace around the last name.</small>
                        </div> 
                        <div className="d-flex flex-column mb-3">   
                            <label>Gender:</label>                                
                           <div>
                            <div className="form-check form-check-inline">
                                    {
                                    gender==="Male" ?                                     
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Male" value="Male" checked onClick={(e)=>setGender(e.target.value)}/>
                                        :                                        
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Male" value="Male" onClick={(e)=>setGender(e.target.value)}/>
                                    }
                                    <label className="form-check-label">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    {
                                    gender==="Female" ?                                     
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Female" value="Female" checked onClick={(e)=>setGender(e.target.value)}/>
                                        :                                        
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Female" value="Female" onClick={(e)=>setGender(e.target.value)}/>
                                    }
                                    <label className="form-check-label">Female</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    {
                                    gender==="Other" ?       
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Other" value="Other" checked onClick={(e)=>setGender(e.target.value)}/>
                                        :                                        
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Other" value="Other" onClick={(e)=>setGender(e.target.value)}/>
                                    }
                                    <label className="form-check-label">Other</label>
                                </div>
                           </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="date">Birthday:</label>    
                            <input type="date" className="form-control" id="date" value={birthday} min="1900-01-01" max={today} placeholder="Pick your birthday date....." onChange={(e)=>setBirthday(e.target.value)}/>
                        </div>                              
                        <div className="form-group mb-3">
                            <label htmlFor="biography">Biography:</label> 
                            <textarea type="text" className="form-control" id="biography" value={biography}  placeholder="Enter your biography....." rows="3" onChange={(e)=>setBiography(e.target.value.trim())}/>  
                            <small id="helper" className="form-text ms-1">Optional</small>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">                               
                            <button type="button" className="btn lR-button" onClick={editPersonal}>Update</button>
                        </div>
                    </form>
                </div>            
            </div>    
        </div>
    )
}

export default PersonalSetting;