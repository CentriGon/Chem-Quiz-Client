import { auth, googleProvider} from "../Config/firebase"
import { signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"




export const SignUp = () => {

    const navigate = useNavigate();

    const signUp = async () => {
        await signInWithPopup(auth, googleProvider);
        navigate("/dashboard")
    }
 
    return <div className="sign-in">
        <div className="middle-box">
            <div className="top-box">
                <img src={require("../images/logo-removebg-preview.png")} alt="logo"/>
                <h1> Sign Up</h1>
            </div>
            <button onClick={signUp}> <img src={require("../images/google-logo.png")}/>Sign Up with Google </button>
            <p> Already Have an Account? <a href="/sign-in"> Sign in</a></p>
        </div>
    </div>
}