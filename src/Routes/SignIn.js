import { auth, googleProvider} from "../Config/firebase"
import { signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"




export const SignIn = () => {

    const navigate = useNavigate();

    const signIn = async () => {
        await signInWithPopup(auth, googleProvider);
        navigate("/dashboard")
    }
 
    return <div className="sign-in">
        <div className="middle-box">
            <div className="top-box">
                <img src={require("../images/logo-removebg-preview.png")} alt="logo"/>
                <h1> Sign In</h1>
            </div>
            <button onClick={signIn}> <img src={require("../images/google-logo.png")}/>Sign In with Google </button>
            <p> Don't have an account? <a href="/sign-up"> Sign up </a></p>
        </div>
    </div>
}