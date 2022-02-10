import { NavLink } from "react-router-dom";
import "../../css/SettingNav.css";

const SettingNav = ()=> {
    return (
        <div className="setting-nav">  
                <NavLink to="/profile-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Profile Picture
                </NavLink>
                <NavLink to="/cover-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Cover Picture
                </NavLink>
                <NavLink  to="/password-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Password
                </NavLink>
                <NavLink to="/user-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    User Information
                </NavLink>
                <NavLink to="/personal-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Personal Information
                </NavLink>
                <NavLink to="/address-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Address Information
                </NavLink>
        </div>
    )
}

export default SettingNav;