import { useState } from 'react'

const Blog = ({ blog }) => {
    const [visible, setVisible] = useState(false)

    const hideDetails = { display: visible ? '' : 'none' }

    const toggleDetails = () => {
        setVisible(!visible)
    }

    return (
        <div className="blog-item">
            {blog.title} {blog.author} <button onClick={toggleDetails}>{visible ? 'hide' : 'show'}</button>
            <div style={hideDetails}>
                <div>{blog.url}</div>
                <div>likes: {blog.likes} <button>like</button></div>
                <div>{blog.user.name}</div>
            </div>
        </div>
    )
}


export default Blog
