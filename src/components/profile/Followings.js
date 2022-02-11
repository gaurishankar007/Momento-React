import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from "../Header/LoggedInHeader";
import "../../css/ProfileMain.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const FollowedUsers =()=> {
    const [followingsData, setFollowingsData] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        axios.get(`${REACT_APP_BASE_URL}followedUsers/get/my`, config).then(response=> {
            setFollowingsData(response.data);
        });
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">   
            </div>

        </div>
    )
}

export default FollowedUsers;