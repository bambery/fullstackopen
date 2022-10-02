import React from 'react' 
import Person from './Person'

const NumberList = ({ persons, deletePerson }) =>{
    return(
        <div>
            <h3>Numbers</h3>
            <div>
                {persons.map(person=>
                    <Person key={person.name} person={person} deletePerson={deletePerson}/>
                )}
            </div>
        </div>
    )
}

export default NumberList
