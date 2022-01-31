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
import Notification from "./Notification";
import HomeProfile from "./profile/HomeProfile";
import PersonalDetails from "./profile/PersonalDetails";
import ChatList from "./chat/ChatList";
import Upload from "./Upload";
import UserSetting from "./setting/UserSetting";

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
                    <Route path="/chat-lists" element={<ChatList/>}/>                   
                    <Route path="/upload" element={<Upload/>}/>
                    <Route path="/notification" element={<Notification/>}/>
                    <Route path="/home-profile" element={<HomeProfile/>}/>
                    <Route path="/user-setting" element={<UserSetting/>}/>
                    <Route path="/personal-details" element={<PersonalDetails/>}/> 
                </Routes>
            </div>
        )
    }
}

export default Middle;

/*
<-----The use of exact in Route----->

For example, imagine we had a Users component that displayed a list of users. We also have a CreateUser component that is used to create users. The url for CreateUsers should be nested under Users. So our setup could look something like this:
<Switch>
  <Route path="/users" component={Users} />
  <Route path="/users/create" component={CreateUser} />
</Switch>

Now the problem here, when we go to http://app.com/users the router will go through all of our defined routes and return the FIRST match it finds. So in this case, it would find the Users route first and then return it. All good.
But, if we went to http://app.com/users/create, it would again go through all of our defined routes and return the FIRST match it finds. React router does partial matching, so /users partially matches /users/create, so it would incorrectly return the Users route again!

The exact param disables the partial matching for a route and makes sure that it only returns the route if the path is an EXACT match to the current url.

So in this case, we should add exact to our Users route so that it will only match on /users:
<Switch>
  <Route exact path="/users" component={Users} />
  <Route path="/users/create" component={CreateUser} />
</Switch>

*/