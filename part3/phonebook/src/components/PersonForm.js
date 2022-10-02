import React from 'react'

const PersonForm = (props) => {
    const {addPerson, handleNameChange, newName, handleNumberChange, newNumber} = props
    return (
            <form onSubmit={addPerson}>
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

export default PersonForm
