import { useEffect, useState } from "react";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";
import { NavLink } from "react-router-dom";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Notification = ()=> {
    const [notificationsData, setNotificationsData] = useState([])
    const [notificationNum, setNotificationNum] = useState("")
    const [usSeen, setUnSeen] = useState(true)
    const [noNotifications, setNoNotifications] = useState("")

    useEffect(()=> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }      
        }
        axios.all([
            axios.get(`${REACT_APP_BASE_URL}notifications/get/unseen`, config), 
            axios.get(`${REACT_APP_BASE_URL}notifications/getNum`, config), 
        ])
        .then(axios.spread((...responses)=> {
            console.log(responses[0].data)
            setNotificationsData(responses[0].data);
            if(responses[0].data.length===0) {
                setNoNotifications(
                    <h2 className="text-center mb-3">No notifications yet.</h2>
                )
            } else {
                setNoNotifications("")
            }     
            setNotificationNum(responses[1].data)     
        }))
    }, [])

    function viewNSource(nData) {
        console.log(nData)
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                   {notificationsData.map((singleNotification)=> {
                        return (
                            <div className="comment-div d-flex justify-content-between align-items-center" key={singleNotification._id}>
                                 <div className="d-flex justify-content-start align-items-center my-2">
                                    <img className="profile-pic me-3" src={REACT_APP_PROFILE_PIC_URL + singleNotification.notification_generator.profile_pic} alt="ProfilePic"/>
                                    <div>                                        
                                        <h2>{singleNotification.notification_for}</h2>
                                        <h4>{singleNotification.notification}</h4>
                                    </div>
                                </div> 
                                {
                                    singleNotification.notification_for === "Follow"
                                    ?
                                    <button type="button" className="btn lR-button" onClick={()=> {viewNSource(singleNotification)}}>View profile</button>
                                    :
                                    <button type="button" className="btn lR-button" onClick={()=> {viewNSource(singleNotification)}}>View post</button>
                                }
                            </div>
                        )
                   })}
                   {noNotifications}
                </div> 
            </div>
        </div>
    )
}

export default Notification;