import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios"; 
import AdminHeader from "./AdminHeader";
import "../../css/AdminHome.css";

const { REACT_APP_BASE_URL } = process.env;
const { REACT_APP_PROFILE_PIC_URL } = process.env;
const { REACT_APP_POST_URL } = process.env;

const AdminHome = ()=> {
    const [searchBy, setSearchBy] = useState("reporter")
    const [all, setAll] = useState(true)
    const [reports, setReports] = useState([])
    const [reportsNum, setReportsNum] = useState("0")
    const [infoText, setInfoText] = useState("")

    useEffect(()=>{
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('adminToken')
            }
        }
        axios.get(`${REACT_APP_BASE_URL}reports/get`, config).then(response=> {
            setReports(response.data)
            setReportsNum(response.data.length)
            if(response.data.length===0) {
                setInfoText(<h1 className="sBy text-center">No reports found.</h1>)
            }
            console.log(response.data)
        });
    }, [])
    
    function allReport() {
        setAll(true)
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('adminToken')
            }
        }
        axios.get(`${REACT_APP_BASE_URL}reports/get`, config).then(response=> {
            setReports(response.data)
            setReportsNum(response.data.length)
            if(response.data.length===0) {
                setInfoText(<h1 className="sBy text-center">No reports found.</h1>)
            }
        });
    }

    function searchReport(parameter) {
        if(parameter.trim()==="") {
            return;
        }
        setInfoText("")
        setAll(false)

        if(searchBy==="reported-user") {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('adminToken')
                }
            }
            axios.post(`${REACT_APP_BASE_URL}reports/search/reportedUser`, {parameter}, config).then(response=> {
                setReports(response.data)
                setReportsNum(response.data.length)
                if(response.data.length===0) {
                    setInfoText(<h1 className="sBy text-center">No reports found.</h1>)
                }
            });
        } else if(searchBy==="reporter") {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('adminToken')
                }
            }
            axios.post(`${REACT_APP_BASE_URL}reports/search/reporter`, {parameter}, config).then(response=> {
                setReports(response.data)
                setReportsNum(response.data.length)
                if(response.data.length===0) {
                    setInfoText(<h1 className="sBy text-center">No reports found.</h1>)
                }
            });
        }
    }

    function blockUser(user_id) {

    }

    function unBlockUser(user_id) {
        
    }

    return (
        <div>
            <AdminHeader></AdminHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="upload-div d-flex flex-column pb-3" id="followedPost-div">    
                    <div className="post-nav d-flex justify-content-around align-items-center">     
                        <h1 className="sBy btn" style={searchBy === "reporter" ? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {setSearchBy("reporter")}}>Reporter</h1> 
                        <h1 className="sBy text-center">{reportsNum}</h1>         
                        <h1 className="sBy btn" style={searchBy === "reported-user" ? { color: '#6200EA'} : { color: 'black' }} onClick={()=> {setSearchBy("reported-user")}}>Reported User</h1>               
                    </div>
                    <input type="text" className="form-control my-3" id="searchUser-input" placeholder="Search by reporter username" onChange={(e)=> {searchReport(e.target.value)}}></input>   
                    {
                        all 
                        ?
                        <div></div>
                        :
                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn lR-button" id="report-post" onClick={()=> {allReport()}}>Show All</button>
                        </div>
                    }               
                    {reports.map((singleReport)=> {
                        return(
                            <div className="singlePost-div d-flex flex-column mt-2" key={singleReport._id}> 
                                {
                                    singleReport.reported_post === null
                                    ?
                                    <div className="suggestion-message text-center my-2">The post has been removed by the reported user.</div>  
                                    :        
                                    <div className=""> 
                                        <div className="d-flex justify-content-between align-items-center px-2 my-1">
                                            <div className="d-flex align-items-center">
                                                <img className="postUser-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + singleReport.reported_post.user_id.profile_pic} alt="user-profilePic"/>  
                                                <label className="fw-bold postUser-username">{singleReport.reported_post.user_id.username}</label>
                                            </div>
                                            {
                                                singleReport.reported_post.user_id.is_active
                                                ?
                                                <button type="button" className="btn lR-button" id="report-post" onClick={()=> {blockUser( singleReport.reported_post.user_id._id)}}>Block reported user</button>
                                                :
                                                <button type="button" className="btn lR-button" id="report-post" onClick={()=> {unBlockUser( singleReport.reported_post.user_id._id)}}>UnBlock reported user</button>
                                            }                                            
                                        </div>
                                        <Carousel interval={null}>     
                                            {singleReport.reported_post.attach_file.map(Image=> {
                                                return (                  
                                                    <Carousel.Item key={Image}> 
                                                        <img className="d-block w-100" src={REACT_APP_POST_URL + Image} alt="PostImages"/>
                                                    </Carousel.Item>
                                                )
                                            })}
                                        </Carousel>             
                                        <label className="mb-2"><label className="fw-bold mx-2 mt-2">{singleReport.reported_post.caption}</label><label>{singleReport.reported_post.description}</label></label>
                                    </div>    
                                } 
                                <div className="d-flex justify-content-between align-items-center px-2 my-1">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <img className="postUser-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + singleReport.reporter.profile_pic} alt="ProfilePic"/>                                      
                                        <label className="fw-bold postUser-username">{singleReport.reporter.username}</label>
                                    </div> 
                                    {
                                        singleReport.reporter.is_active
                                        ?             
                                        <button type="button" className="btn lR-button" id="report-post" onClick={()=> {blockUser( singleReport.reporter._id)}}>Block reporter</button>
                                        :
                                        <button type="button" className="btn lR-button" id="report-post" onClick={()=> {unBlockUser( singleReport.reporter._id)}}>UnBlock reporter</button>                       
                                    }
                                </div>
                                <div className="d-flex flex-column px-2 my-2">  
                                    {singleReport.report_for.map((singleRF, index)=> {
                                       return (
                                           <h4 key={singleRF}>{index+1}. {singleRF}</h4>
                                       )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                   {infoText}
                </div> 
            </div>
        </div>
    )
}


export default AdminHome;