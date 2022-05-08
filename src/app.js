import React from 'react'
import {Routes, Route, BrowserRouter} from "react-router-dom"
import Header from './components/header'
import HomeContent from './components/homeContent'
import Weather from './components/weather'

export default function App() {
    const [darkMode, setDarkMode] = React.useState(false)
    return(
        <BrowserRouter>
            <Header darkMode={darkMode} setDarkMode={setDarkMode}/>
            <Routes>
                <Route path="/feather-weather" element={<HomeContent darkMode={darkMode}/>} />
                <Route path="/weather" element={<Weather darkMode={darkMode}/>} />
            </Routes>
        </BrowserRouter>
    )
}