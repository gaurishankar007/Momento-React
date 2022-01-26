import { useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import LoggedOutHeader from "../LoggedOutHeader";
import "../../css/Address.css";
import Logo from "../../images/logo.png";

const Address = ()=> {
    const [username, setUsername] = useState("");
    const [tCountry, setTCountry] = useState("Select your Country");
    const [tState, setTState] = useState("");
    const [tCity, setTCity] = useState("");
    const [tStreet, setTStreet] = useState("");
    const [pCountry, setPCountry] = useState("Select your Country");
    const [pState, setPState] = useState("");
    const [pCity, setPCity] = useState("");
    const [pStreet, setPStreet] = useState("");
    const [response, setResponse] = useState("");

    const addAddress = (e)=> {
        e.preventDefault();
        setResponse("");

        const numberRegex = new RegExp('[0-9]');
        const specialCharacterRegex = new RegExp('[!@#$%^&*(),.?":{}|<>]');

        if (tCountry==="Select your Country" || tState.trim()==="" || tCity.trim()==="" || tStreet.trim()==="" || 
            pCountry==="Select your Country" || pState.trim()==="" || pCity.trim()==="" || pStreet.trim()==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;             
        }

        const userData = {
            permanent: {
                country: pCountry,
                
            }
        };
        const { REACT_APP_BASE_URL } = process.env;
        axios.post(`${REACT_APP_BASE_URL}profile/add`, userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    // For Country Selector
    const countryOptions = useMemo(() => countryList().getData(), []);

    return(
        <div>            
            <LoggedOutHeader></LoggedOutHeader>          
            <div className="register-user">
                <img className="logo" src={Logo} alt="Memento"/>                
                <div className="register-user-form px-4 py-3">
                    <h3 className="text-center">Add Address</h3>
                    <form>
                        <div className="suggestion-message text-center mb-2">{response}</div>  
                        <h4 className="text-center address-type mb-2">Permanent</h4>
                        <Select className="mb-3" placeholder={pCountry} options={countryOptions} value={pCountry} onChange={value=>setPCountry(value.label)} />
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="pState"  placeholder="Enter your state....." onChange={(e)=>setPState(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="pCity"  placeholder="Enter your city....." onChange={(e)=>setPCity(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="pStreet" placeholder="Pick your street....." onChange={(e)=>setPStreet(e.target.value)}/>
                        </div>  
                        <h4 className="text-center address-type mb-2">Temporary</h4>
                        <Select className="mb-3" placeholder={tCountry} options={countryOptions} value={tCountry} onChange={value=>setTCountry(value.label)} />
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="tState"  placeholder="Enter your state....." onChange={(e)=>setTState(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="tCity"  placeholder="Enter your city....." onChange={(e)=>setTCity(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" id="tStreet" placeholder="Pick your street....." onChange={(e)=>setTStreet(e.target.value)}/>
                        </div>  
                        <div className="d-flex justify-content-around align-items-center">                                       
                            <Link className="s-button"  to="/address-registration">Skip</Link>                                        
                            <button type="button" className="btn lR-button" onClick={addAddress}>Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Address;