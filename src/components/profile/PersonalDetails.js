import { Component } from "react/cjs/react.production.min";
import { useState } from "react";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";

class PersonalDetails extends Component {
    render() {
        return (
            <div>
                <LoggedInHeader></LoggedInHeader>

            </div>
        )
    }
}

export default PersonalDetails;