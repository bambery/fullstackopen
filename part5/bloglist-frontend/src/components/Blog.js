import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, displayDelete, deleteBlog }) => {

    const [visible, setVisible] = useState(false)

    const hideDetails = { display: visible ? '' : 'none' }
    const hideDelete  = { display: displayDelete ? '' : 'none' }

    const toggleDetails = () => {
        setVisible(!visible)
    }
    const incrementLikes = () => {
        const blogObject = { ...blog, likes: blog.likes + 1 }
        updateBlog(blogObject)
    }

    const handleDeleteBlog = () => {
        if(window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)){
            deleteBlog(blog)
        }
    }

    return (
        <div className="blog-item">
            {blog.title} {blog.author} <button onClick={toggleDetails}>{visible ? 'hide' : 'show'}</button>
            <div style={hideDetails}>
                <div data-cy="blog-url">{blog.url}</div>
                <div data-cy="blog-likes">likes: {blog.likes} <button data-cy="blog-like-btn" onClick={incrementLikes}>like</button></div>
                <div data-cy="blog-created-user">{blog.user.name}</div>
                <div style={hideDelete}>
                    <button data-cy="delete-btn" onClick={handleDeleteBlog} className='delete-btn'>remove</button>
                </div>
            </div>
        </div>
    )
}

Blog.propTypes = {
    updateBlog: PropTypes.func.isRequired,
    displayDelete: PropTypes.bool.isRequired,
    deleteBlog: PropTypes.func.isRequired
}


export default Blog
