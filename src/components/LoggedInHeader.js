import { Component } from "react/cjs/react.production.min";
import "../css/LoggedInHeader.css";
import Logo from "../images/logo.png";

class LoggedInHeader extends Component {
    render() {
        return (
            <div className="logged-in-nav d-flex justify-content-center">                
                <img className="logged-in-logo-image me-2" src={Logo} alt="Memento"/>
                <h2 className="logged-in-logo-text">Memento</h2>
            </div>
        )
    }
}

export default LoggedInHeader;