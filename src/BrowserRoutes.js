import {BrowserRouter, Routes, Route} from "react-router-dom"
import { HomeScreen } from "./Routes/HomeScreen"
import { Dashboard } from "./Routes/Dashboard"
import { SignUp } from "./Routes/SignUp"
import { SignIn } from "./Routes/SignIn"
import "./Styles/Sign.css"


export const BrowserRoutes = () => {



    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomeScreen />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sign-up" element={<SignUp/>}/>
            <Route path="/sign-in" element={<SignIn/>}/>
        </Routes>
    </BrowserRouter>
}