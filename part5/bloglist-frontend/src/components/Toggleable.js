import { useState } from 'react'

const Toggleable = ( props ) => {

    const hideWhenVisible = { display: props.visibleState ? 'none' : '' }
    const showWhenVisible = { display: props.visibleState ? '' : 'none' }

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={props.toggle}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={props.toggle}>cancel</button>
            </div>
        </div>
    )
}

export default Toggleable
