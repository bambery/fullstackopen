import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser]= useState(null)
    const [notification, setNotification] = useState(null)
    const [newBlogVisible, setNewBlogVisible] = useState(false)

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

    const displayNotification = ( options ) => {
        setNotification(options)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    const handleLogin = async (loginInfo) => {
        try {
            const user = await loginService.login(loginInfo)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            displayNotification({ 'message': `${user.username} logged in!`, 'type': 'alert' })
        } catch (exception) {
            displayNotification({ 'message': 'Username or password is incorrect', 'type': 'error' })
        }
    }

    const handleLogout = () => {
        displayNotification({ 'message': `${user.username} logged out!`, 'type': 'alert' })
        logUserOut()
    }

    const logUserOut = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.unsetToken()
        setUser(null)
    }

    const addBlog = blogObject => {
        blogService
            .create(blogObject)
            .then( returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                setNotification({ 'message': `${returnedBlog.title} by ${returnedBlog.author} added`, 'type':'alert' })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            })
            .catch(error => {
                if (error.response.data.error.includes('token expired')) {
                    setNotification({ 'message': `${error.response.data.error}`, 'type':'error' })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                    logUserOut()
                } else {
                    setNotification({ 'message': `${error.response.data.error}`, 'type':'error' })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                }
            })
        toggleNewBlogVisibility()
    }

    const updateBlog = (blog) => {
        blogService
            .update(blog)
            .then(returnedBlog => {
                setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
            })
            .catch(error => {
                if (error.response.data.error.includes('token expired')) {
                    setNotification({ 'message': `${error.response.data.error}`, 'type':'error' })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)

                    logUserOut()
                } else {
                    setNotification({ 'message': `${error.response.data.error}`, 'type':'error' })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                }
            })
    }

    const displayDelete = (blog) => {
        return user.id === blog.user.id ? true : false
    }

    const deleteBlog = (blog) => {
        blogService
            .destroy(blog.id)
            .then(() => {
                setBlogs(blogs.filter(b => b.id !== blog.id))
                setNotification({ 'message': `Blog post titled '${blog.title}' has been deleted.`, 'type': 'alert' })

            })
            .catch(error => {
                if (error.response.data.error.includes('token expired')) {
                    setNotification({ 'message': `${error.response.data.error}`, 'type':'error' })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)

                    logUserOut()
                } else {
                    setNotification({ 'message': `${error.response.data.error}`, 'type':'error' })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                }
            })
    }


    const blogList = () => (
        <div className="blog-list">
            { blogs
                .sort((a, b) => { return a.likes > b.likes ? -1 : 1 })
                .map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        updateBlog={updateBlog}
                        displayDelete={displayDelete(blog)}
                        deleteBlog={deleteBlog}
                    />
                )
            }
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

    const toggleNewBlogVisibility = () => {
        setNewBlogVisible(!newBlogVisible)
    }

    return (
        <div>
            { pageHeader() }
            <Notification notification={notification} />
            <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
            <Toggleable buttonLabel="new blog" visibleState={newBlogVisible} toggle={toggleNewBlogVisibility}>
                <BlogForm addBlog={addBlog} />
            </Toggleable>
            { user && blogList() }
        </div>
    )
}

export default App
