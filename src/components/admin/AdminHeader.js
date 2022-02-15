import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
        
const { REACT_APP_BASE_URL } = process.env;        
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const AdminHeader = ()=> {
    const [profilePic, setProfilePic] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('adminToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}user/checkType`, config).then(result=> {
            setProfilePic(REACT_APP_PROFILE_PIC_URL + result.data.userData.profile_pic);
        });
    }, [])
    
    const logOut = ()=> {
        localStorage.clear();
        window.location.replace("/");
    }

    return (
        <div className="logged-in-nav d-flex justify-content-center py-2 px-3 mb-2">                
            <div className="logged-in-nav-container d-flex justify-content-between align-items-center">
                <h3 className="logged-in-logo-text">Memento</h3>
                <div className="logged-in-nav-navigators d-flex align-items-center">
                        <NavLink className="home-icon me-4" to="/admin-home" style={({ isActive }) => isActive ? { color: '#6200EA'} : { color: 'black' }}>
                            <i className="bi bi-house-fill"></i>
                        </NavLink>
                        <NavLink className="chat-icon me-4" to="/admin-search" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                            <i className="bi bi-search"></i>
                        </NavLink>
                        <div className="dropdown">
                            <img className="nav-profile-picture btn me-4" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" src={profilePic} alt="Profile"/>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <NavLink className="gear-icon dropdown-item" to="/admin-profile-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
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

export default AdminHeader;