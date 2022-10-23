import { useState } from 'react'

const Blog = ({ blog, updateBlog, displayDelete, deleteBlog }) => {

    const [visible, setVisible] = useState(false)

    const hideDetails = { display: visible ? '' : 'none' }
    const hideDelete  = { display: displayDelete ? '' : 'none' }

    const toggleDetails = () => {
        setVisible(!visible)
    }
    const incrementLikes = () => {
        const blogObject = {...blog, likes: blog.likes + 1}
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
                <div>{blog.url}</div>
                <div>likes: {blog.likes} <button onClick={incrementLikes}>like</button></div>
                <div>{blog.user.name}</div>
                <div style={hideDelete}>
                    <button onClick={handleDeleteBlog} className='delete-btn'>remove</button>
                </div>
            </div>
        </div>
    )
}


export default Blog
