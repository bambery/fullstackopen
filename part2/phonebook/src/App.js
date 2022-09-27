import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Numbers = ({ persons }) =>{
    return(
        <div>
            <h3>Numbers</h3>
            <div>
                {persons.map(person=>
                    <Person key={person.name} person={person}/>
                )}
            </div>
        </div>
    )
}

const Person = ({ person }) => {
    return <div>{person.name} {person.number}</div>
}

const Filter = ( props ) =>{  
    const { handleFilterChange, filter } = props
    return (
        <div>
            filter shown with: <input 
                id="filter"
                onChange={handleFilterChange}
                value={filter}
            />
        </div>
    )
}

const PersonForm = (props) => {
    const {addName, handleNameChange, newName, handleNumberChange, newNumber} = props
    return (
            <form onSubmit={addName}>
                <h3>add a new</h3>
                <div>
                    name: <input 
                        onChange={handleNameChange}
                        value={newName}
                    />
                </div>
                <div>
                    number: <input 
                        onChange={handleNumberChange}
                        value={newNumber}
                    />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
    )

}

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons=> {
                setPersons(initialPersons)
            })

    }, [])

    
    // for controlling form input element
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) =>{
        setNewNumber(event.target.value)
    }
    
    const handleFilterChange = (event) =>{
        setFilter(event.target.value)
    }

    const personsToShow = 
        // show all if filter is blank
        filter 
        ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        : persons

    const addName = (event)=>{
        event.preventDefault()
        // ignore clicks if either name or number are missing
        if(!(newName && newNumber)){return}
        // no dupe names - dupe numbers are  fine since there is often more than one person in a household
        if( persons.find( person => person.name === newName)){
            alert(`${newName} is already added to the phonebook`)
        } else {
            const nameObject = {
                name: newName,
                number: newNumber
            }

            personService
                .create(nameObject)
                .then( returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                })

        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter handleFilterChange={handleFilterChange} filter={filter}/>
            <PersonForm addName={addName} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber} />
            <Numbers persons={personsToShow} />
        </div>
    )
}

export default App;
