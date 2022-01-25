import { Component } from "react/cjs/react.production.min";
import "../css/LoggedOutHeader.css";

class LoggedOutHeader extends Component {
    render() {
        return (
            <div className="logged-out-nav d-flex justify-content-center">  
                <h1 className="logged-out-logo-text">Memento</h1>
            </div>
        )
    }
}

export default LoggedOutHeader;