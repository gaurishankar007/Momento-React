import { Component } from "react/cjs/react.production.min";
import "../css/LoggedOutHeader.css";

class LoggedOutHeader extends Component {
    render() {
        return (
            <div className="logged-out-nav d-flex justify-content-center align-items-center py-2 mb-3">  
                <h2 className="logged-out-logo-text">Memento</h2>
            </div>
        )
    }
}

export default LoggedOutHeader;