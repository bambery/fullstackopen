import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser]= useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if(loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            alert('Username or password is incorrect')
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const loginForm = () => (
        <form onSubmit={ handleLogin }>
            <h2>log in to application</h2>
            <div>
                username
                <input
                    type="text"
                    value={ username }
                    name = "Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={ password }
                    name = "password "
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const blogList = () => (
        <div>
            <button onClick={handleLogout}>logout</button>
            <h2>blogs</h2>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )

    return (
        <div>
            { user
                ? blogList()
                : loginForm()
            }
        </div>
    )
}

export default App
