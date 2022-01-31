import { Component } from "react/cjs/react.production.min";
import { Link, NavLink } from "react-router-dom";
import "../css/LoggedInHeader.css";
import ProfilePicture from "../images/defaultProfile.png";

class LoggedInHeader extends Component {
    render() {
        const logOut = ()=> {
            if(localStorage.hasOwnProperty("userToken")) {
                localStorage.removeItem("userToken");
            }        
        }

        return (
            <div className="logged-in-nav d-flex justify-content-center py-2 px-3 mb-2">                
                <div className="logged-in-nav-container d-flex justify-content-between align-items-center">
                    <h3 className="logged-in-logo-text">Memento</h3>
                    <div className="logged-in-nav-searchUser input-group">
                        <input type="text" className="form-control" id="searchUser-input" placeholder="Search" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default"><i className="bi bi-search"></i></span>
                        </div>
                    </div>
                    <div className="logged-in-nav-navigators d-flex justify-content-between align-items-center">
                            <NavLink className="home-icon" to="/home" style={({ isActive }) => isActive ? { color: '#6200EA'} : { color: 'black' }}>
                                <i className="bi bi-house-fill"></i>
                            </NavLink>
                            <NavLink className="chat-icon" to="/chat-lists" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                                <i className="bi bi-chat-text-fill"></i>
                                </NavLink>
                            <NavLink className="plus-icon" to="/upload" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                                <i className="bi bi-plus-square-fill"></i>
                                </NavLink>
                            <NavLink className="bell-icon" to="/notification" style={({ isActive }) => isActive ? { color: '#6200EA' } : { color: 'black' }}>
                                <i className="bi bi-bell-fill"></i>
                            </NavLink>
                            <div className="dropdown">
                                <img className="nav-profile-picture dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" src={ProfilePicture} alt="Profile"/>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <NavLink className="person-icon dropdown-item" to="/home-profile" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                                            <i className="bi bi-person-fill"></i> Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="gear-icon dropdown-item" to="/user-setting" style={({ isActive }) => isActive ? { color:"white", backgroundColor: '#6200EA', } : { color: 'black', backgroundColor: 'white'}}>
                                            <i className="bi bi-gear-fill"></i> Setting
                                        </NavLink>
                                    </li>
                                    <li className="dropdown-divider"></li>
                                    <li><Link className="door-icon dropdown-item py-0" to="/" onClick={logOut}><i className="bi bi-door-open-fill"></i> Log Out</Link></li>
                                </ul>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoggedInHeader;