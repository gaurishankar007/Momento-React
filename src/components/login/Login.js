import { useState } from "react";
import axios from "axios";

const Login = ()=> {    
    const [username_email, setUsernameEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");

    const userLogin = (e)=> {
        e.preventDefault();
        const userData = {username_email, password};
        axios.post("http://localhost:4040/user/login", userData).then((result)=> {
            setResponse(result.data.message);
        });
    }

    return(
        <div>
            <form>
                <div className="text-center">{response}</div>
                <div className="form-group">
                    <label for="username">Username</label>
                    <input type="text" className="form-control" id="username"  placeholder="Enter a username....." onChange={(e)=>setUsernameEmail(e.target.value)}/>
                </div>  
                <div className="form-group">
                    <label for="password">Password</label>
                    <input type="text" className="form-control" id="password"  placeholder="Enter a password....." onChange={(e)=>setPassword(e.target.value)}/>
                </div>  
                <button type="btn" className="btn btn-primary mt-2 text-center" onClick={userLogin}>Login</button>
            </form>
        </div>
    )
}

export default Login;