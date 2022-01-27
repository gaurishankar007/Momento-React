import { Component } from "react/cjs/react.production.min";
import { useState } from "react";
import axios from "axios"; 
import LoggedInHeader from ".././LoggedInHeader";

class Settings extends Component {
    render() {
        return (
            <div>
                <LoggedInHeader></LoggedInHeader>

            </div>
        )
    }
}

export default Settings;