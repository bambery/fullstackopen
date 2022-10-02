import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'
import NumberList from './components/NumberList'
import Person from './components/Person'
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

        const person = persons.find( person => person.name === newName)
        if(person){
            /*
            **** exercise 3.9 says PUT/updates will be implemented in exercise 3.17
            *
            const confirmationMessage=`${person.name} is already in the phonebook. Replace the old number (${person.number}) with a new one (${newNumber})?`
            if( window.confirm(confirmationMessage) ){
                const updatedPerson = {...person, number: newNumber}
                personService
                    .update(updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map( p => p.id !== person.id ? p : returnedPerson))
                        setNewName('')
                        setNewNumber('')
                        setNotification({'message': `${returnedPerson.name} has been updated`, 'type':'alert'})
                        setTimeout(() =>{
                            setNotification(null)
                        }, 5000)
                    })
            }
            */
            setNotification( {'message': `${person.name} is already in the phonebook`, 'type': 'error'})
            setTimeout(()=> {
                setNotification(null)
            }, 5000)
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
                    setNotification({'message': `${returnedPerson.name} has been added.`, 'type': 'alert'})
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
