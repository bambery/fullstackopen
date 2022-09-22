import { useState } from 'react'

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
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
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
            setPersons(persons.concat(nameObject))
            setNewName('')
            setNewNumber('')
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
