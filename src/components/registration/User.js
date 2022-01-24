import { useState } from "react";
import axios from "axios";

const User = ()=> {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [response, setResponse] = useState("");

    const userRegister = (e)=> {
        e.preventDefault();
        const userData = {username, password, email, phone};
        axios.post("http://localhost:4040/user/register", userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>
            <h1 className="text-center">You are welcomed to Momento</h1>
            <form>
                <div className="text-center">{response}</div>
                <div className="form-group">
                    <label for="username">Username</label>
                    <input type="text" className="form-control" id="username"  placeholder="Enter a username....." onChange={(e)=>setUsername(e.target.value)}/>
                </div>  
                <div className="form-group">
                    <label for="password">Password</label>
                    <input type="text" className="form-control" id="password"  placeholder="Enter a password....." onChange={(e)=>setPassword(e.target.value)}/>
                </div>         
                <div className="form-group">
                    <label for="email">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email address....." onChange={(e)=>setEmail(e.target.value)}/>
                    <small id="emailHelp" class="form-text text-muted">Useful for resetting password.</small>
                </div>                              
                <div className="form-group">
                    <label for="address">Phone</label>
                    <input type="number" className="form-control" id="address"  placeholder="Enter your phone number....." onChange={(e)=>setPhone(e.target.value)}/>
                </div>
                <button type="btn" className="btn btn-primary mt-2 text-center" onClick={userRegister}>Sign Up</button>
            </form>
        </div>
    )
}

export default User;