import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/LoggedInHeader.css";
        
const { REACT_APP_BASE_URL } = process.env;        
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const LoggedInHeader = ()=> {
    const [profilePic, setProfilePic] = useState("")
    const [users, setUsers] = useState([])
    const [usersNum, setUsersNum] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            setProfilePic(REACT_APP_PROFILE_PIC_URL + result.data.userData.profile_pic);
        });
    }, [])

    function searchUser(username) {
        if(username.trim()==="") {
            return;
        }
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.post(`${REACT_APP_BASE_URL}user/search/username`, {parameter: username}, config).then(response=> {
            setUsers(response.data)
            setUsersNum(response.data.length)
        });
    }
    
    const logOut = ()=> {
        localStorage.clear();
        window.location.replace("/");
    }

    return (
        <div className="logged-in-nav d-flex justify-content-center py-2 px-3 mb-2">                
            <div className="logged-in-nav-container d-flex justify-content-between align-items-center">
                <h3 className="logged-in-logo-text">Memento</h3>
                <div className="logged-in-nav-searchUser input-group dropdown">
                    <input type="text" className="form-control" id="searchUser-input" data-bs-toggle="dropdown" aria-expanded="false" placeholder="Search User" onChange={(e)=> {searchUser(e.target.value)}}></input>
                    <ul className="dropdown-menu p-2" aria-labelledby="searchUser-input" id="searched-user">
                        <h2 className="text-center">{usersNum}</h2>
                        {users.map((singleUser)=> {
                            return(
                                <NavLink to={"/profile-main/" + singleUser._id}  key={singleUser._id}>
                                    <div className="d-flex justify-content-start align-items-center my-2">
                                        <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleUser.profile_pic} alt="ProfilePic"/>
                                        <div>                                        
                                            <h2>{singleUser.username}</h2>
                                            <h4>{singleUser.email}</h4>
                                        </div>
                                    </div> 
                                </NavLink>
                            )
                        })}
                    </ul>
                </div>
                <div className="logged-in-nav-navigators d-flex justify-content-between align-items-center">
                        <NavLink className="home-icon" to="/home" style={({ isActive }) => isActive ? { color: '#6200EA'} : { color: 'black' }}>
                            <i className="bi bi-house-fill"></i>
                        </NavLink>
                        <NavLink className="chat-icon" to="/search" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                            <i className="bi bi-search"></i>
                        </NavLink>
                        <NavLink className="plus-icon" to="/upload" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                            <i className="bi bi-plus-square-fill"></i>
                            </NavLink>
                        <NavLink className="bell-icon" to="/notification" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                            <i className="bi bi-bell-fill"></i>
                        </NavLink>
                        <div className="dropdown">
                            <img className="nav-profile-picture btn" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" src={profilePic} alt="Profile"/>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <NavLink className="person-icon dropdown-item" to="/profile-main" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                                        <i className="bi bi-person-fill"></i> Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="gear-icon dropdown-item" to="/profile-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                                        <i className="bi bi-gear-fill"></i> Setting
                                    </NavLink>
                                </li>
                                <li className="dropdown-divider"></li>
                                <li><a className="door-icon btn dropdown-item py-0" onClick={logOut}><i className="bi bi-door-open-fill"></i>Log Out</a></li>
                            </ul>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default LoggedInHeader;