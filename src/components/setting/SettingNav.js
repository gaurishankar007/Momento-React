import { NavLink } from "react-router-dom";
import "../../css/SettingNav.css";

const SettingNav = ()=> {
    return (
        <div className="setting-nav d-flex flex-column justify-content-between align-items-start">  
                <NavLink to="/home" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Profile Picture
                </NavLink>
                <NavLink to="/home" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Cover Picture
                </NavLink>
                <NavLink  to="/home" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Password
                </NavLink>
                <NavLink to="/user-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    User Information
                </NavLink>
                <NavLink to="/chat-lists" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Personal Information
                </NavLink>
                <NavLink to="/upload" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Address Information
                </NavLink>
        </div>
    )
}

export default SettingNav;