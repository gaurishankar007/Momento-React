import { useState, useEffect } from "react";
import axios from "axios"; 
import LoggedInHeader from "./Header/LoggedInHeader";

const Home = ()=> {
    useEffect(()=> {
    }, [])

    return (
        <div>
            <LoggedInHeader></LoggedInHeader>

        </div>
    )
}


export default Home;