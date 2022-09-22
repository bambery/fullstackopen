import { useState } from 'react'
const Numbers = ({ persons }) =>{
    return(
        <div>
            {persons.map(person =>
                <div key={person.name}>{person.name} {person.number}</div>
            )}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas',
          number: '040-1234567'
        }
    ]) 
    // for controlling form input element
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const addName = (event)=>{
        event.preventDefault()
        // don't add entries that do not have all fields 
        if( !(newName && newNumber)){ return }
        const nameObject = {
            name: newName,
            number: newNumber
        }

        setPersons(persons.concat(nameObject))
        setNewName('')
        setNewNumber('')
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={addName}>
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
            <h2>Numbers</h2>
            <Numbers persons={persons} />
        </div>
    )
}

export default App;
