import { Component } from "react/cjs/react.production.min";
import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from "./LoggedInHeader";

const Home = ()=> {
    useEffect(()=> {
        if(!localStorage.hasOwnProperty("userToken")) {
            window.location.replace("/");
        }   
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>

        </div>
    )
}


export default Home;