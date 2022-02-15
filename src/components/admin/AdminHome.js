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
        });
    }, [])
    
    function allReport() {
        setInfoText("")
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

    function deactivateUser(user_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('adminToken')
            }
        }
        axios.put(`${REACT_APP_BASE_URL}user/deactivate`, {user_id}, config).then(response=> {
            axios.get(`${REACT_APP_BASE_URL}reports/get`, config).then(response=> {
                setReports(response.data)
                setReportsNum(response.data.length)
            });  
        });
    }

    function activateUser(user_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('adminToken')
            }
        }
        axios.put(`${REACT_APP_BASE_URL}user/activate`, {user_id}, config).then(response=> {
            axios.get(`${REACT_APP_BASE_URL}reports/get`, config).then(response=> {
                setReports(response.data)
                setReportsNum(response.data.length)
            });  
        });
    }

    function deleteReport(report_id) {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('adminToken')
            }
        }
        axios.delete(`${REACT_APP_BASE_URL}report/delete/${report_id}`, config).then(response=> { 
            axios.get(`${REACT_APP_BASE_URL}reports/get`, config).then(response=> {
                setReports(response.data)
                setReportsNum(response.data.length)
                if(response.data.length===0) {
                    setInfoText(<h1 className="sBy text-center">No reports found.</h1>)
                }
            });                   
        });   
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
                        <div className="d-flex justify-content-center my-2">
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
                                    <div> 
                                        <div className="d-flex justify-content-between align-items-center px-2 my-1">
                                            <div className="d-flex align-items-center">
                                                <img className="postUser-profilePic me-3" src={REACT_APP_PROFILE_PIC_URL + singleReport.reported_post.user_id.profile_pic} alt="user-profilePic"/>  
                                                <label className="fw-bold postUser-username">{singleReport.reported_post.user_id.username}</label>
                                            </div>
                                            {
                                                singleReport.reported_post.user_id.is_active
                                                ?
                                                <button type="button" className="btn lR-button" id="report-post" onClick={()=> {deactivateUser(singleReport.reported_post.user_id._id)}}>Deactivate</button>
                                                :
                                                <button type="button" className="btn lR-button" id="report-post" onClick={()=> {activateUser(singleReport.reported_post.user_id._id)}}>Activate</button>
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
                                        <label className="px-2 mb-2"><label className="fw-bold mr-2 mt-2">{singleReport.reported_post.caption}</label><label>{singleReport.reported_post.description}</label></label>
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
                                        <button type="button" className="btn lR-button" id="report-post" onClick={()=> {deactivateUser(singleReport.reporter._id)}}>Deactivate</button>
                                        :
                                        <button type="button" className="btn lR-button" id="report-post" onClick={()=> {activateUser(singleReport.reporter._id)}}>Activate</button>                       
                                    }
                                </div>
                                <div className="d-flex flex-column px-2 my-2">  
                                    {singleReport.report_for.map((singleRF, index)=> {
                                       return (
                                           <label className="postUser-username" key={singleRF}>{index+1}. {singleRF}</label>
                                       )
                                    })}
                                </div>
                                <div className="d-flex justify-content-center mb-2">                                               
                                    <span className="delete-report btn bi bi-trash" onClick={()=> {deleteReport(singleReport._id)}}></span>
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