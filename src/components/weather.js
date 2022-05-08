import "../style.css"
import React from 'react'
import Axios from 'axios'
import { useState } from 'react';
import { fetchPlace } from './fetchPlace';
import Forecast from "./forecast";


export default function Weather({darkMode}) {
    const [city, setCity] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [autocompleteErr, setAutocompleteErr] = useState("");
    const [weatherComp, setWeatherComp] = useState();
    const [phases, setPhases] = useState(false)
    const countryData = require('../countryCode.json')
    const usStateData = require('../states_hash.json')
    const locationObject = {
        "Country" : "",
        "City" : "",
        "State" : ""
    }
    
    const handleCityChange = async (e) => {
        setCity(e.target.value);
        if (!city) return;
    
        const res = await fetchPlace(city);
        !autocompleteCities.includes(e.target.value) &&
        res.features &&
        setAutocompleteCities(res.features.map((place) => place.place_name));
        res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
    }

    function displayWeatherData(dataObj) {
        console.log(dataObj)
        console.log(dataObj["current"]["dt"])
        setPhases(prev => !prev)
        setWeatherComp(<Forecast darkMode={darkMode} weatherData={dataObj}/>)
    }

    function getOpenWeatherGeo(obj) {
        if (obj["State"] === "") {
            Axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${obj["City"]},${obj["Country"]}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`).then(
                (response) => {
                    return Axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${response["data"][0]["lat"]}&lon=${response["data"][0]["lon"]}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`).then(
                        (response) => {
                            displayWeatherData(response["data"])
                        }
                    )
                }
            )
        } else {
            Axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${obj["City"]},${obj["State"]},${obj["Country"]}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`).then(
                (response) => {
                    return Axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${response["data"][0]["lat"]}&lon=${response["data"][0]["lon"]}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`).then(
                        (response) => {
                            displayWeatherData(response["data"])
                        }
                    )
                }
            )
        }
    }

    function handleOnClick() {
        const cityArray = city.split(", ")
        locationObject["City"] = cityArray[0]
        if (cityArray[cityArray.length-1] === "United States") {
            locationObject["Country"] = "US";
            locationObject["State"] = Object.keys(usStateData).find(key => usStateData[key] === cityArray[cityArray.length-2]);
            getOpenWeatherGeo(locationObject)
        } else {
            locationObject["Country"] = Object.keys(countryData).find(key => countryData[key] === cityArray[cityArray.length-1])
            getOpenWeatherGeo(locationObject)
        }
    }

    return (
        <div className="placesAutocomplete">
            <div className={phases === true ? "nothing" : "placesAutocomplete--inputWrap"}>
                <label htmlFor="city" className="label">
                {autocompleteErr && (
                    <span className="inputError">{autocompleteErr}</span>
                )}
                </label>
                <input
                list="places"
                type="text"
                className="city"
                name="city"
                onChange={handleCityChange}
                value={city}
                required
                pattern={autocompleteCities.join("|")}
                autoComplete="off"
                />
                <datalist id="places">
                {autocompleteCities.map((city, i) => (
                    <option key={i}>{city}</option>
                ))}
                </datalist>
                <button onClick={handleOnClick}>Weather</button>
            </div>
            <div className={phases === true ? "" : "forecast--complete"}>
                {weatherComp}
            </div>
        </div>
      )
}