import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../css/Personal.css";
import LoggedInHeader from "../Header/LoggedInHeader";
import SettingNav from "../Header/SettingNav";
import Select from "react-select";
import countryList from "react-select-country-list";

const AddressSetting = ()=> {
    const [pCountry, setPCountry] = useState("Select your Country");
    const [pState, setPState] = useState("");
    const [pCity, setPCity] = useState("");
    const [pStreet, setPStreet] = useState("");
    const [tCountry, setTCountry] = useState("Select your Country");
    const [tState, setTState] = useState("");
    const [tCity, setTCity] = useState("");
    const [tStreet, setTStreet] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");
    
    const { REACT_APP_BASE_URL } = process.env;
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    }

    useEffect(()=> {          
        axios.get(`${REACT_APP_BASE_URL}address/get/my`, config).then(result=> {
            if(result.data.userAddress) {
                result.data.userAddress.permanent.country === "" ? setPCountry("Select your Country") : setPCountry(result.data.userAddress.permanent.country);
                setPState(result.data.userAddress.permanent.state);
                setPCity(result.data.userAddress.permanent.city);
                setPStreet(result.data.userAddress.permanent.street);
                result.data.userAddress.temporary.country === "" ? setTCountry("Select your Country") : setTCountry(result.data.userAddress.temporary.country);
                setTState(result.data.userAddress.temporary.state);
                setTCity(result.data.userAddress.temporary.city);
                setTStreet(result.data.userAddress.temporary.street);
            }                
        });  
    }, []);

    const editAddress = (e)=> {
        e.preventDefault();
        setResponse("");
        setSResponse("");

        if (tCountry==="Select your Country" || tState.trim()==="" || tCity.trim()==="" || tStreet.trim()==="" || 
            pCountry==="Select your Country" || pState.trim()==="" || pCity.trim()==="" || pStreet.trim()==="") {
            setResponse("Empty field found. Fill up the form completely.");          
            return;             
        } else if ( tState.length<2 || tCity.length<2 || tStreet.length<2 || pState.length<2 || pCity.length<2 || pStreet.length<2) {
            setResponse("Provide at least two characters in state, city and street.");          
            return;             
        }

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
        
        axios.put(`${REACT_APP_BASE_URL}address/update`, AddressData, config).then((result)=> {
            if(result.data.message==="Address has been updated.") {
                setSResponse("Your address has been updated."); 
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
            <LoggedInHeader></LoggedInHeader> 
            <div className="d-flex justify-content-center">                         
                <div className="setting py-3 mt-2">
                    <SettingNav/>  
                    <form className="setting-form d-flex flex-column justify-content-center"> 
                        <div className="mb-2">
                            <div className="suggestion-message text-center">{response}</div>           
                            <div className="success-message text-center">{sResponse}</div>  
                        </div>   
                        <h4 className="text-center address-type mb-2">Permanent</h4>
                        <label htmlFor="pCountry">Country:</label>  
                        <Select className="mb-3" id="pCountry" placeholder={pCountry} options={countryOptions} value={pCountry} onChange={value=>setPCountry(value.label)} />
                        <div className="form-group mb-3">
                            <label htmlFor="pState">State:</label>  
                            <input type="text" className="form-control" id="pState" value={pState}  placeholder="Enter a new state....." onChange={(e)=>setPState(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <label htmlFor="pCity">City</label>  
                            <input type="text" className="form-control" id="pCity" value={pCity}  placeholder="Enter a new city....." onChange={(e)=>setPCity(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <label htmlFor="pStreet">Street:</label>  
                            <input type="text" className="form-control" id="pStreet" value={pStreet} placeholder="Enter a new street....." onChange={(e)=>setPStreet(e.target.value.trim())}/>
                        </div>  
                        <h4 className="text-center address-type mb-2">Temporary</h4>
                        <label htmlFor="tCountry">Country:</label>  
                        <Select className="mb-3" id="tCountry" placeholder={tCountry} options={countryOptions} value={tCountry} onChange={value=>setTCountry(value.label)} />
                        <div className="form-group mb-3">
                            <label htmlFor="tState">State:</label>  
                            <input type="text" className="form-control" id="tState" value={tState}  placeholder="Enter a new state....." onChange={(e)=>setTState(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <label htmlFor="tCity">City</label> 
                            <input type="text" className="form-control" id="tCity" value={tCity}  placeholder="Enter a new city....." onChange={(e)=>setTCity(e.target.value.trim())}/>
                        </div>  
                        <div className="form-group mb-3">
                            <label htmlFor="tStreet">Street:</label>  
                            <input type="text" className="form-control" id="tStreet" value={tStreet} placeholder="Enter a new street....." onChange={(e)=>setTStreet(e.target.value.trim())}/>
                        </div>  
                        <div className="d-flex justify-content-center align-items-center">                                          
                            <button type="button" className="btn lR-button" onClick={editAddress}>Update</button>
                        </div>
                    </form>
                </div>            
            </div>    
        </div>
    )
}

export default AddressSetting;