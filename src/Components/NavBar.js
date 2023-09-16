import { useNavigate } from "react-router-dom"
import { auth } from "../Config/firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {react} from 'react'

export const NavBar = (props) => {


    const navigate = useNavigate();
    const [userName, setUserName] = useState();

    const SignUp = () => {
        console.log(props.playerLeaving)
        navigate("/sign-up")
    }

    const SignIn = () => {
        console.log(props.playerLeaving);
        navigate("/sign-in")
    }

    const SignOut = async () => {
        await signOut(auth);
        navigate("/")
    }

   

    useEffect(() => {
        if (auth.currentUser?.displayName) {
            setUserName(auth.currentUser.displayName)
        }
    }, [auth.currentUser])
    
    return <div className="nav-bar">
        <img src={require("../images/logo-removebg-preview.png")} alt="logo"/>
        <div className="right-nav-bar">
            { userName? <div> <h1> Welcome, {userName} </h1> <button onClick={SignOut}> Sign Out</button></div> : 
            <div><button className="nav-bar-button" onClick={SignUp}> Sign Up</button>
            <button className="nav-bar-button"onClick={SignIn}> Sign In </button></div>
            }
        </div>
    </div>
}