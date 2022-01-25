import { Component } from "react/cjs/react.production.min";
import { useState } from "react";
import axios from "axios"; 
import LoggedOutHeader from "./LoggedInHeader";

class Home extends Component {
    render() {
        return (
            <div>
                <LoggedOutHeader></LoggedOutHeader>

            </div>
        )
    }
}

export default Home;