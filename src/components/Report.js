import { useState, useEffect } from "react";
import axios from "axios"; 
import { useParams } from "react-router-dom";
import LoggedInHeader from "./Header/LoggedInHeader";
import "../css/Report.css";

const { REACT_APP_BASE_URL } = process.env;

const Report =()=> {
    const {post_id} = useParams()
    const [reports, setReports] = useState([]);
    const [currentlySR, setCurrentlySR] = useState("");
    const [response, setResponse] = useState("");
    const [sResponse, setSResponse] = useState("");

    const reportOptions = [
        'Nudity or sexual activity',
        'Scam or fraud',
        'False information',
        'Bullying or harassment',
        'Intellectual property voilations',
        'Voilent content',
        'Innapropriate language',
        'Selling illegal or regulated goods',
        'Eating disorder',
        'Hate speech or symbol',
    ]

    function addReport(report_for) {
        setResponse("");
        setSResponse("");

        var tempReports = reports;
        if(!tempReports.includes(report_for)) {                    
            tempReports.push(report_for);
        }
        setReports(tempReports);
        setCurrentlySR("Currently added report: " + report_for)
    }    

    function removeReport(report_for) {
        setResponse("");
        setSResponse("");

        var tempReports = reports;
        if(tempReports.includes(report_for)) {                    
            tempReports.splice(tempReports.indexOf(report_for), 1);
        }
        setReports(tempReports);
        setCurrentlySR("Currently removed report: " + report_for)
    }

    function postReport() {
        if(reports.length===0) {
            setResponse("You have not selected any report options.");  
            return;
        }
        const reportData = {
            post_id: post_id,
            report_for: reports
        };
        
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('userToken')
            }
        }        
        axios.post(`${REACT_APP_BASE_URL}report/post`, reportData, config).then((result)=> {
            if(result.data.message==="Reported.") {
                setResponse("")
                setCurrentlySR("")
                setReports([])
                setSResponse("Your report has been registered.")
            }
            else {
                setResponse(result.data.message);          
            }
        });
    }

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>
            <div className="d-flex justify-content-center mb-5">  
                <div className="follow-div d-flex flex-column px-3 py-2">
                    <div className="mb-2">
                        <div className="suggestion-message text-center">{response}</div>           
                        <div className="success-message text-center">{sResponse}</div>  
                    </div>   
                    <h1 className="report-warning text-center">Unnecessary reports can block your account. Report the post very carefully.</h1>
                    <div className="csr my-2">{currentlySR}</div> 
                    {reportOptions.map((singleR=> {
                        return(
                            <div className="d-flex my-1" key={singleR}>                                                        
                                <span className="add-report bi bi-plus-circle-fill fw-bold me-2" onClick={()=>{addReport(singleR)}}/>
                                <label className="report-options">{singleR}</label>
                            </div>
                        )
                    }))}
                    {
                        reports.length > 0
                        ?
                        <h1 className="text-center my-2"><u>Selected Reports</u></h1>
                        :
                        <div></div>  
                    }                                        
                    {reports.map((singleSR)=> {
                        return(
                            <div className="d-flex align-items-center" key={singleSR}>                                                        
                                <span className="remove-report bi bi-dash-circle-fill fw-bold me-2" onClick={()=>{removeReport(singleSR)}}/>
                                <label className="report-options">{singleSR}</label>
                            </div>
                        )                                
                    })}
                    <div className="d-flex justify-content-center my-2">
                        <button className="btn lR-button report-button" onClick={()=>{postReport()}}>Report</button>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Report;