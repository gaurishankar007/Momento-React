import { Routes, Route} from "react-router-dom";
import { Component } from "react/cjs/react.production.min";
import VerifyUnauthenticated from "./auth/VerifyUnauthenticated";
import VerifyUser from "./auth/VerifyUser";
import VerifyAdmin from "./auth/VerifyAdmin";

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
import Search from "./Search";
import Upload from "./Upload";
import UserSetting from "./setting/UserSetting";
import PersonalSetting from "./setting/PersonalSetting";
import AddressSetting from "./setting/AddressSetting";
import PasswordSetting from "./setting/PasswordSetting";
import ProfileSetting from "./setting/ProfilePicSetting";
import CoverSetting from "./setting/CoverPicSetting";
import HomeAdmin from "./HomeAdmin";

class Middle extends Component {
    render() {
        return(
            <div>
                <Routes>

                    {/* Unauthenticated routes */}
                    <Route path="/" element={<VerifyUnauthenticated> <Login/> </VerifyUnauthenticated>}/>
                    <Route path="/forgot-password" element={<VerifyUnauthenticated> <ForgotPassword/> </VerifyUnauthenticated>}/>
                    <Route path="/reset-password" element={<VerifyUnauthenticated> <ResetPassword/> </VerifyUnauthenticated>}/>
                    <Route path="/user-registration" element={<VerifyUnauthenticated> <User/> </VerifyUnauthenticated>}/>

                    {/* User routes */}
                    <Route path="/profile-registration" element={<VerifyUser> <Profile/> </VerifyUser>}/>
                    <Route path="/cover-registration" element={<VerifyUser> <Cover/> </VerifyUser>}/>
                    <Route path="/personal-information-registration" element={<VerifyUser> <Personal/> </VerifyUser>}/>
                    <Route path="/address-registration" element={<VerifyUser> <Address/> </VerifyUser>}/>
                    <Route path="/home" element={<VerifyUser> <Home/>  </VerifyUser>}/>                   
                    <Route path="/search" element={<VerifyUser> <Search/> </VerifyUser>}/>                   
                    <Route path="/upload" element={<VerifyUser> <Upload/> </VerifyUser>}/>
                    <Route path="/notification" element={<VerifyUser> <Notification/> </VerifyUser>}/>
                    <Route path="/home-profile" element={<VerifyUser> <HomeProfile/> </VerifyUser>}/>
                    <Route path="/profile-setting" element={<VerifyUser> <ProfileSetting/> </VerifyUser>}/>
                    <Route path="/cover-setting" element={<VerifyUser> <CoverSetting/> </VerifyUser>}/>
                    <Route path="/password-setting" element={<VerifyUser> <PasswordSetting/> </VerifyUser>}/>
                    <Route path="/user-setting" element={<VerifyUser> <UserSetting/> </VerifyUser>}/>
                    <Route path="/personal-setting" element={<VerifyUser> <PersonalSetting/> </VerifyUser>}/>
                    <Route path="/address-setting" element={<VerifyUser> <AddressSetting/> </VerifyUser>}/>
                    <Route path="/personal-details" element={<VerifyUser> <PersonalDetails/> </VerifyUser>}/> 

                    {/* Admin routes */}
                    <Route path="/home-admin" element={<VerifyAdmin> <HomeAdmin/> </VerifyAdmin>} />

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