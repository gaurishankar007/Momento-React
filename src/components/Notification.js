import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;

const Notification = ()=> {
    const [notificationsData, setNotificationsData] = useState([])
    const [notificationNum, setNotificationNum] = useState("")
    const [unSeen, setUnSeen] = useState(true)
    const [noNotifications, setNoNotifications] = useState("")
    const [response, setResponse] = useState("")

    const navigate = useNavigate()

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
            setNotificationsData(responses[0].data);
            if(responses[0].data.length===0) {
                setNoNotifications(
                    <h1 className="text-center mb-3">No new notifications yet.</h1>
                )
            }   
            setNotificationNum(responses[1].data)     
        }))
    }, [])

    function toggleNDiv(nType) {
        setResponse("")
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }

        if(nType==="unSeen") {
            axios.get(`${REACT_APP_BASE_URL}notifications/get/unSeen`, config)
            .then((response)=> {
                setNotificationsData(response.data)
                if(response.data.length===0) {
                    setNoNotifications(
                        <h1 className="text-center mb-3">No new notifications yet.</h1>
                    )
                } else {
                    setNoNotifications("")
                }
            })   
            setUnSeen(true)       

        } else if(nType==="seen") {
            setUnSeen(false)

            axios.get(`${REACT_APP_BASE_URL}notifications/get/seen`, config)
            .then((response)=> {
                setNotificationsData(response.data)
                if(response.data.length===0) {
                    setNoNotifications(
                        <h1 className="text-center mb-3">No notifications seen yet.</h1>
                    )
                } else {
                    setNoNotifications("")
                }
            })          
        }
    }

    const seenUnseen = ()=> {
        setResponse("")
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.put(`${REACT_APP_BASE_URL}notifications/seen/unseen`, {}, config)
        .then(()=> {
            axios.all([
                axios.get(`${REACT_APP_BASE_URL}notifications/get/unseen`, config), 
                axios.get(`${REACT_APP_BASE_URL}notifications/getNum`, config), 
            ])
            .then(axios.spread((...responses)=> {
                setNotificationsData(responses[0].data);
                if(responses[0].data.length===0) {
                    setNoNotifications(
                        <h1 className="text-center mb-3">No new notifications yet.</h1>
                    )
                }   
                setNotificationNum(responses[1].data)     
            }))
        })     
    }

    const deleteSeen = ()=> {
        setResponse("")
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }
        axios.delete(`${REACT_APP_BASE_URL}notifications/delete/seen`, config)
        .then(()=> {            
            axios.all([
                axios.get(`${REACT_APP_BASE_URL}notifications/get/seen`, config), 
                axios.get(`${REACT_APP_BASE_URL}notifications/getNum`, config), 
            ])
            .then(axios.spread((...responses)=> {
                setNotificationsData(responses[0].data);
                if(responses[0].data.length===0) {
                    setNoNotifications(
                        <h1 className="text-center mb-3">No notifications seen yet.</h1>
                    )
                }   
                setNotificationNum(responses[1].data)     
            }))
        })            
    }

    function viewNSource(sType, sId) {
        setResponse("")
        if(sId===null) {
            setResponse("The post is no longer available.")
            return
        }

        if(sType==="User") {
            navigate("/profile-main/"+sId)
        } else if (sType==="Post") {
            navigate("/post-view/"+sId._id)
        }
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <div className="post-nav d-flex justify-content-around align-items-center">
                        <i className="btn bi bi-eye-slash-fill" style={unSeen ? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {toggleNDiv("unSeen")}}></i>      
                        <h2> 
                            {
                                unSeen 
                                ?
                                notificationNum.unSeenNum
                                :
                                notificationNum.seenNum
                            }
                        </h2>             
                        <i className="btn bi bi-eye-fill" style={!unSeen ? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {toggleNDiv("seen")}}></i>                 
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        {
                            unSeen 
                            ?
                                notificationNum.unSeenNum === "0"
                                ?
                                <div></div>
                                :
                                <button type="button" className="btn lR-button" onClick={seenUnseen}>Mark as read</button>
                            :
                                notificationNum.seenNum === "0"
                                ?
                                <div></div>
                                :
                                <button type="button" className="btn lR-button" onClick={deleteSeen}>Remove all</button>
                        }
                    </div>
                    <div className="suggestion-message text-center">{response}</div>
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
                                    <button type="button" className="btn lR-button" onClick={()=> {viewNSource("User", singleNotification.notification_generator._id)}}>View profile</button>
                                    :
                                    <button type="button" className="btn lR-button" onClick={()=> {viewNSource("Post", singleNotification.target_post)}}>View post</button>
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