import { useState } from 'react'
const Numbers = ({ numbers }) =>{
    return(
        <div>
            {numbers.map(number =>
                <div key={number.name}>{number.name}</div>
            )}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas' }
    ]) 
    // for controlling form input element
    const [newName, setNewName] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const addName = (event)=>{
        event.preventDefault()
        const nameObject = {
            name: newName
        }

        setPersons(persons.concat(nameObject))
        setNewName('')
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
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <Numbers numbers={persons} />
        </div>
    )
}

export default App;
