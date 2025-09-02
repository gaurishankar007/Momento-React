import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";
import "../css/Search.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Search =()=> {
    const [searchBy, setSearchBy] = useState("username")
    const [users, setUsers] = useState([])
    const [userNum, setUserNum] = useState("0")
    const [infoText, setInfoText] = useState(<h1 className="text-center">Search user by their username or email.</h1>)

    const navigate = useNavigate()
    
    function searchUser(parameter) {
        if(parameter.trim()==="") {
            return;
        }

        setInfoText("")

        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        if(searchBy==="username") {
            axios.post(`${REACT_APP_BASE_URL}user/search/username`, {parameter: parameter}, config).then(response=> {
                setUsers(response.data);
                setUserNum(response.data.length)

            });
        } else if(searchBy==="email") {
            axios.post(`${REACT_APP_BASE_URL}user/search/email`, {parameter: parameter}, config).then(response=> {
                setUsers(response.data);
                setUserNum(response.data.length)

            });
        }
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-3">   
                    <div className="post-nav d-flex justify-content-around align-items-center">
                        <h1 className="btn" style={searchBy === "username" ? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {setSearchBy("username")}}>Username</h1>      
                        <h1 className="text-center">{userNum}</h1>       
                        <h1 className="btn" style={searchBy === "email" ? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {setSearchBy("email")}}>Email</h1>                 
                    </div>
                    <input type="text" className="form-control my-3" id="searchUser-input" placeholder="Search User" onChange={(e)=> {searchUser(e.target.value)}}></input>                  
                    {users.map((singleUser)=> {
                        return(
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex justify-content-start align-items-center my-2">
                                    <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleUser.profile_pic} alt="ProfilePic"/>
                                    <div>                                        
                                        <h2>{singleUser.username}</h2>
                                        <h4>{singleUser.email}</h4>
                                    </div>
                                </div> 
                                <button type="button" className="btn lR-button" onClick={()=> {navigate("/profile-main/" + singleUser._id)}}>View profile</button>
                            </div>
                        )
                    })}
                   {infoText}
                </div> 
            </div>
        </div>
    )
}

export default Search;