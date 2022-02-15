import { NavLink } from "react-router-dom";
import "../../css/SettingNav.css";

const ASettingNav = ()=> {
    return (
        <div className="setting-nav" id="admin-setting-nav">  
                <NavLink className="my-2" to="/admin-profile-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    Profile Picture
                </NavLink>
                <NavLink className="my-2" to="/admin-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                    User Information
                </NavLink>
        </div>
    )
}

export default ASettingNav;