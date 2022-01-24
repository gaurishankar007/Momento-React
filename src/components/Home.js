import { Component } from "react/cjs/react.production.min";
import { useState } from "react";
import axios from "axios"; 
import LoginHeader from "./LoginHeader";

class Home extends Component {
    render() {
        return (
            <div>
                <LoginHeader></LoginHeader>

            </div>
        )
    }
}

export default Home;