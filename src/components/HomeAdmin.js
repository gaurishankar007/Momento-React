import { Component } from "react/cjs/react.production.min";
import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";

const HomeAdmin = ()=> {
    useEffect(()=> {
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>

        </div>
    )
}


export default HomeAdmin;