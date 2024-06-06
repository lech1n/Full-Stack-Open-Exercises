import { useState , useEffect } from "react"
import axios from "axios"
import axiosRetry from "axios-retry"

axiosRetry(axios, {
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status >= 500
  },
})

const WeatherData = ({country}) =>{
  const [weatherData , setWeatherData] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY
  useEffect(() => {
    if(country){
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${api_key}&units=metric`)
    .then(response => {
      setWeatherData(response.data)
    })
    .catch(error => {
      console.error("Error fetching countries data:", error.message)
    })
  }
  } , [country])

  if (!weatherData) return <p>Loading weather data...</p>


   return(
    <>
     <h2>Weather in: {country}</h2>
     <p>Temperature: {weatherData.main.temp} °C</p>
     <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon"/>
     <p>Wind speed: {weatherData.wind.speed} m/s</p>
   </>
   )
}

const SingleCountry = ({country}) =>{
  return(
    <>
     <div key={country.cca3}>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>

      <h2>Languages:</h2>
      <ul>
        {Object.entries(country.languages).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" />

      <div>
        <WeatherData country={country.capital}/>
      </div>
    </div>
      </>
  )
}

const AllCountries = ({filteredCountries , onShow, selectedCountry}) =>{

  return(
    <>
    {filteredCountries.map((country) => (
    <div key={country.cca3} style={{display:"flex", flexDirection:"column"}}>
    <div style={{display:"flex" , gap:"15px"}}>
     <p>{country.name.common}</p>
     <button  style={{height:"30px"}} onClick={() => {onShow(country)}}>Show</button>
     </div>
     <div>
     {selectedCountry && selectedCountry.cca3 === country.cca3 && (
            <SingleCountry country={selectedCountry} />
          )}
     </div>
     </div>
    ))}
  </>
  )
}


const CountrySearch = ({filteredCountries ,  onShow, selectedCountry}) => {
  if(filteredCountries.length > 10 ){
    return <p>Too many matches, specify another filter</p>
  } else if(filteredCountries.length === 1){
    return <SingleCountry country={filteredCountries[0]} />
  }
  else {
    return <AllCountries filteredCountries={filteredCountries} onShow={onShow} selectedCountry={selectedCountry}/>
  }
}

const App = () => {
  const [searchValue , setSearchValue] = useState("")
  const [countries , setCountries] = useState([])
  const [filteredCountries , setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.error("Error fetching countries data:", error.message)
      })
  }, [])

  const handleSearchChange = (e) =>{
    const searchQuery= e.target.value
    setSearchValue(searchQuery)
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCountries(filtered)
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }
  
  return (
    <>
    <div>
      <input type="text" value={searchValue} onChange={handleSearchChange}/>
    </div>
    <div>
      <CountrySearch filteredCountries={filteredCountries} onShow={handleShowCountry} selectedCountry={selectedCountry}/>
    </div>
    </>
  )
}

export default App

