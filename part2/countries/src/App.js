import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchBox = ( { searchString, handleSearchChange } ) => {
    return(
        <div> 
            <label htmlFor="searchFilter">find countries </label>
            <input 
                name="searchFilter"
                placeholder=""
                value={searchString}
                onChange={handleSearchChange}
            />
        </div>
    )}

const Weather = ({ country })=> {
    const [ lat, lon ] = country.latlng
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    const [ weather, setWeather] = useState(null)
  
    useEffect(()=> {
        axios
            .get(weatherAPI)
            .then(response => {
                setWeather(response.data)
            })
            .catch(error => {
                console.log('error: ', error)
            })
    }, [])


    return(
        <div>
            { weather && <WeatherDetail capital={country.capital[0]} weather={weather} /> }
        </div>
    )
    
}

const WeatherDetail = ({ capital, weather }) => {
    return(
        <div>
            <h2>Weather in {capital}</h2> 
            <div>temperature {weather.main.temp} Celcius</div>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            <div>wind {weather.wind.speed} m/s</div>
        </div>
    )
}

// the cca3 seems to exist and be unique for each entry. 
const Country = ({ country }) =>{
    return(
        <div>
            <h1>{country.name.common}</h1>
            <div>
                <div>capital: {country.capital[0]}</div>
                <div>area: {country.area}</div>
            </div>
            <h2>languages:</h2>
            <ul>
                {Object
                        .keys(country.languages)
                        .map(k => 
                            <li key={k}>{country.languages[k]}</li>
                        )}
            </ul>
            <div style={{fontSize:"8rem"}}>
                {country.flag}
            </div>
            <Weather country={country} />
        </div>)
}


const CountryListItem = ({ country, handleCountryListButtonClick}) => {
    return( 
        <div>
            <span>{country.name.common}</span>
            <button onClick={e => handleCountryListButtonClick(e, country)} country={country}>show</button>
        </div> 
    )
}

const Countries = ( props ) => {
    const { searchString, results, handleCountryListButtonClick } = props 

    if( !searchString ){
        return( <div>Please enter a search term.</div> )

    } else if (results.length === 0){
        return( <div>No results: please try another search.</div> )

    } else if( results.length === 1 ){
        return( <Country key={results[0].cca3} country={results[0]} /> )

    } else if( results.length <= 10 && results.length > 0 ){
        return(
            <div >
                {results.map(country => 
                    <CountryListItem key={country.cca3} country={country} handleCountryListButtonClick={handleCountryListButtonClick}/>
                )} 
            </div>)
    } else { 
        return(
            <div>Too many matches, please specify another filter.</div>
    )}
}

const App = () => {
    const [ countries, setCountries ] = useState([])
    const [ searchString, setSearchString ] = useState('')
    const [ results, setResults ] = useState('')

    const countryURL ='https://restcountries.com/v3.1/all'

    useEffect(() => {
        axios
            .get(countryURL)
            .then(response => {
                setCountries( response.data )
            })
    }, [])

    const handleSearchChange = (event) => {
        const search = event.target.value
        const toShow = search
            ? countries.filter( country => country.name.common.toUpperCase().indexOf(search.toUpperCase()) > -1)
            : [] 
        setSearchString(search)
        setResults(toShow)
    }

    const handleCountryListButtonClick = (event, country) => {
        event.preventDefault()
        setResults([country])
    }

    return (
        <div> 
            <SearchBox searchString={searchString} handleSearchChange={handleSearchChange} />
            <Countries results={results} searchString={searchString} handleCountryListButtonClick={handleCountryListButtonClick}/>
        </div>
    );
}

export default App;
