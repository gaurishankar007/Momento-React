import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoggedOutHeader from "../LoggedOutHeader";
import "../../css/Personal.css";
import Logo from "../../images/logo.png";

const Personal = ()=> {
    const [username, setUsername] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const [biography, setBiography] = useState("");
    const [response, setResponse] = useState("");

    function getDateNow() {    
        const date = new Date();

        const year = date.getFullYear();
        const month = ((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        const dateNow = year+"-"+month+"-"+day;

        return dateNow;
    }
    const today = getDateNow();

    const addPersonal = (e)=> {
        e.preventDefault();
        setResponse("");

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

        const personalInformationData = {first_name, last_name, gender, birthday, biography};
        const { REACT_APP_BASE_URL } = process.env;
        axios.post(`${REACT_APP_BASE_URL}profile/add`, personalInformationData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>            
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center">Add Personal Information</h3>
                    <form>
                        <div className="suggestion-message text-center mb-2">{response}</div>
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="first-name"  placeholder="Enter your first name....." onChange={(e)=>setFirstName(e.target.value.trim())}/>
                            <small id="helper" className="form-text ms-1">Excludes whitespace around the first name.</small>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="last-name"  placeholder="Enter your last name....." onChange={(e)=>setLastName(e.target.value.trim())}/>
                            <small id="helper" className="form-text ms-1">Excludes whitespace around the last name.</small>
                        </div>  
                        <div className="mb-3">                                   
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Male" value="Male" onClick={(e)=>setGender(e.target.value.trim())}/>
                                <label className="form-check-label">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Female" value="Female" onClick={(e)=>setGender(e.target.value.trim())}/>
                                <label className="form-check-label">Female</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Other" value="Other" onClick={(e)=>setGender(e.target.value.trim())}/>
                                <label className="form-check-label">Other</label>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <input type="date" className="form-control" id="date" min="1900-01-01" max={today} placeholder="Pick your birthday date....." onChange={(e)=>setBirthday(e.target.value)}/>
                        </div>                              
                        <div className="form-group mb-3">
                            <textarea type="text" className="form-control" id="biography"  placeholder="Enter your biography....." rows="3" onChange={(e)=>setBiography(e.target.value)}/>
                            <small id="helper" className="form-text ms-1">Optional.</small>
                        </div>
                        <div className="d-flex justify-content-around align-items-center">                                       
                            <Link className="s-button"  to="/address-registration">Skip</Link>                            
                            <button type="button" className="btn lR-button" onClick={addPersonal}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Personal;