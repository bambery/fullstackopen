import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import NumberList from './components/NumberList'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
    const [persons, setPersons] = useState([])
    const [notification, setNotification] = useState(null)

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

    const deletePerson = (person) => {
        const { id } = person
        if (window.confirm(`Delete ${person.name}?`)){
            personService
                .destroy(id)
                .then( () => {
                    setPersons(persons.filter(person => person.id !== id))
                    setNotification({'message': `${person.name} has been deleted.`,'type': "alert"} )
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
                .catch( e => {
                    setNotification({'message':`${person.name} has already been removed from the server`, 'type':'error'})
                    setPersons(persons.filter(person => person.id !== id))
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
        }
    }

    const addPerson = (event)=>{
        event.preventDefault()
        // ignore clicks if either name or number are missing
        if(!(newName && newNumber)){return}

        // if the person exists, update that entry instead
        const person = persons.find( person => person.name === newName)
        if(person){
            const updatedPerson = { ...person, number: newNumber}
            personService
                .update(updatedPerson)
                .then(returnedPerson => {
                    setPersons(persons.map( p => p.id !== person.id ? p : returnedPerson))
                    setNotification({'message': `${returnedPerson.name} has been updated`, 'type':'alert'})
                    setTimeout(() =>{
                        setNotification(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error)
                    setNotification({'message': error.response.data.error, 'type': 'error'})
                    setTimeout(() =>{
                        setNotification(null)
                    }, 5000)
                })
        } else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            personService
                .create(personObject)
                .then( returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setNotification({'message': `${returnedPerson.name} has been added.`, 'type': 'alert'})
                    setTimeout(() =>{
                        setNotification(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setNotification({'message': error.response.data.error, 'type': 'error'})
                    setTimeout(() =>{
                        setNotification(null)
                    }, 5000)
                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notification} />
            <Filter handleFilterChange={handleFilterChange} filter={filter}/>
            <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber} />
            <NumberList persons={personsToShow} deletePerson={deletePerson} />
        </div>
    )
}

export default App;
