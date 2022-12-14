import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

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
            <div>
                username
                <input
                    data-cy='login-username'
                    type='text'
                    value={ username }
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    data-cy='login-password'
                    type='password'
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

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired
}

export default LoginForm
