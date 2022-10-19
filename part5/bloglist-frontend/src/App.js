import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser]= useState(null)
    const [notification, setNotification] = useState(null)

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

    const handleLogin = async (loginInfo) => {
        try {
            const user = await loginService.login(loginInfo)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setNotification({'message': `${user.username} logged in!`, 'type': 'alert'})
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        } catch (exception) {
            setNotification({'message': 'Username or password is incorrect', 'type': 'error'})
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.unsetToken()
        setNotification({'message': `${user.username} logged out!`, 'type': 'alert'})
        setTimeout(() => {
            setNotification(null)
        }, 5000)
        setUser(null)
    }

    const addBlog = (blogObject) => {
        blogService
            .create(blogObject)
            .then( returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                setNotification({'message': `${returnedBlog.title} by ${returnedBlog.author} added`, 'type':'alert'})
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            })
            .catch(error => {
                console.log(error.response.data.error)
                setNotification({'message': `${error.response.data.error}`, 'type':'error'})
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
                if (error.response.data.error.includes('token expired')) {
                    handleLogout()
                }
            })
    }

    const blogList = () => (
        <div>
            <BlogForm addBlog={addBlog} />
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )

    const pageHeader = () => (
        <div>
            { user
                ? <h2>blogs</h2>
                : <h2>log in to application</h2>
            }
        </div>
    )

    return (
        <div>
            { pageHeader() }
            <Notification notification={notification} />
            <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
            { user && blogList() }
        </div>
    )
}

export default App
