import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
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

    const handleLogin = async (loginInfo) => {
        try {
            const user = await loginService.login(loginInfo)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
        } catch (exception) {
            alert('Username or password is incorrect')
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.unsetToken()
        setUser(null)
    }

    const addBlog = (blogObject) => {
        console.log(`you made it to addblog`)
        blogService
            .create(blogObject)
            .then( returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
            })
            .catch(error => {
                console.log(error.response.data.error)
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

    const blogHeader = () => (
        <h2>blogs</h2>
    )

    return (
        <div>
            { user && blogHeader() }
            <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
            { user && blogList() }
        </div>
    )
}

export default App
