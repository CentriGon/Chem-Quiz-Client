import { NavBar } from "../Components/NavBar"
import "../Styles/HomePage.css"
import { useNavigate } from "react-router-dom"

export const HomeScreen = () => {

    const navigate = useNavigate();

    const getStarted = () => {
        navigate("/dashboard")
    }

    return <div className="home-screen">
        <NavBar />
        <div className="hero-section">
            <div className="left-section">
                <h1> Learn Chemistry </h1>
                <button onClick={getStarted}> Get Started</button>
            </div>
            <img className="home-screen-logo" src={require("../images/front-image.png")} alt="erlynmeyer flask" />
        </div>
    </div>
    
}