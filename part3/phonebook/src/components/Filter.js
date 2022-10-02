import React from 'react'

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

export default Filter
