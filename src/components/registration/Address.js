import { useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import LoggedOutHeader from "../LoggedOutHeader";
import "../../css/Address.css";
import Logo from "../../images/logo.png";

const Address = ()=> {
    const [tCountry, setTCountry] = useState("Select your Country");
    const [tState, setTState] = useState("");
    const [tCity, setTCity] = useState("");
    const [tStreet, setTStreet] = useState("");
    const [pCountry, setPCountry] = useState("Select your Country");
    const [pState, setPState] = useState("");
    const [pCity, setPCity] = useState("");
    const [pStreet, setPStreet] = useState(""); 
    const [response, setResponse] = useState("");
    const navigate = useNavigate();

    const addAddress = (e)=> {
        e.preventDefault();
        setResponse("");

        if (tCountry==="Select your Country" || tState.trim()==="" || tCity.trim()==="" || tStreet.trim()==="" || 
            pCountry==="Select your Country" || pState.trim()==="" || pCity.trim()==="" || pStreet.trim()==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;             
        } else  if ( tState.length<2 || tCity.length<2 || tStreet.length<2 || pState.length<2 || pCity.length<2 || pStreet.length<2) {
            setResponse("Provide at least two characters in state, city and street.");          
            return;             
        }

        const { REACT_APP_BASE_URL } = process.env;
        const AddressData = {
                pCountry: pCountry,
                pState: pState,
                pCity: pCity,
                pStreet: pStreet,
                tCountry: tCountry,
                tState: tState,
                tCity: tCity,
                tStreet: tStreet
        };
        const config = {
            headers: {
                Authorization: 'Bearer ' + (localStorage.hasOwnProperty('userToken') ? localStorage.getItem('userToken') : "")
            }
        }
        axios.post(`${REACT_APP_BASE_URL}address/add`, AddressData, config).then((result)=> {
            if(result.data.message==="Address added.") {
                navigate("/home");
            }
            else {
                setResponse(result.data.message);          
            }
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
                            <input type="text" className="form-control" id="pStreet" placeholder="Pick your street....." onChange={(e)=>setPStreet(e.target.value.trim())}/>
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
                            <input type="text" className="form-control" id="tStreet" placeholder="Pick your street....." onChange={(e)=>setTStreet(e.target.value.trim())}/>
                        </div>  
                        <div className="d-flex justify-content-around align-items-center">                                       
                            <Link className="s-button"  to="/home">Skip</Link>                                        
                            <button type="button" className="btn lR-button" onClick={addAddress}>Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Address;