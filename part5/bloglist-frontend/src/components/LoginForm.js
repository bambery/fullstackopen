import React from 'react'
import { useState, useEffect } from 'react'

const LoginForm = (props) => {
    const { user, handleLogin, handleLogout } = props

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginSubmit = (event) => {
        event.preventDefault()
        const loginInfo = { username, password }
        handleLogin(loginInfo)
        setUsername('')
        setPassword('')
    }

    const loginForm = () => (
        <form onSubmit={ handleLoginSubmit }>
            <h2>log in to application</h2>
            <div>
                username
                <input
                    type="text"
                    value={ username }
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={ password }
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const loggedInForm = () => (
        <div>
            {user.name} is logged in.
            <button onClick={handleLogout}>logout</button>
        </div>
    )

    return (
        <div>
            { user
                ? loggedInForm()
                : loginForm()
            }
        </div>
    )
}

export default LoginForm
