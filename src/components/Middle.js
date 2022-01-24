import { Routes, Route} from "react-router-dom";
import { Component } from "react/cjs/react.production.min";
import Login from "./login/Login";
import ForgotPassword from "./login/ForgotPassword";
import ResetPassword from "./login/ResetPassword";
import User from "./registration/User";
import Profile from "./registration/Profile";
import Cover from "./registration/Cover";
import Personal from "./registration/Personal";
import Address from "./registration/Address";
import Home from "./Home";

class Middle extends Component {
    render() {
        return(
            <div>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/reset-password" element={<ResetPassword/>}/>
                    <Route path="/user-registration" element={<User/>}/>
                    <Route path="/profile-registration" element={<Profile/>}/>
                    <Route path="/cover-registration" element={<Cover/>}/>
                    <Route path="/personal-information-registration" element={<Personal/>}/>
                    <Route path="/address-registration" element={<Address/>}/>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </div>
        )
    }
}

export default Middle;