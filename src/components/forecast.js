export default function Forecast({darkMode, weatherData}) {
    function translateWeather(kelvin) {
        return Math.trunc((kelvin - 273.15) * (9/5) + 32)
    }

    function unixToCurrentTime(time) {
        const currentTime = new Date(time * 1000);
        return currentTime.toLocaleString("en-US", {timeZoneName: "short"})
    }

    function unixToPST(time) {
        const date = new Date(time * 1000);
        const hour = date.getHours();
        
        if (Math.floor(hour / 12) === 1) {
            if (hour - 12 === 0) {
                return 12 + " PM"
            } else {
                return (hour - 12) + " PM"
            }
            
        } else {
            if (hour === 0) {
                return 12 + " AM"
            } else {
                return hour + " AM"
            }
        }
    }

    function unixToDate(time) {
        const date = new Date (time * 1000);
        return date.toLocaleString("en-US", {month: "numeric"}) + "/" + date.toLocaleString("en-US", {day: "numeric"})
    }

    function unixToDayName(time) {
        const date = new Date(time * 1000);
        return date.toLocaleString("en-US", {weekday: "long"})
    }

    return(
        <div className="forecast--complete">
            <div className={darkMode === true ? "card card--main dark--weather forecast--complete" : "card card--main forecast--complete"}>
                <div className={darkMode === true ? "card-body main--weather dark--weather" : "card-body main--weather"}>
                    <h2>As of: {unixToCurrentTime(weatherData["current"].dt)}</h2>
                    <h1>{translateWeather(weatherData["current"]["temp"])} &#8457;</h1>
                    <img src={`https://openweathermap.org/img/wn/${weatherData["current"]["weather"][0]["icon"]}@4x.png`} alt="Weather icon"/>
                </div>
            </div>
            <div className="container-fluid py-2 weather--box">
                <div className="row flex-nowrap">
                    {weatherData["hourly"].map(hour => 
                        <div className="col-3 sidescroll--box">
                            <div className={darkMode === true ? "card card-body dark--weather": "card card-body"}>
                                <h3>{unixToPST(hour["dt"])}</h3>
                                <h3>{translateWeather(hour["temp"])} &#8457;</h3>
                                <img src={`https://openweathermap.org/img/wn/${hour["weather"][0]["icon"]}@4x.png`} alt="weather icon"/>
                                <h3>{unixToDate(hour["dt"])}</h3>
                                <h3>{unixToDayName(hour["dt"])}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="d-flex flex-column weather--box forecast--complete">
                <div>
                    {weatherData["daily"].map(day =>
                        <div className={darkMode === true ? "card daily--weather forecast--complete dark--weather" : "card forecast--complete daily--weather"}>
                            <div className="daily--weather--formatting">
                                <h2 className="daily--day">{unixToDate(day["dt"])}</h2>
                                <img className="weather--image" src={`https://openweathermap.org/img/wn/${day["weather"][0]["icon"]}@4x.png`} alt="weather icon"/>
                                <h2 className="temperature--daily">{translateWeather(day["temp"]["day"])} &#8457;</h2>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}