import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {

    const [visible, setVisible] = useState(false)

    const hideDetails = { display: visible ? '' : 'none' }

    const toggleDetails = () => {
        setVisible(!visible)
    }
    const incrementLikes = () => {
        const blogObject = {...blog, likes: blog.likes + 1}
        updateBlog(blogObject)
    }

    return (
        <div className="blog-item">
            {blog.title} {blog.author} <button onClick={toggleDetails}>{visible ? 'hide' : 'show'}</button>
            <div style={hideDetails}>
                <div>{blog.url}</div>
                <div>likes: {blog.likes} <button onClick={incrementLikes}>like</button></div>
                <div>{blog.user.name}</div>
            </div>
        </div>
    )
}


export default Blog
